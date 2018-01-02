import React from 'react';
import toast from 'react-toastify';
import './Chat.css';
import axios from 'axios';
import moment from 'moment';

class ChatArea extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			outputText: props.outputText,
			loggedIn: props.loggedIn,
			username: props.username,
			channel: props.channel,
			channels: props.channels,
			ignoredUsers: [],
			pollInterval: 5 * 1000
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleJoinChannel = this.handleJoinChannel.bind(this);
		this.handlePartChannel = this.handlePartChannel.bind(this);
		this.handleSay = this.handleSay.bind(this);
		this.handleUnknownCommand = this.handleUnknownCommand.bind(this);
		this.startPolling = this.startPolling.bind(this);
		this.asyncInterval = this.asyncInterval.bind(this);
		this.onDropdownSelected = this.onDropdownSelected.bind(this);
	}

	componentDidMount () {
		this.startPolling();
	}

	componentWillUnmount () {
		this.stopPolling();
	}

	updateChannelContents () {
		if (!this.state.loggedIn) {
			return;
		}
		let oldOutputText = this.state.outputText;
		axios.post('http://localhost:3000/comments/',
			{
				channel: this.state.channel,
				ignoredUsers: this.state.ignoredUsers
			}).then(function (response) {
				if (response != null && response.data != null) {
					var text = 'Messages in channel ' + this.state.channel + ': ';
					response.data.forEach(function (entry) {
						text = text + '\n' + moment(entry.creationTime).local().format('YYYY-MM-DD HH:mm:ss') + ': ' + entry.username + ': ' + entry.contents;
					});
					if (text === oldOutputText) {
						let oldPollInterval = this.state.pollInterval;
						this.setState({
							pollInterval: Math.min(oldPollInterval + 3 * 1000, 60 * 1000),
							outputText: text
						});
					} else {
						this.setState({
							pollInterval: 3 * 1000,
							outputText: text
						});
					}
				}
			}.bind(this));
	};

	startPolling () {
		if (this.interval) return;
		this.keepPolling = true;
		this.asyncInterval(this.state.pollInterval, function (response) {
			this.updateChannelContents();
		}.bind(this));
	}

	stopPolling () {
		this.keepPolling = false;
		if (this.interval) clearTimeout(this.interval);
	}

	asyncInterval (intervalDuration, fn) {
		const promise = fn(this.getProps(), this.props.dispatch);
		const asyncTimeout = () => setTimeout(() => {
			this.asyncInterval(intervalDuration, fn);
		}, this.state.pollInterval);
		const assignNextInterval = () => {
			if (!this.keepPolling) {
				this.stopPolling();
				return;
			}
			this.interval = asyncTimeout();
		};

		Promise.resolve(promise)
            .then(assignNextInterval)
            .catch(assignNextInterval);
	}

	getProps () {
		return {
			...this.props,
			startPolling: this.startPolling,
			stopPolling: this.stopPolling,
			isPolling: Boolean(this.interval)
		};
	}
    
	componentWillReceiveProps (nextProps) {
		this.setState({
			loggedIn: nextProps.loggedIn,
			outputText: nextProps.outputText,
			username: nextProps.username,
			channel: nextProps.channel,
			channels: nextProps.channels
		});
	}

	onDropdownSelected (event) {
		this.setState({
			channel: event.target.value
		}, function () {
			this.updateChannelContents();
		});
	}

	handleInputChange (event) {
		this.setState({
			inputText: event.target.value
		});
	}

	handleUpdate (event) {
		this.updateChannelContents();
	}

	handleJoinChannel () {
		let newChannel = this.state.inputText.substring(6);
		let newChannelList = this.state.channels;
		for (var i = 0; i < newChannelList.length; i++) {
			if (newChannelList[i].key === newChannel) {
				toast.error('You are already in that channel!', {
					position: toast.POSITION.TOP_CENTER
				});
				return;
			}
		}

		newChannelList.push(<option key={newChannel} value={newChannel}>{newChannel}</option>);
		this.setState({
			channel: newChannel,
			channels: newChannelList,
			inputText: ''
		}, function () {
			this.updateChannelContents();
		});
	}

	handleIgnoreUser () {
		let userToIgnore = this.state.inputText.substring(8);
		let alreadyIgnoredUsers = this.state.ignoredUsers;
		for (var i = 0; i < alreadyIgnoredUsers.length; i++) {
			if (alreadyIgnoredUsers[i] === userToIgnore) {
				toast.error('You are already ignoring that user!', {
					position: toast.POSITION.TOP_CENTER
				});
				return;
			}
		}

		alreadyIgnoredUsers.push(userToIgnore);
		this.setState({
			ignoredUsers: alreadyIgnoredUsers,
			inputText: ''
		}, function () {
			this.updateChannelContents();
		});
	}

	handleUnignoreUser () {
		let userToUnignore = this.state.inputText.substring(8);
		let alreadyIgnoredUsers = this.state.ignoredUsers;

		var index = -1;
		for (var i = 0; i < alreadyIgnoredUsers.length; i++) {
			if (alreadyIgnoredUsers[i] === userToUnignore) {
				index = i;
			}
		}

		if (!(index === -1)) {
			alreadyIgnoredUsers.splice(index, 1);
		} else {
			toast.error('You are not ignoring that user!', {
				position: toast.POSITION.TOP_CENTER
			});
			return;
		}

		this.setState({
			ignoredUsers: alreadyIgnoredUsers,
			inputText: ''
		}, function () {
			this.updateChannelContents();
		});
	}

	handlePartChannel () {
		if (this.state.channels.length === 1) {
			toast.error('You cannot leave your only channel!', {
				position: toast.POSITION.TOP_CENTER
			});
			return;
		}

		var index = -1;
		let toLeaveChannel = this.state.inputText.substring(6);
		let newChannelList = this.state.channels;
		for (var i = 0; i < newChannelList.length; i++) {
			if (newChannelList[i].key === toLeaveChannel) {
				index = i;
			}
		}

		if (!(index === -1)) {
			newChannelList.splice(index, 1);
		} else {
			toast.error('You are not in that channel!', {
				position: toast.POSITION.TOP_CENTER
			});
			return;
		}

		if (toLeaveChannel === this.state.channel) {
			this.setState({
				channel: newChannelList[0],
				channels: newChannelList,
				inputText: ''
			});
		} else {
			this.setState({
				channels: newChannelList,
				inputText: ''
			});
		}
	}

	handleSay (text) {
		axios.post('http://localhost:3000/comment', {
			username: this.state.username,
			channel: this.state.channel,
			contents: text
		})
            .then(function (response1) {
	    this.updateChannelContents();
        }.bind(this));

		this.setState({
			inputText: ''
		});
	}

	handleUnknownCommand () {
		toast.error('Unknown command', {
			position: toast.POSITION.TOP_CENTER
		});
	}

	handleSubmit (event) {
		if (this.state.inputText.startsWith('/join ')) {
			this.handleJoinChannel();
		} else if (this.state.inputText.startsWith('/part ')) {
			this.handlePartChannel();
		} else if (this.state.inputText.startsWith('/ignore ')) {
			this.handleIgnoreUser();
		} else if (this.state.inputText.startsWith('/unignore ')) {
			this.handleUnignoreUser();
		} else if (this.state.inputText.startsWith('/say ')) {
			let input = this.state.inputText.substring(5);
			this.handleSay(input);
		} else if (this.state.inputText.startsWith('/')) {
			let input = this.state.inputText.substring(5);
			this.handleUnknownCommand(input);
		} else {
			let input = this.state.inputText;
			this.handleSay(input);
		}

        // Focus back to the input element for convenience.
		this.textInput.focus();
	}

	render () {
		let selectItems = this.state.channels;
		return (
            <div className='Chat-main-container'>
                <div className='Chat-fixer-container'>
                    <textarea className='Chat-messages' disabled='true' value={this.state.outputText} />
                    <br />
                    <input className='Chat-inputCommand'
                        ref={(input) => { this.textInput = input; }}
                        value={this.state.inputText} onChange={this.handleInputChange} />
                    <button onClick={this.handleSubmit}>
                        Send
                    </button>
                    <button onClick={this.handleUpdate}>
                        Update
                    </button>
                    <br />
                    <label>
                        Your channel
                    <select className='Chat-channel-dropdown' value={this.state.channel}
                            onChange={this.onDropdownSelected}>
                            {selectItems}
                        </select>
                    </label>
                    <br />
                    <label>
                        You are known as {this.state.username}
                    </label>
                </div>
            </div>
		);
	}
}

export default ChatArea;

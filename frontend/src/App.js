import React from 'react';
import { ToastContainer } from 'react-toastify';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/Login';
import ChatArea from './components/Chat';

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			loggedIn: false,
			channels: []
		};

		this.handleSend = this.handleSend.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleFetch = this.handleFetch.bind(this);
	}

	handleChange (event) {
		this.setState({ value: event.target.value });
	}

	handleLogin (paramName, paramChannel) {
		let channelList = [];
		channelList.push(<option key={paramChannel} value={paramChannel}>{paramChannel}</option>);
		this.setState({
			loggedIn: true,
			name: paramName,
			channel: paramChannel,
			channels: channelList
		});
	}

	handleFetch (output) {
		this.setState({
			outputText: output
		});
	}

	handleSend (event) {
		this.setState({
			loggedIn: true
		});
		event.preventDefault();
	}

	render () {
		if (this.state.loggedIn) {
			return (
        <div>
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <h1 className='App-title'>Welcome to Web-IRC</h1>
                </header>
            </div>
            <ToastContainer autoClose={5000} />
            <ChatArea loggedIn={this.state.loggedIn} username={this.state.name}
                outputText={this.state.outputText}
                channel={this.state.channel}
                channels={this.state.channels} />
        </div>
			);
		} else {
			return (
        <div>
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <h1 className='App-title'>Welcome to Web-IRC</h1>
                </header>
            </div>
            <ToastContainer autoClose={5000} />
            <LoginForm onLogin={this.handleLogin} onFetch={this.handleFetch} />
        </div>
			);
		}
	}
}

export default App;

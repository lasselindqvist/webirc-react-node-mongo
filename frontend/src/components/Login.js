import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './Login.css';
import axios from 'axios';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            channel: '',
            channels: [],
            loggedIn: props.loggedIn,
            touched: {
                name: false,
                channel: false
            }
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    handleChannelChange(event) {
        let channelList = [];
        channelList.push(event.target.value);
        channelList.push(<option key={event.target.value} value={event.target.value}>{event.target.value}</option>);
        this.setState({
            channel: event.target.value,
            channels: channelList
        });
    }

    validate(name, channel) {
        return {
            name: name == null || name.length === 0,
            channel: channel == null || channel.length === 0
        };
    }

    canBeSubmitted() {
        const errors = this.validate(this.state.name, this.state.channel);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
    }

    handleSubmit(event) {
        if (!this.canBeSubmitted()) {
            event.preventDefault();
            return;
        }

        axios.post('http://localhost:3000/login',
            {
                username: this.state.name,
                channel: this.state.channel
            })
            .then(function (response) {
                if (response != null && response.data != null && response.data.errors) {
                    toast.error(response.data.errors, {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    this.setState({ loggedIn: true });
                    this.props.onLogin(this.state.name, this.state.channel);
                }
            }.bind(this));
    }


    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    }

    render() {
        const errors = this.validate(this.state.name, this.state.channel);
        const isLoginButtonDisabled = Object.keys(errors).some(x => errors[x]);
        const shouldMarkError = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];
            return hasError ? shouldShow : false;
        };
        return (
            <div className='Login-main-container'>
                <div className='Login-fixer-container'>
                    <div>
                        <input placeholder='Name...' type='text' className={shouldMarkError('name') ? 'Login-error' : ''}
                            value={this.state.name} onChange={this.handleNameChange} onBlur={this.handleNameBlur} />
                    </div>
                    <div>
                        <input placeholder='Channel...' type='text' className={shouldMarkError('channel') ? 'Login-error' : ''}
                            value={this.state.channel} onChange={this.handleChannelChange} onBlur={this.handleBlur('channel')} />
                    </div>
                    <div>
                        <button disabled={isLoginButtonDisabled} onClick={this.handleSubmit}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}

export default LoginForm;
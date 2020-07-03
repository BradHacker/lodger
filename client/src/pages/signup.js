import React from 'react';
import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import API from '../api';

export default class Signup extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      username: '',
      password: '',
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    document.getElementById('name').focus();
  }

  onNameChange(e) {
    const { value } = e.target;
    this.setState({ name: value });
  }

  onUsernameChange(e) {
    const { value } = e.target;
    this.setState({ username: value });
  }

  onPasswordChange(e) {
    const { value } = e.target;
    this.setState({ password: value });
  }

  onFormSubmit(e) {
    const { name, username, password } = this.state;
    e.preventDefault();

    if (/\s/.test(username)) {
      document.getElementById('username').focus();
      return this.setState({ error: { message: 'No spaces are allowed in usernames.' } });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      document.getElementById('password').focus();
      return this.setState({ error: { message: "Your password doesn't meet the requirements." } });
    }

    API.post('/users/register', { name, username, password })
      .then((response) => response.json())
      .then(
        (response) => {
          if (response.success === true) {
            console.log(response);
            return (window.location.href = '/');
          }
          this.setState({ error: response.error });
          document.getElementById('username').focus();
        },
        (err) => console.error.bind(err)
      );
  }

  render() {
    const { name, username, password, error } = this.state;
    return (
      <div className="login-container">
        <form className="signup-form" onSubmit={this.onFormSubmit}>
          <img className="logo" src={Logo} alt="Lodger logo" />
          {error && <p className="error">{error.message || 'An unknown error ocurred, please contact support'}</p>}
          <input type="text" id="name" placeholder="Name" onChange={this.onNameChange} value={name} />
          <input type="text" id="username" placeholder="Username" onChange={this.onUsernameChange} value={username} />
          <div className="help-block">
            <p className={`help ${username !== '' ? (/\s/.test(username) ? 'invalid' : 'valid') : ''}`}>
              - Cannot contain spaces
            </p>
          </div>
          <input type="password" id="password" placeholder="Password" onChange={this.onPasswordChange} value={password} />
          <div className="help-block">
            <p className="help">Must Contain:</p>
            <p className={`help ${password !== '' ? (password.length >= 8 ? 'valid' : 'invalid') : ''}`}>
              - Must be 8 characters
            </p>
            <p className={`help ${password !== '' ? (/[A-Z]/.test(password) ? 'valid' : 'invalid') : ''}`}>
              - At least one capital letter
            </p>
            <p className={`help ${password !== '' ? (/[a-z]/.test(password) ? 'valid' : 'invalid') : ''}`}>
              - At least one lowercase letter
            </p>
            <p className={`help ${password !== '' ? (/[0-9]/.test(password) ? 'valid' : 'invalid') : ''}`}>
              - At least one number
            </p>
          </div>
          <button type="submit" disabled={username === '' || password === '' || name === ''}>
            Signup
          </button>
          <Link to="/login">I Already Have An Account</Link>
        </form>
      </div>
    );
  }
}

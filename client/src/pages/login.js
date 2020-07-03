import React from 'react';
import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import API from '../api';

export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
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
    const { username, password } = this.state;
    e.preventDefault();

    API.post('/users/login', { username, password })
      .then((response) => response.json())
      .then(
        () => {
          window.location.href = '/';
        },
        (err) => this.setState({ error: err })
      );
  }

  render() {
    const { username, password } = this.state;
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onFormSubmit}>
          <img className="logo" src={Logo} alt="Lodger logo" />
          <h4>Login</h4>
          <input type="text" placeholder="Username" onChange={this.onUsernameChange} value={username} />
          <input type="password" placeholder="Password" onChange={this.onPasswordChange} value={password} />
          <button
            type="submit"
            className={username !== '' && password !== '' ? 'active' : ''}
            disabled={username === '' || password === ''}
          >
            Login
          </button>
          <Link to="/signup">Create An Account</Link>
        </form>
      </div>
    );
  }
}

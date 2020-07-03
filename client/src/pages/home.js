import React from 'react';
import Logo from '../assets/logo.svg';
import UserIcon from '../assets/user_icon.svg';
import DownArrow from '../assets/down-arrow.svg';
import { Link } from 'react-router-dom';
import API from '../api';
import UserContext from '../user-context';

export default class Home extends React.Component {
  static contextType = UserContext;

  constructor() {
    super();

    this.state = {
      dropdownToggled: false,
      hotelImage: '',
      hotelName: '',
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.logout = this.logout.bind(this);
    this.generateHotel = this.generateHotel.bind(this);
  }

  compo;

  componentDidMount() {
    document.addEventListener('click', (event) => {
      if (!document.getElementById('dropdownToggle').contains(event.target)) this.setState({ dropdownToggled: false });
    });

    this.generateHotel();
  }

  toggleDropdown() {
    const { dropdownToggled } = this.state;
    this.setState({ dropdownToggled: !dropdownToggled });
  }

  logout() {
    API.get('/users/logout').then((response) => {
      if (response.status === 204) return (window.location.href = '/login');
      this.setState({ error: response });
    });
  }

  generateHotel() {
    API.getJson('https://api.datamuse.com/words?ml=hotel', true).then((hotelNouns) => {
      API.getJson('https://api.datamuse.com/words?rel_jjb=hotel', true).then((hotelAdjectives) => {
        const randomAdj = hotelAdjectives[Math.floor(Math.random() * hotelAdjectives.length)].word;
        const randomNoun = hotelNouns.filter((hn) => hn.tags.includes('n'))[Math.floor(Math.random() * hotelNouns.length)].word;
        this.setState({
          hotelName: `${randomAdj.charAt(0).toUpperCase()}${randomAdj.slice(1)} ${randomNoun
            .charAt(0)
            .toUpperCase()}${randomNoun.slice(1)}`,
        });
      });
    });

    const unsplashUrl = `https://source.unsplash.com/random/?building`;
    API.get(unsplashUrl, true).then((response) => {
      this.setState({ hotelImage: response.url });
    });

    // FOr random city: http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off&limit=1&offset=11235
  }

  render() {
    const { name, username } = this.context,
      { dropdownToggled, hotelName, hotelImage } = this.state;
    return (
      <div className="app-container">
        <div className="nav">
          <Link to="/" className="logo-link">
            <img className="logo" src={Logo} alt="Lodger logo" />
          </Link>
          <div className="account" id="dropdownToggle" onClick={this.toggleDropdown}>
            <img className={`dropdown-toggle ${dropdownToggled ? 'open' : 'collapsed'}`} src={DownArrow} alt="Dropdown arrow" />
            <div>
              <p className="username">{username}</p>
              <p className="name">{name}</p>
            </div>
            <img className="picture" src={UserIcon} alt="User" />
            <div className={`dropdown ${dropdownToggled ? 'open' : 'collapsed'}`}>
              <div className="dropdown-item" onClick={this.logout}>
                Logout
              </div>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="hotel-container">
            <div className="hotel-image-container">
              {hotelImage && (
                <div className="hotel-image-overlay">
                  <img src={hotelImage} alt="Hotel" className="hotel-image" />
                </div>
              )}

              <p className="hotel-name">{hotelName}</p>
            </div>
            <div className="hotel-controls">
              <button type="button" className="hotel-no">
                X
              </button>
              <button type="button" className="hotel-yes">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

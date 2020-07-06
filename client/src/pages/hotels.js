import React from 'react';
import Logo from '../assets/logo.svg';
import UserIcon from '../assets/user_icon.svg';
import DownArrow from '../assets/down-arrow.svg';
import { Link } from 'react-router-dom';
import API from '../api';
import UserContext from '../user-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Hotels extends React.Component {
  static contextType = UserContext;

  constructor() {
    super();

    this.state = {
      hotels: [],
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.logout = this.logout.bind(this);
    this.getHotels = this.getHotels.bind(this);
    this.removeHotel = this.removeHotel.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', (event) => {
      if (!document.getElementById('dropdownToggle').contains(event.target)) this.setState({ dropdownToggled: false });
    });

    this.getHotels();
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

  getHotels() {
    API.getJson('/hotels').then((hotelResults) => {
      this.setState({ hotels: hotelResults.result });
    });
  }

  removeHotel(id, i) {
    const { hotels } = this.state;
    hotels[i].removing = true;
    this.setState({ hotels });
    setTimeout(
      () =>
        API.destroy(`/hotels/${id}`).then((response) => {
          if (response.status === 204) return this.getHotels();
          return response.json().then((result) => this.setState({ error: result.error }));
        }),
      400
    );
  }

  render() {
    const { name, username } = this.context,
      { dropdownToggled, hotels } = this.state;
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
              <div className="dropdown-item">
                <Link to="/">Home</Link>
              </div>
              <div className="dropdown-item">
                <Link to="/hotels">My Hotels</Link>
              </div>
              <div className="dropdown-item" onClick={this.logout}>
                Logout
              </div>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="hotel-list">
            {hotels.map((hotel, i) => (
              <div key={`hotel_${hotel._id}`} className={`hotel-list-item ${hotel.removing ? 'removing' : ''}`}>
                <div className="hotel-image-overlay">
                  <img src={hotel.image} alt="Hotel" className="hotel-image" />
                </div>
                <p className="hotel-name">{hotel.name}</p>
                <p className="hotel-location">
                  {hotel.city}, {hotel.country}
                </p>
                <button type="button" className="hotel-no" onClick={() => this.removeHotel(hotel._id, i)}>
                  <FontAwesomeIcon icon="times" />
                </button>
                <a
                  href={`https://www.google.com/search?q=${hotel.name.replace(' ', '+')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hotel-info"
                >
                  <FontAwesomeIcon icon="info" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

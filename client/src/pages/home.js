import React from 'react';
import Logo from '../assets/logo.svg';
import UserIcon from '../assets/user_icon.svg';
import DownArrow from '../assets/down-arrow.svg';
import { Link } from 'react-router-dom';
import API from '../api';
import UserContext from '../user-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    this.noHotel = this.noHotel.bind(this);
    this.addHotel = this.addHotel.bind(this);
  }

  componentDidMount() {
    this.mounted = true;

    document.addEventListener('click', (event) => {
      if (!document.getElementById('dropdownToggle').contains(event.target)) this.setState({ dropdownToggled: false });
    });

    this.generateHotel();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleDropdown() {
    const { dropdownToggled } = this.state;
    this.setState({ dropdownToggled: !dropdownToggled });
  }

  logout() {
    API.get('/users/logout').then((response) => {
      if (this.mounted) {
        if (response.status === 204) return (window.location.href = '/login');
        return this.setState({ error: response });
      }
    });
  }

  generateHotel() {
    this.setState({ hotelName: '', hotelCity: '', hotelCountry: '', hotelImage: '' });
    API.getJson('https://api.datamuse.com/words?ml=hotel', true).then((hotelNouns) => {
      API.getJson('https://api.datamuse.com/words?rel_jjb=hotel', true).then((hotelAdjectives) => {
        const randomAdj = hotelAdjectives[Math.floor(Math.random() * hotelAdjectives.length)].word;
        const randomNoun = hotelNouns.filter((hn) => hn.tags.includes('n'))[
          Math.floor(Math.random() * hotelNouns.filter((hn) => hn.tags.includes('n')).length)
        ].word;
        if (this.mounted)
          this.setState({
            hotelName: `${randomAdj.charAt(0).toUpperCase()}${randomAdj.slice(1)} ${randomNoun
              .charAt(0)
              .toUpperCase()}${randomNoun.slice(1)}`,
          });
      });
    });

    const unsplashUrl = `https://source.unsplash.com/random/?building`;
    API.get(unsplashUrl, true).then((response) => {
      if (this.mounted) this.setState({ hotelImage: response.url });
    });

    // FOr random city: http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off&limit=1&offset=11235
    API.getJson('http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off', true).then((cityData) => {
      API.getJson(
        `http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off&limit=1&offset=${Math.floor(
          Math.random() * cityData.metadata.totalCount
        )}`,
        true
      ).then((singleCityData) => {
        if (this.mounted)
          this.setState({
            hotelCity: singleCityData.data[0].city,
            hotelCountry: singleCityData.data[0].countryCode,
            yepHotel: false,
            noHotel: false,
          });
      });
    });
  }

  noHotel() {
    this.setState({ noHotel: true });
    setTimeout(() => {
      this.generateHotel();
    }, 300);
  }

  addHotel() {
    this.setState({ yepHotel: true });
    setTimeout(() => {
      const { hotelName, hotelCity, hotelCountry, hotelImage } = this.state;
      API.post('/hotels/new', { name: hotelName, city: hotelCity, country: hotelCountry, image: hotelImage })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) return this.generateHotel();
          return console.error(response);
        });
    }, 300);
  }

  render() {
    const { name, username } = this.context,
      { dropdownToggled, hotelName, hotelImage, hotelCity, hotelCountry, noHotel, yepHotel } = this.state;
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
                <Link to="/">
                  <p>Home</p> <FontAwesomeIcon icon="home" />
                </Link>
              </div>
              <div className="dropdown-item">
                <Link to="/hotels">
                  <p>My Hotels</p> <FontAwesomeIcon icon="list" />
                </Link>
              </div>
              <div className="dropdown-item" onClick={this.logout}>
                <p>Logout</p> <FontAwesomeIcon icon="power-off" />
              </div>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="hotel-container">
            <div className={`hotel-image-container ${noHotel ? 'nope' : yepHotel ? 'yep' : ''}`}>
              {hotelImage && (
                <div className="hotel-image-overlay">
                  <img src={hotelImage} alt="Hotel" className="hotel-image" />
                </div>
              )}

              <p className="hotel-name">{hotelName}</p>
              {hotelCity && (
                <p className="hotel-location">
                  {hotelCity}, {hotelCountry}
                </p>
              )}
            </div>
            <div className="hotel-controls">
              <button
                type="button"
                className="hotel-no"
                disabled={!hotelName || !hotelImage || !hotelCity || !hotelCountry}
                onClick={this.noHotel}
              >
                <FontAwesomeIcon icon="times" />
              </button>
              <button
                type="button"
                className="hotel-yes"
                disabled={!hotelName || !hotelImage || !hotelCity || !hotelCountry}
                onClick={this.addHotel}
              >
                <FontAwesomeIcon icon="plus" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

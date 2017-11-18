const React = require('react');
const Component = require('react').Component;
const RideItem = require('./RideItem');
const Spinner = require('../Spinner');
const Hr = require('../SearchBorder');
const moment = require('moment');
const RideService = require('../RideService');
require('./styles.css');

class Rides extends Component {

  constructor() {
    super();
    this.fetchRides = this.fetchRides.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.onFilterTextChanged = this.onFilterTextChanged.bind(this);
    this.state = {
      loading: false,
      rides: [],
      filteredRides: [],
    };
  }

  componentDidMount() {
    return this.fetchRides();
  }

  onFilterTextChanged(event) {
    const filterTerm = event.target.value.trim();

    function rideFilter(ride) {
      return ride.from.station.location.city
          .toLowerCase()
          .includes(filterTerm.toLowerCase()) ||
        ride.to.station.location.city
          .toLowerCase()
          .includes(filterTerm.toLowerCase());
    }

    this.setState({
      filterTerm,
      filteredRides: filterTerm ? this.state.rides.filter(rideFilter) : this.state.rides,
    });
  }

  setRides(rides) {
    this.setState({
      rides,
      filteredRides: rides,
    });
  }

  startLoading() {
    this.setState({
      loading: true,
    });
  }

  stopLoading() {
    this.setState({
      loading: false,
    });
  }

  fetchRides() {
    /* no-confusing-arrow: false */
    function sortThings(rides) {
      return rides.sort(ride => moment(ride.startData).isSame(new Date(), 'day') &&
          moment(ride.endData).isSame(new Date(), 'day') ? -1 : 1);
    }


    return new Promise(resolve => resolve(this.startLoading))
      .then(RideService.fetch)
      .then(rides => sortThings(rides))
      .then(rides => this.setRides(rides))
      .then(this.stopLoading)
      .catch(err => console.error('Something wrong happened: ', err));
  }

  render() {
    return (
      <div className="rides">
        <Spinner show={this.state.loading} />
        <input
          className="rides--filter"
          placeholder="Search..."
          type="text"
          onChange={this.onFilterTextChanged}
        />
        <Hr defaultWidth={90} filteredItems={this.state.filteredRides} items={this.state.rides} />
        { this.state.rides.length && <ul className="rides--list">
          { this.state.filteredRides.map((ride, index) => <RideItem key={index} ride={ride} />) }
        </ul>}
      </div>
    );
  }

}

module.exports = Rides;

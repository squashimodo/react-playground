const React = require('react');
const ReactDOM = require('react-dom');
const Rides = require('./Rides');
const RideService = require('./RideService');
const moment = require('moment');
require('./styles/styles.css');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Available freerider cars',
      loading: true,
      rides: []
    };
  }
  componentDidMount() {
    setTimeout(this.fetchRides.bind(this), 2000);
  }
  setRides(rides) {
    this.setState(Object.assign({}, this.state, {
      rides,
    }));
  }
  stopLoading() {
    this.setState(Object.assign({}, this.state, { loading: false }));
  }
  fetchRides() {
    /* eslint-disable arrow-body-style */
    return RideService.fetch()
      .then(rides => rides.sort((ride) => {
        return (moment(ride.startData).isSame(new Date(), 'day') &&
          moment(ride.endData).isSame(new Date(), 'day')) ? -1 : 1;
      }))
      .then(rides => this.setRides(rides))
      .then(this.stopLoading.bind(this))
      .catch(err => console.error('Something wrong happened: ', err));
  }
  render() {
    return (
      <div>
        <h1>{this.state.name} <a target="_blank" rel="noopener noreferrer" href="http://hertzfreerider.se/unauth/list_transport_offer.aspx">Book car</a></h1>
        <Rides rides={this.state.rides} loading={this.state.loading} />
      </div>
    );
  }
}

module.exports = App;
ReactDOM.render(<App />, document.getElementById('app'));
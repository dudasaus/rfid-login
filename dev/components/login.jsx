import React from 'react';
import Particle from 'particle-api-js';
import AUTH from '../utils/auth.js';

const TEXT = 0, SCAN = 1;
const FAILED = -1, PENDING = 0, CONNECTED = 1;

class Login extends React.Component {
  constructor() {
    super();

    this.particle = new Particle();

    this.state = {
      phase: TEXT,
      email: '',
      password: '',
      scannerStatus: PENDING
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScan = this.handleScan.bind(this);
  }

  componentDidMount() {
    // Connect to particle event stream
    this.particle.getEventStream({
      deviceId: AUTH.device,
      auth: AUTH.token
    })
    .then((stream) => {
      this.setState({ scannerStatus: CONNECTED });
      stream.on('event', this.handleScan);
    })
    .catch((err) => {
      console.error(err);
      this.setState({ scannerStatus: FAILED });
    });
  }

  // Handle particle scan event
  handleScan(e) {
    if (e.name !== 'rfid-scan' || !e.data || this.state.phase !== SCAN) return;
    console.log(e.data);
  }

  // Handle input changes
  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();
    this.setState({disbaled: true});
    let data = new FormData;
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    fetch('/api/login/', {
      method: 'POST',
      body: data
    }).then((res) => {
      return res.json()
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    })
  }

  // Render login form
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
          placeholder="Password"
        />
        <button>Login</button>
      </form>
    );
  }

  // Render the connection message
  renderConnectionMessage() {
    switch (this.state.scannerStatus) {
      case CONNECTED:
        return (<p>Scanner connected.</p>);
      case PENDING:
        return (<p>Scanner pending...</p>);
      case FAILED:
        return (<p>Scanner failed to connect.</p>);
    }
    return null;
  }

  // Render the component
  render() {
    return (
      <div>
        { this.renderForm() }
        { this.renderConnectionMessage() }
      </div>
    );
  }
}

module.exports = Login;

import React from 'react';
import Particle from 'particle-api-js';
import AUTH from '../utils/auth.js';

const TEXT = 0, SCAN = 1, SCANNING = 2, LOGGED_IN = 3;
const FAILED = -1, PENDING = 0, CONNECTED = 1;

class Login extends React.Component {
  constructor() {
    super();

    this.particle = new Particle();

    this.state = {
      phase: TEXT,
      email: '',
      password: '',
      scannerStatus: PENDING,
      disabled: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.logout = this.logout.bind(this);
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
    let data = new FormData;
    data.append('email', this.state.email);
    data.append('rfid', e.data);
    this.setState({ phase: SCANNING });
    fetch('/api/verify-rfid/', {
      method: 'POST',
      body: data
    }).then((res) => {
      return res.json();
    }).then((res) => {
      if (res.success) {
        this.setState({ phase: LOGGED_IN });
      }
      else {
        alert('Incorrect RFID');
        this.clearForm();
        this.setState({ phase: TEXT });
      }
    }).catch((err) => {
      console.error(err);
      this.clearForm();
      this.setState({ phase: TEXT });
    })
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
      if (res.success) {
        this.setState({
          phase: SCAN,
        });
      }
      else {
        alert('Incorrect login');
        this.clearForm();
      }
      this.setState({ disabled: false });
    }).catch((err) => {
      console.error(err);
      this.setState({ disabled: false });
    })
  }

  // Log out
  logout() {
    this.setState({
      email: '',
      password: '',
      phase: TEXT,
    })
  }

  // Clear text fields
  clearForm() {
    this.setState({
      email: '',
      password: ''
    });
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

  // Render scanning message
  renderScan() {
    return (
      <p>Please scan your RFID card or keychain to verify your identity.</p>
    );
  }

  // Render a logged in screen
  renderHome() {
    return (
      <div>
        <p>Successfully logged in.</p>
        <h2>Welcome!</h2>
        <button onClick={this.logout}>Log out</button>
      </div>
    )
  }

  renderPart() {
    switch (this.state.phase) {
      case TEXT:
        return this.renderForm();
      case SCAN:
        return this.renderScan();
      case SCANNING:
        return (<p>Authenticating...</p>);
      case LOGGED_IN:
        return this.renderHome();
    }
    return null;
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
        { this.renderPart() }
        { this.renderConnectionMessage() }
      </div>
    );
  }
}

module.exports = Login;

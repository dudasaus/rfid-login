import React from 'react';
import Particle from 'particle-api-js';
import AUTH from '../utils/auth.js';

const TEXT = 0, SCAN = 1;

class Login extends React.Component {
  constructor() {
    super();

    this.particle = new Particle();

    this.state = {
      phase: TEXT,
      email: '',
      password: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScan = this.handleScan.bind(this);
  }

  componentDidMount() {
    this.particle.getEventStream({
      deviceId: AUTH.device,
      auth: AUTH.token
    })
    .then((stream) => {
      console.log('Stream connected');
      stream.on('event', this.handleScan);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleScan(e) {
    if (e.name !== 'rfid-scan' && e.data) return;
    console.log(e.data);
  }

  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  handleSubmit(e) {
    e.preventDefault();
    alert(this.state.email);
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <button>Login</button>
      </form>
    );
  }

  render() {
    return (
      <div>
        { this.renderForm() }
      </div>
    );
  }
}

module.exports = Login;

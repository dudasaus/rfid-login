import React from 'react';
import { render } from 'react-dom';
import Login from './components/login';

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <img id="logo" src="/assets/logo.svg" alt="logo" />
          <h1>RFID 2FA Login System</h1>
        </header>
        <Login/>
      </div>
    );
  }
}

render(<App/>, document.querySelector('#app'));

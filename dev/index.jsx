import React from 'react';
import { render } from 'react-dom';
import Login from './components/login';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>RFID 2FA</h1>
        <Login/>
      </div>
    );
  }
}

render(<App/>, document.querySelector('#app'));

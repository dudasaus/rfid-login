import React from 'react';

class EmailList extends React.Component {

  constructor() {
    super();

    this.state = {
      emails: [],
    }
  }

  componentDidMount() {
    fetch('/api/list/').then((res) => {
      return res.json();
    }).then((res) => {
      if (res.success) {
        this.setState({ emails: res.emails });
      }
    }).catch((err) => {
      console.log('Error listing emails');
    });
  }

  render() {
    if (this.state.emails.length) {
      return (
        <div>
          <h2>Existing accounts</h2>
          <ul>
            { this.state.emails.map((x) => {
              return (<li>{x}</li>);
            })}
          </ul>
        </div>
      )
    }
    else {
      return (
        <div>
          <h2>Existing accounts</h2>
          <p>Loading...</p>
        </div>
      );
    }
  }
}

export default EmailList;

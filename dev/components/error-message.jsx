import React from 'react';

class ErrorMessage extends React.Component {
  render() {
    if (this.props.message) {
      return (
        <div className="error-msg">
          {this.props.message}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default ErrorMessage;

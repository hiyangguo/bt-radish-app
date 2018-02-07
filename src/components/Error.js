import React, {Component} from 'react';
import {observer} from 'mobx-react';

class List extends Component {
  render() {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }
}

export default observer(List);
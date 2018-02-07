import React, {Component} from 'react';
// import {action, extendObservable} from 'mobx';
import {observer} from 'mobx-react';

class List extends Component {
  render() {
    return (
      <div>
        详情页
      </div>
    );
  }
}

export default observer(List);
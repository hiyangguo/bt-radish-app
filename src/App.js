import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Home from './components/Home';
import List from './components/List';
import Error from './components/Error';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/list/:engine/:word" component={List}/>
          <Route component={Error}/>
        </div>
      </Router>
    );
  }
}

export default App;

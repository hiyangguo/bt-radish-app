import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './components/Home';
import List from './components/List';
import Error from './components/Error';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          {/** <Switch/> 展示第一个匹配 ， 没有匹配的 <Route/> 总是匹配 **/}
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/list/:engine/:word*" component={List}/>
            <Route component={Error}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

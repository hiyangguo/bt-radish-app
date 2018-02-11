import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import classnames from 'classnames';

import SearchInput from './common/SearchInput';

const contextTypes = {
  router: PropTypes.object
};

@observer
class Home extends Component {
  @observable searching = false;
  @observable searchWord = '';

  @action
  setSearching = (searching) => {
    this.searching = searching;
  };

  @action
  setSearchWord = (word) => {
    this.searchWord = word;
  };

  handleSearchInputFocus = () => this.setSearching(true);
  handleSearchInputBlur = () => this.setSearching(false);

  handleSearchInputChange = (e) => {
    this.setSearchWord(e.target.value);
  };

  handleSearchButtonClick = (value, e) => {
    console.log(value, e);
    const {activeWeb: webPath, value: searchWord} = value;
    if (searchWord || searchWord.length) {

    }
    this.context.router.history.push(`/list/${webPath}/${searchWord}`);
  };

  render() {
    return (
      <div className={
        classnames('home', {
          searching: this.searching
        })
      }>
        <div className="bg"></div>
        <div className="content">
          <SearchInput
            wrapClassName="home-search"
            value={this.searchWord}
            onFocus={this.handleSearchInputFocus}
            onBlur={this.handleSearchInputBlur}
            onChange={this.handleSearchInputChange}
            placeholder="输入关键字进行搜索"
            onSearchButtonClick={this.handleSearchButtonClick}
          />
        </div>
      </div>
    );
  }
}

Home.contextTypes = contextTypes;

export default Home;
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import classnames from 'classnames';
import {findDOMNode} from 'react-dom';
import {contains} from 'dom-lib';

import SearchInput from './common/SearchInput';

import {KeyCodes} from '../constants';

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

  componentDidMount() {
    this.handleManageEvent();
  }

  componentWillUnmount() {
    this.handleManageEvent('remove');
  }

  handleSearchInputFocus = () => this.setSearching(true);
  handleSearchInputBlur = () => this.setSearching(false);

  handleSearchInputChange = (e) => {
    this.setSearchWord(e.target.value);
  };

  handleSearchButtonClick = (value, e) => {
    const {activeWeb: webPath, value: searchWord} = value;
    if (!searchWord || !searchWord.length) {
      return;
    }
    this.context.router.history.push(`/list/${webPath}/${searchWord}`);
  };

  handleManageEvent = (oprator = 'add') => {
    document.body[`${oprator}EventListener`]('keydown', this.handleEnterKey);
  };

  handleEnterKey = (event) => {
    const {target, keyCode} = event;
    if (contains(findDOMNode(this.searchInput), target) && keyCode === KeyCodes.Enter) {
      this.searchInput.handleSearchButtonClick();
      event.preventDefault();
    }
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
            ref={ref => this.searchInput = ref}
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
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {action, extendObservable} from 'mobx';
import {observer} from 'mobx-react';
import classnames from 'classnames';

const contextTypes = {
  router: PropTypes.object
};


class Home extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      searching: false,
      setSearching: action(function (searching) {
        this.searching = searching;
      }),
      searchWord: '',
      setSearchWord: action(function (word) {
        this.searchWord = word;
      })
    });
  }

  handleSearchInputFocus = () => this.setSearching(true);
  handleSearchInputBlur = () => this.setSearching(false);

  handleSearchInputChange = (e) => {
    this.setSearchWord(e.target.value);
  };

  handleSearchButtonClick = () => {
    this.context.router.history.push(`/list/btwhat/${this.searchWord}`);
  };

  render() {
    return (
      <div className={classnames('home', {
        searching: this.searching
      })}>
        <div className="bg"></div>
        <div className="content">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              value={this.searchWord}
              placeholder="输入关键字进行搜索"
              onFocus={this.handleSearchInputFocus}
              onBlur={this.handleSearchInputBlur}
              onChange={this.handleSearchInputChange}
            />
            <button
              className="search-button"
              style={{
                backgroundImage: `url("${process.env.PUBLIC_URL}/img/cn_searchbt_hp.png")`
              }}
              onClick={this.handleSearchButtonClick}
            >
              搜索
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = contextTypes;

export default observer(Home);
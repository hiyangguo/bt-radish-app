import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import _ from 'lodash';

import SearchInput from './common/SearchInput';

import {getData} from '../utils/request';

const contextTypes = {
  router: PropTypes.object
};


@observer
class List extends Component {
  @observable searchParams = _.pick(_.get(this.props, 'match.params'), ['engine', 'word']);
  @observable result = {};

  @action
  setSearchParams = (searchParams) => {
    this.searchParams = searchParams;
  };

  @action
  setResults = (result) => {
    this.result = result;
  };

  componentDidMount() {
    this.loadListData();
  }

  componentWillReceiveProps(nextProps) {
    const nextPathName = _.get(nextProps, 'location.pathname');
    const pathName = _.get(this.props, 'location.pathname');
    if (nextPathName !== pathName) {
      this.loadListData();
    }
  }

  handleSearchInputChange = (e) => {
    this.setSearchParams({
      ...this.searchParams,
      word: e.target.value
    });
  };

  handleSearchButtonClick = (value, e) => {
    const {activeWeb: webPath, value: searchWord} = value;
    if (!searchWord || !searchWord.length) {
      return;
    }
    this.context.router.history.push(`/list/${webPath}/${searchWord}`);
  };


  loadListData = () => {
    const {engine, word} = this.searchParams;
    const handler = getData(`/api/${engine}/list`, {
      word
    });
    handler((resp) => {
      console.log(resp);
    });
  };

  render() {
    return (
      <div className="list">
        <div className="content">
          <SearchInput
            ref={ref => this.searchInput = ref}
            activeWeb={this.searchParams.engine}
            value={this.searchParams.word}
            onChange={this.handleSearchInputChange}
            placeholder="输入关键字进行搜索"
            onSearchButtonClick={this.handleSearchButtonClick}
          />
        </div>
      </div>
    );
  }
}

List.contextTypes = contextTypes;

export default List;
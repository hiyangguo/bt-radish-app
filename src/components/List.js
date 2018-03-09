import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import _ from 'lodash';
import Clipboard from 'rsuite-clipboard';
import {Alert} from 'rsuite-notification';
import SearchInput from './common/SearchInput';
import {Link} from 'react-router-dom';
import {getData} from '../utils/request';
import {ResponseStatus} from '../constants';
import config from '../parser';


const contextTypes = {
  router: PropTypes.object
};

const LabelText = ({label, text, ...props}) => (
  <div className="info-label-text" {...props}>
    <div className="info-label">{label}</div>
    <div className="info-text">{text || '未知'}</div>
  </div>
);


@observer
class List extends Component {
  @observable searchParams = {
    ..._.pick(_.get(this.props, 'match.params'), ['engine', 'word']),
    query: this.getQuery()
  };
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
    const nextPathName = this.getLocation(nextProps);
    const pathName = this.getLocation(this.props);
    if (nextPathName !== pathName) {
      this.setSearchParams({
        ...this.searchParams,
        query: this.getQuery(nextProps)
      });
      this.loadListData();
    }
  }

  getLocation = props => Object.values(_.pick(_.get(props, 'location'), ['pathname', 'search'])).join('');

  getQuery = (props = this.props) => {
    const query = _.get(props, 'location.search') || '';
    return query.length > 0 ? query.replace(/^\?query=/, '') : null;
  };

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
    const {engine: engineName, word, query} = this.searchParams;
    const engine = config[engineName];
    const url = engine.list.getUrl(query || word);
    const handler = getData(url)(engine.list.parser);
    handler(this.setResults);
  };

  handleCopy = (text, result) => {
    Alert.success('复制成功');
  };

  renderResult() {
    const items = _.get(this.result, 'data.items') || [];
    const total = _.get(this.result, 'data.searchStatus.total') || '--';
    const spending = _.get(this.result, 'data.searchStatus.spending') || '--';
    const page = _.get(this.result, 'page.pages') || [];
    return (
      <div>
        <div className="total-wrap">
          总计：{total}条，用时：{spending}
        </div>
        <div className="list-wrap">
          {
            items.map(({hash, title, fileType, createTime, fileSize, fileCount, hot, lastDownload, files}) => (
              <div className="list-wrap" key={hash}>
                <div className="info-title" title={title}>
                  <Link to={`/detail/${hash}`}>{title}</Link>
                </div>
                <div className="info-detail">
                  <LabelText label="文件类型" text={fileType}/>
                  <LabelText label="创建时间" text={createTime}/>
                  <LabelText label="文件大小" text={fileSize}/>
                  <LabelText label="文件数" text={fileCount}/>
                  <LabelText label="热度" text={hot}/>
                  <LabelText label="最近下载时间" text={lastDownload}/>
                </div>
                <div className="info-footer">
                  <a className="button main-button" href={`magnet:?xt=urn:btih:${hash}`}>下载</a>
                  <Clipboard text={`magnet:?xt=urn:btih:${hash}`} onCopy={this.handleCopy}>
                    <a className="button main-button">复制磁力链接</a>
                  </Clipboard>
                </div>
              </div>
            ))
          }
        </div>
        <div className="pager-wrap">
          {
            page.map(({num, query}) => {
              const classNames = 'pager';
              const key = num || query;
              return query ?
                (<Link className={classNames} key={key}
                       to={`./${encodeURIComponent(this.searchParams.word)}?query=${query}`}>{num}</Link>) :
                (<span className={`${classNames} active`} key={key}>{num}</span>);
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const {status} = this.result;
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
          {
            status === ResponseStatus.REQUEST && (
              <div className="sk-fading-circle">
                <div className="sk-circle1 sk-circle"></div>
                <div className="sk-circle2 sk-circle"></div>
                <div className="sk-circle3 sk-circle"></div>
                <div className="sk-circle4 sk-circle"></div>
                <div className="sk-circle5 sk-circle"></div>
                <div className="sk-circle6 sk-circle"></div>
                <div className="sk-circle7 sk-circle"></div>
                <div className="sk-circle8 sk-circle"></div>
                <div className="sk-circle9 sk-circle"></div>
                <div className="sk-circle10 sk-circle"></div>
                <div className="sk-circle11 sk-circle"></div>
                <div className="sk-circle12 sk-circle"></div>
              </div>
            )
          }

          {
            status === ResponseStatus.SUCCESS && this.renderResult()
          }
        </div>
      </div>
    );
  }
}

List.contextTypes = contextTypes;

export default List;
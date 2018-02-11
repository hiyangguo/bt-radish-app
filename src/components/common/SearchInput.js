import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
//action
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

import {SUPPORT_WEBS} from '../../constants';
import {action} from 'mobx/lib/mobx';

const propTypes = {
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  onSearchButtonClick: PropTypes.func.isRequired
};

const defaultProps = {
  value: ''
};

@observer
class SearchInput extends Component {
  @observable activeWeb = Object.keys(SUPPORT_WEBS)[0];
  @observable dropDownOpen = false;

  @computed get activeWebValue() {
    return SUPPORT_WEBS[this.activeWeb];
  }

  @computed get inputValue() {
    return {
      activeWeb: this.activeWeb,
      value: this.props.value
    };
  }

  @action
  setDropDownOpen = (open) => {
    this.dropDownOpen = open;
  };

  @action
  setActiveWeb = (webKey) => {
    this.activeWeb = webKey;
  };

  toggleDropDown = () => {
    this.setDropDownOpen(!this.dropDownOpen);
  };

  handleDropdownItemClick = (key) => {
    this.setActiveWeb(key);
    this.setDropDownOpen(false);
  };

  renderWebItem = ([key, info]) => {
    return (
      <li key={key} onClick={() => this.handleDropdownItemClick(key)}>{info.name}</li>
    );
  };

  render() {
    const props = _.omit(this.props, ['type', ...Object.keys(propTypes)]);
    return (
      <div className={classnames('search-bar', this.props.wrapClassName)}>
        <div className={classnames('search-drop-down', {
          open: this.dropDownOpen
        })}>
          <a className="search-drop-down-button" onClick={this.toggleDropDown}>
            <img src={`${process.env.PUBLIC_URL}/img/logo/${this.activeWebValue.icon}`} alt={this.activeWebValue.name}/>
          </a>
          <ul className="search-drop-down-panel">
            {
              Object.entries(SUPPORT_WEBS).map(this.renderWebItem)
            }
          </ul>
        </div>
        <input
          className={classnames('search-input', this.props.className)}
          type="text"
          {...props}
        />
        <button
          className="search-button"
          style={{
            backgroundImage: `url("${process.env.PUBLIC_URL}/img/cn_searchbt_hp.png")`
          }}
          onClick={(e) => this.props.onSearchButtonClick(this.inputValue, e)}
        >
          搜索
        </button>
      </div>
    );
  }
}

SearchInput.defaultProps = defaultProps;
SearchInput.propTypes = propTypes;

export default SearchInput;
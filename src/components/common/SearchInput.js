import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

const propTypes = {
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  onSearchButtonClick: PropTypes.func
};

class SearchInput extends Component {
  render() {
    const props = _.omit(this.props, ['type', ...Object.keys(propTypes),]);
    return (
      <div className={classnames('search-bar', this.props.wrapClassName)}>
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
          onClick={this.props.onSearchButtonClick}
        >
          搜索
        </button>
      </div>
    );
  }
}

SearchInput.propTypes = propTypes;

export default SearchInput;
import axios from 'axios';
import {ResponseStatus} from '../constants';
import _ from 'lodash';

export function getData(url, params, options = {}) {
  return (dispatch) => {
    (async function () {
      dispatch({
        status: ResponseStatus.REQUEST
      });
      try {
        const response = await axios.get(url, {
          ...options,
          url,
          params
        });

        const {status, data} = response;

        dispatch({
          ...data,
          status: status === 200 ? ResponseStatus.SUCCESS : ResponseStatus.ERROR,
        });
      } catch (e) {
        dispatch({
          status: ResponseStatus.ERROR,
          data: e
        });
      }
    })();
  };
}

import axios from 'axios';
import {ResponseStatus} from '../constants';

export function getData(url, params, options = {}) {
  return (parser) => (dispatch) => {
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
        const {code, ...data} = parser(response);
        dispatch({
          status: code === 200000 ? ResponseStatus.SUCCESS : ResponseStatus.ERROR,
          ...data,
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

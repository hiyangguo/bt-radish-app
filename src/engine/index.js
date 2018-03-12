import btwhat from './btwhat';
import diaosiso from './diaosiso';

export default {
  btwhat: {
    getUrl: word => `http://www.btwhat.info/search/${word}.html`,
    parser: btwhat
  },
  diaosiso: {
    getUrl: word => `http://www.diaosisou.org/list/${word}.html`,
    parser: diaosiso
  }
};
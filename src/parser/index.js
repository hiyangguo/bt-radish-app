import btWhatListParser from './btwhat/list';
import diaoSiSoListParser from './diaosiso/list';

export default {
  btwhat: {
    list: {
      getUrl: word => `http://www.btwhat.info/search/${word}.html`,
      parser: btWhatListParser
    }
  },
  diaosiso: {
    list: {
      getUrl: word => `http://www.diaosisou.org/list/${word}.html`,
      parser: diaoSiSoListParser
    }
  }
};
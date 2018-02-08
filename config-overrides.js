const rewireLess = require('react-app-rewire-less');
const rewireMobx = require('react-app-rewire-mobx');
module.exports = function override(config, env) {
  config = rewireLess(config, env);
  config = rewireMobx(config, env);
  return config;
};
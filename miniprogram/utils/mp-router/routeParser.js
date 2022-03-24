const {
  routeMap
} = require('./store.js');

/**
 * 路由名称转路径
 * @param {string} name 路由名
 */
function name2path(name) {
  return name.replace(/\./g, '/').replace(/\B([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 路由解析
 * @param {string} name 路由名
 */
function parser(name) {
  if (!name) {
    throw new Error('路由名字不能为空');
  }
  let route = routeMap[name];
  let auth = routeMap[name].auth || false
  // console.log(option['name'])

  if (!route) {
    const path = `/pages/${name2path(name)}/index`;
    route = routeMap[path] || {
      type: 'page',
      path,
      auth
    };
  }
  return route;
}

module.exports = parser;
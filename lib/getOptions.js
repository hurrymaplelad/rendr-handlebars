/**
 * Grab important underscored properties from the current context.
 * These properties come from BaseView::decorateTemplateData().
 */
module.exports = function (obj) {
  var options, keys, value;

  keys = [
    '_app',
    '_view',
    '_model',
    '_collection',
    '_block'
  ];

  options = keys.reduce(function(memo, key) {
    value = obj[key];
    if (value) {
      memo[key] = value;
    }
    return memo;
  }, {});

  return options;
};

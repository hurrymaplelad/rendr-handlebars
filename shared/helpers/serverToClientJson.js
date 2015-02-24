module.exports = function (Handlebars) {
  return function (obj) {
    var data = escape(JSON.stringify(obj));
    return new Handlebars.SafeString('JSON.parse(unescape("' + data + '"))');
  };
};

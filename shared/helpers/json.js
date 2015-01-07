module.exports = function (Handlebars) {
  return function (object, spacing) {
    return new Handlebars.SafeString(JSON.stringify(object, null, spacing) || 'null');
  }
}

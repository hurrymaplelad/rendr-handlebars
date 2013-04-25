var fs = require('fs');

module.exports = {
  getTemplate: function (name, callback) {
    var layoutPath = rendr.entryPath + '/app/templates/' + name + '.hbs';
    fs.readFile(layoutPath, 'utf8', function (err, str) {
      if (err) {
        return callback(err);
      }
      var template = Handlebars.compile(str);
      callback(null, template);
    });
  }
};

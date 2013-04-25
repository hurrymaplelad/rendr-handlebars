require('./shared/globals');

exports.templateFinder = require('./shared/templateFinder');
if(!this.window) {
  exports.layoutFinder = require('./server/layoutFinder');
}
var helpers = require('./helpers'),
    templates = null,
    key;

for (key in helpers) {
  if (helpers.hasOwnProperty(key)) {
    Handlebars.registerHelper(key, helpers[key]);
  }
}

exports.getTemplate = function(templateName) {
  // Allow compiledTemplates to be created asynchronously.
  if(!templates) {
    templates = require(rendr.entryPath + '/app/templates/compiledTemplates')(Handlebars);
  }
  return templates[templateName];
};

/*global rendr*/
var templates = null;

module.exports = function(Handlebars) {
  return {
    getTemplate: function(templateName) {
      /**
       * Allow compiledTemplates to be created asynchronously.
       */
      templates = templates || require(rendr.entryPath + '/app/templates/compiledTemplates')(Handlebars);
      return templates[templateName];
    }
  }
};

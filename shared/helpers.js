var BaseView = null, 
    modelUtils = null, 
    templateFinder = require('./templateFinder');

// Temporary, to fix bug in Handlebars
// SEE https://github.com/wycats/handlebars.js/issues/342
Handlebars.log || (Handlebars.log = function(obj) {
  return console.log(obj);
});

module.exports = {
  view: function(viewName, block) {
    var ViewClass, app, html, options, view;
    BaseView || (BaseView = require('./base/view'));
    modelUtils || (modelUtils = require('./modelUtils'));

    viewName = modelUtils.underscorize(viewName);

    options = block.hash || {};

    app = this._app;
    if (app) {
      options.app = app;
    }

    // get the Backbone.View based on viewName
    ViewClass = BaseView.getView(viewName);
    view = new ViewClass(options);

    // create the outerHTML using className, tagName
    html = view.getHtml();
    return new Handlebars.SafeString(html);
  },

  partial: function(templateName, block) {
    var template = templateFinder.getTemplate(templateName),
        options = block.hash || {},
        data, html;
    if (_.isEmpty(options)) {
      data = this;
    } else if (options.context) {
      data = options.context;
    } else {
      data = options;
    }

    data = _.clone(data);
    if (!data._app) {
      data._app = this._app;
    }

    html = template(data);
    return new Handlebars.SafeString(html);
  },

  json: function(object) {
    return new Handlebars.SafeString(JSON.stringify(object) || 'null');
  }
};

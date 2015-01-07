/**
 * Helper to create new views in the templates
 */

var getProperty = require('../../lib/getProperty');

module.exports = function (Handlebars) {
  return function (viewName, options) {
    var ViewClass, html, viewOptions, view;

    if (!BaseView) {
      BaseView = require('rendr/shared/base/view');
    }
    viewOptions = options.hash || {};

    var app = getProperty('_app', this, options);
    // Pass through a reference to the app.
    if (app) {
      viewOptions.app = app;
      viewName = app.modelUtils.underscorize(viewName);
    } else{
      throw new Error("An App instance is required when rendering a view, it could not be extracted from the options.")
    }

    if (isServer) {
      // Pass through a reference to the parent view.
      var parentView = getProperty('_view', this, options);
      if (parentView) {
        viewOptions.parentView = parentView;
      }

      // get the Backbone.View based on viewName
      ViewClass = BaseView.getView(viewName, app.options.entryPath);
      view = new ViewClass(viewOptions);

      // create the outerHTML using className, tagName
      html = view.getHtml();
      return new Handlebars.SafeString(html);
    }

    // only create an element to pass attributes to a single point for view instantiation for client-side

    // Builds a fetch_summary attribute
    viewOptions = BaseView.parseModelAndCollection(app.modelUtils, viewOptions);
    var fetchSummary = BaseView.extractFetchSummary(app.modelUtils, viewOptions);
    fetchSummary = JSON.stringify(fetchSummary)

    viewOptions['fetch_summary'] = fetchSummary
    viewOptions = _.omit(viewOptions, ['model', 'collection', 'app'])

    // create a list of data attributes
    var attrString = _.inject(viewOptions, function(memo, value, key) {
      return memo += " data-" + key + "=\"" + _.escape(value) + "\"";
    }, '');

    return new Handlebars.SafeString(
      '<div data-render="true" ' + attrString +' data-view="'+ viewName +'"></div>'
    )
  };
};

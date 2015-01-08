/**
 * Helper to create new views in the templates
 */

var getProperty = require('../../lib/getProperty'),
    isServer = typeof window === 'undefined',
    BaseView;

module.exports = function (Handlebars) {
  return function (viewName, options) {
    var ViewClass, html, viewOptions, view, app;

    viewOptions = options.hash || {};
    app = getProperty('_app', this, options);

    // Pass through a reference to the app.
    if (app) {
      viewOptions.app = app;
      viewName = app.modelUtils.underscorize(viewName);
    } else{
      throw new Error("An App instance is required when rendering a view, it could not be extracted from the options.")
    }

    // allow views to be passed optional block elements
    if (_.isFunction(options.fn)) {
      viewOptions._block = options.fn(viewOptions);
    }

    if (isServer) {
      var parentView = getProperty('_view', this, options);
      html = getServerHtml(viewName, viewOptions, parentView);
    } else {
      html = getClientPlaceholder(viewName, viewOptions);
    }

    return new Handlebars.SafeString(html);
  };
};

function getServerHtml(viewName, viewOptions, parentView) {
  if (!BaseView) { BaseView = require('rendr/shared/base/view'); }

  // Pass through a reference to the parent view.
  if (parentView) { viewOptions.parentView = parentView; }

  // get the Backbone.View based on viewName
  ViewClass = BaseView.getView(viewName, viewOptions.app.options.entryPath);
  view = new ViewClass(viewOptions);

  // create the outerHTML using className, tagName
  return view.getHtml();
}

function getClientPlaceholder(viewName, viewOptions) {
  if (!BaseView) { BaseView = require('rendr/shared/base/view'); }
  var fetchSummary;

  // Builds a fetch_summary attribute
  viewOptions = BaseView.parseModelAndCollection(viewOptions.app.modelUtils, viewOptions);
  fetchSummary = BaseView.extractFetchSummary(viewOptions.app.modelUtils, viewOptions);
  fetchSummary = JSON.stringify(fetchSummary)

  viewOptions['fetch_summary'] = fetchSummary
  viewOptions = _.omit(viewOptions, ['model', 'collection', 'app'])

  // create a list of data attributes
  var attrString = _.inject(viewOptions, function(memo, value, key) {
    return memo += " data-" + key + "=\"" + _.escape(value) + "\"";
  }, '');

  return '<div data-render="true" ' + attrString +' data-view="'+ viewName +'"></div>';
}

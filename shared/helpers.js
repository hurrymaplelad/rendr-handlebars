var _ = require('underscore'),
  isServer = typeof window === 'undefined';

// Lazy-required.
var BaseView = null,
    oldEach;

module.exports = function(Handlebars, getTemplate) {
  oldEach = oldEach || Handlebars.helpers.each;

  return {
    view: function(viewName, options) {
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
        return memo += " data-" + key + "=\"" + _.escape(typeof value === 'object' ? JSON.stringify(value) : value) + "\"";
      }, '');

      return new Handlebars.SafeString(
        '<div data-render="true" ' + attrString +' data-view="'+ viewName +'"></div>'
      )
    },

    partial: function(templateName, options) {
      var data, html, context, template;

      template = getTemplate(templateName);

      context = options.hash || {};

      // First try to use Handlebars' hash arguments as the context for the
      // partial, if present.
      //
      // ex: `{{partial "users/photo" user=user}}`
      if (_.isEmpty(context)) {
        // If there are no hash arguments given, then inherit the parent context.
        //
        // ex: `{{partial "users/photo"}}`
        context = this;
      } else {
        // If a hash argument is given with key `context`, then use that as the context.
        //
        // ex: `{{partial "users/photo" context=user}}`
        if (context.hasOwnProperty('context')) {
          context = context.context;
        }
      }
      context = _.clone(context);

      context._app = getProperty('_app', this, options);
      html = template(context);
      return new Handlebars.SafeString(html);
    },

    json: function(object, spacing) {
      return new Handlebars.SafeString(JSON.stringify(object, null, spacing) || 'null');
    },

    /**
     * Extend `each` to pass through important context.
     */
    each: function(context, options) {
      options.data = Handlebars.createFrame(options.data || {});

      // Make sure `this._app`, `this._view`, etc are available.
      _.extend(options.data, getOptionsFromContext(this));

      // Call the original helper with new context.
      return oldEach.call(this, context, options);
    },

    /**
     * Create a `forEach` helper that works on a few more cases and gives more flexibility
     * when dealing with arrays, objects, or collections
     */
    forEach: function(collection, opts) {
      var len = collection && collection.length,
          app = this._app || this.app,
          isCollection = app.modelUtils.isCollection(collection),
          buffer = '';

      if (_.isEmpty(collection)) {
        return opts.inverse(_.extend({}, this, {
          _app: app,
          _model: this._model || this.model,
          _collection: this._collection || this.collection,
          _view: this._view || this.view
        }));
      }

      // iterate the models on a collection
      if (isCollection) {
        collection = collection.models
      }

      _.each(collection, function (value, key) {
        if (isCollection && opts.hash.toJSON) {
          value = value.toJSON();
        }

        var item = _.extend({
          key: key,
          value: value,
          _app: this._app || this.app,
          _model: this._model || this.model,
          _collection: this._collection || this.collection,
          _view: this._view || this.view
        }, opts.hash);

        // adding extra attributes to an item for array traversal
        if (_.isArray(collection) || isCollection) {
          item = _.extend(item, {
            _total: len,
            _isFirst: key === 0,
            _isLast: key === (len - 1)
          });
        }

        buffer += opts.fn(item);
      }.bind(this));

      return buffer;
    }
  };
};

/**
 * Grab important underscored properties from the current context.
 * These properties come from BaseView::decorateTemplateData().
 */
function getOptionsFromContext(obj) {
  var options, keys, value;

  keys = [
    '_app',
    '_view',
    '_model',
    '_collection'
  ];

  options = keys.reduce(function(memo, key) {
    value = obj[key];
    if (value) {
      memo[key] = value;
    }
    return memo;
  }, {});

  return options;
}

/**
 * Get a property that is being passed down through helpers, such as `_app`
 * or `_view`. It can either live on the context, i.e. `this._app`, or in the
 * `options.data` object passed to the helper, i.e. `options.data._app`, in the
 * case of a block helper like `each`.
 */
function getProperty(key, context, options) {
  return context[key] || (options.data || {})[key];
}

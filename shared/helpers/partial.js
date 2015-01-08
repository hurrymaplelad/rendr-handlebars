/**
 * create an html partial
 */
var getProperty = require('../../lib/getProperty'),
    _ = require('underscore');

module.exports = function (Handlebars, getTemplate) {
  return function (templateName, options) {
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
    if (_.isFunction(options.fn)) {
      context._block = options.fn(context);
    }

    html = template(context);
    return new Handlebars.SafeString(html);
  };
};

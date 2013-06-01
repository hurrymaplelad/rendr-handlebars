var Handlebars = require('handlebars');

/**
 * Export the `Handlebars` object, so other modules can add helpers, partials, etc.
 */
exports.Handlebars = Handlebars;

/**
 * `getTemplate` is available on both client and server.
 */
exports.getTemplate = require('./shared/templateFinder')(Handlebars).getTemplate;

/**
 * `getLayout` should only be used on the server.
 */
if (typeof window === 'undefined') {
  exports.getLayout = require('./server/layoutFinder')(Handlebars).getLayout;
} else {
  exports.getLayout = function() {
    throw new Error('getLayout is only available on the server.');
  };
}

/**
 * Register helpers, available on both client and server.
 */
var handlebarsHelpers = require('./shared/helpers')(Handlebars, exports.getTemplate);

for (var key in handlebarsHelpers) {
  if (!handlebarsHelpers.hasOwnProperty(key)) continue;
  Handlebars.registerHelper(key, handlebarsHelpers[key]);
}

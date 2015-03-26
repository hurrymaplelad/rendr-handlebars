var Handlebars = require('handlebars');

if (Handlebars['default']) {
  // If we only have the Handlebars runtime available, use that here.
  // Until Handlebars 3, we have to use 'default' instead of just requiring 'handlebars'.
  Handlebars = Handlebars['default'];
}

module.exports = function(options){
  var localExports = {},
      templateFinder = options.templateFinder || require('./shared/templateFinder')(Handlebars);

  /**
   * Export the `Handlebars` object, so other modules can add helpers, partials, etc.
   */
  localExports.Handlebars = Handlebars;

  /**
   * `getTemplate` is available on both client and server.
   */
  localExports.getTemplate = templateFinder.getTemplate;

  /**
   * Expose `templatePatterns` for manipulating how `getTemplate` finds templates.
   */
  localExports.templatePatterns = templateFinder.templatePatterns;

  /**
   * The default pattern `/.+/` is very greedy; it matches anything, including nested paths.
   * To add rules that should match before this default rule, `unshift` them from this array.
   */
  localExports.templatePatterns.push({pattern: /.+/, src: options.entryPath + 'app/templates/compiledTemplates'})

  /**
   * `getLayout` should only be used on the server.
   */
  if (typeof window === 'undefined') {
    // server only, "hide" it from r.js compiler
    // by having require statement with variable
    var serverOnlyLayoutFinderPath = './server/layoutFinder';
    localExports.getLayout = require(serverOnlyLayoutFinderPath)(Handlebars).getLayout;
  } else {
    localExports.getLayout = function() {
      throw new Error('getLayout is only available on the server.');
    };
  }

  /**
   * Register helpers, available on both client and server.
   *
   * Export it so other modules can register helpers as well.
   */
  localExports.registerHelpers = function registerHelpers(helpersModule) {
    var helpers = helpersModule(Handlebars, localExports.getTemplate);

    for (var key in helpers) {
      if (!helpers.hasOwnProperty(key)) continue;
      Handlebars.registerHelper(key, helpers[key]);
    }
  };

  /**
   * Register the pre-bundled Rendr helpers.
   */
  var rendrHelpers = require('./shared/helpers');
  localExports.registerHelpers(rendrHelpers);

  return localExports;
}

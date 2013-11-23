var assert = require('assert');

describe("require('rendr-handlebars')", function() {
  it('returns a new templateAdapter', function() {
    var templateAdapter, firstPatternSrc;
    templateAdapter = require('../index')({entryPath: '/some/place/'})
    assert.equal(templateAdapter.templatePatterns.length, 1);
    firstPatternSrc = templateAdapter.templatePatterns[0].src;
    assert.equal(firstPatternSrc, '/some/place/app/templates/compiledTemplates');
  });

  it('does not squash an old templateAdapter', function() {
    var templateAdapter1, templateAdapter2, firstPatternSrc, secondPatternSrc;
    templateAdapter1 = require('../index')({entryPath: '/some/place/'})
    templateAdapter2 = require('../index')({entryPath: '/some/other/place/'})
    assert.equal(templateAdapter1.templatePatterns.length, 1);
    assert.equal(templateAdapter2.templatePatterns.length, 1);
    firstPatternSrc = templateAdapter1.templatePatterns[0].src;
    secondPatternSrc = templateAdapter2.templatePatterns[0].src;
    assert.equal(firstPatternSrc, '/some/place/app/templates/compiledTemplates');
    assert.equal(secondPatternSrc, '/some/other/place/app/templates/compiledTemplates');
  });
});

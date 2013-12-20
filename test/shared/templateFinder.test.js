var assert = require('assert'),
    entryPath = process.cwd() + '/test/fixtures/',
    templateAdapter = require('../../index')({entryPath: entryPath});

describe('templateFinder', function() {
  describe('getTemplate', function() {
    it('should support the default pattern if none given', function() {
      assert.equal('function', typeof templateAdapter.getTemplate('my_test_template'));
      assert.equal('function', typeof templateAdapter.getTemplate('subdir/other_template'));
    });
    it('should support prepending to the templatePatterns to find templates in other files', function() {
      /**
       * Add the pattern for templates that should come from a different source file.
       */
      templateAdapter.templatePatterns.unshift({
        pattern: /^other_template_pattern\//,
        src: entryPath + 'app/templates/otherTemplates'
      });

      assert.equal('function', typeof templateAdapter.getTemplate('other_template_pattern/home_view'));
      assert.equal('function', typeof templateAdapter.getTemplate('other_template_pattern/subdir/nav_view'));
    });
  });
});

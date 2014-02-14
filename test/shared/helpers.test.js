'use strict';

var chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  should = chai.should(),
  helpers = require('../../shared/helpers'),
  Handlebars = require('handlebars').create();

chai.use(sinonChai);

describe('helpers', function () {

  function createRendrHandlebarsHelpers() {
    var newRendrHelpers = helpers(Handlebars);
    sinon.spy(newRendrHelpers, 'each');
    return newRendrHelpers;
  }

  describe('each', function () {
    it('should only call the original Handlebars each function on subsequent helper creation', function () {
      var helperInstance0,
        helperInstance1,
        handlebarsOptions = { inverse: function () {} },
        handlebarsSpy = sinon.spy();

      helperInstance0 = createRendrHandlebarsHelpers();
      helperInstance1 = createRendrHandlebarsHelpers();

      helperInstance1.each(handlebarsSpy, handlebarsOptions);

      helperInstance0.each.should.have.not.been.called;
      handlebarsSpy.should.have.been.called;
    });
  });
});



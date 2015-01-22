var Handlebars = require('handlebars').create(),
    memo = require('memo-is'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    subject = require('../../../shared/helpers/view')(Handlebars);

describe('view', function () {
  var app = memo().is(function() {
    return {
      modelUtils: {
        underscorize: function (name) { return name }
      }
    }
  });

  context('server-side', function () {
    it('should error if there is no app in the options', function () {
      expect(function () {
        subject('test')
      }).to.throw(Error)
    });

    it('returns a string with the html');
  });

  context('client-side', function () {
    it('should create a string with data-render set to true');
  });
});

var Handlebars = require('handlebars').create(),
    memo = require('memo-is'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    subject = require('../../../shared/helpers/each')(Handlebars);

describe('each', function () {
  var spy;
  var opts = memo().is(function () {
    return { inverse: function () {} };
  });

  beforeEach(function () {
    spy = sinon.spy();
  });

  it('should invoke the oldEach function', function () {
    subject(spy, opts());
    expect(spy).to.have.been.called
  });
});

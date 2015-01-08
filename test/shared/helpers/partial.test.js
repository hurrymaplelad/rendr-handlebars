var Handlebars = require('handlebars').create(),
    memo = require('memo-is'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    template = memo().is(function () {
      return '<div></div>';
    });

describe('partial', function () {
  var subject, stub, templateStub;

  beforeEach(function () {
    templateStub = sinon.stub().returns(template());
    stub = sinon.stub().returns(templateStub);
    subject = require('../../../shared/helpers/partial')(Handlebars, stub);
  });

  it('it returns the template, calling it with the given hash as the context', function () {
    var result = subject('test', { hash: 'test' }).string;

    expect(result).to.equal(template());
    expect(templateStub).to.have.been.calledWith('test');
  });

  it('creates a block if there is one passed in', function () {
    var fnStub = sinon.stub().returns(template()),
        result = subject('test', { hash: {test: true}, fn: fnStub }).string;

    expect(fnStub).to.have.been.called;
    expect(templateStub.args[0][0]._block).to.equal(template());
  });

});

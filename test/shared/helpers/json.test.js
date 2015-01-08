var Handlebars = require('handlebars').create(),
    memo = require('memo-is'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    subject = require('../../../shared/helpers/json')(Handlebars);

describe('json', function () {
  var data = memo().is(function () {
    return {
      'a': true,
      'b': false,
      'c': [0, 1, 2]
    }
  });

  it('stringifys an object to json', function () {
    var result = subject(data()).string;

    expect(result).to.be.a('string');
    expect(result).to.equal(JSON.stringify(data()));
  });
});

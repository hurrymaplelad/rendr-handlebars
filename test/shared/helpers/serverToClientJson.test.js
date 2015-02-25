var Handlebars = require('handlebars').create(),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    subject = require('../../../shared/helpers/serverToClientJson')(Handlebars);

describe('serverToClientJson', function () {
  var data = { key: 'права' }

  it('should add JSON.parse and unescape to the string', function () {
    var result = subject(data),
        expectedResult = 'JSON.parse(unescape("%7B%22key%22%3A%22%u043F%u0440%u0430%u0432%u0430%22%7D"))';

    expect(expectedResult).to.equal(result.string);
  });

  it('should result in the same data after eval', function () {
    var result = subject(data);
    expect(eval(result.string)).to.deep.equal(data);
  });

});

var Handlebars = require('handlebars').create(),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    subject = require('../../../shared/helpers/serverToClientJson')(Handlebars);

describe('serverToClientJson', function () {
  var data = { key: 'права' }

  it('should add JSON.parse and unescape to the string', function () {
    var result = subject(data);
    expect(eval(result.string)).to.deep.equal(data);
  });
});

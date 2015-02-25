'use strict';

var chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  expect = chai.expect,
  helpers = require('../../shared/helpers'),
  Handlebars = require('handlebars').create(),
  subject;

chai.use(sinonChai);

describe('helpers', function () {
  beforeEach(function () {
    subject = helpers(Handlebars);
  });

  it('has the helpers we expect', function () {
    expect(subject.json).to.be.a('function');
    expect(subject.each).to.be.a('function');
    expect(subject.forEach).to.be.a('function');
    expect(subject.partial).to.be.a('function');
    expect(subject.view).to.be.a('function');
    expect(subject.serverToClientJson).to.be.a('function');
  });
});

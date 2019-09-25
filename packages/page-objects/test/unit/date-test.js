'use strict';

const { describe, it } = require('../../../../helpers/mocha');
const { expect } = require('../../../../helpers/chai');
const {
  encodeString,
  shouldPurge,
} = require('../../src/helpers/date');
const sinon = require('sinon');

describe(function() {
  beforeEach(function() {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('encodes a string', function() {
    let name = 'test-name';

    let encoded = encodeString(name);

    expect(encoded).to.not.equal(name);
  });

  it('should not purge if name mismatch', function() {
    let name = 'test-name';

    let oldEncoded = encodeString(name);

    expect(shouldPurge(oldEncoded, ['mismatch'])).to.be.false;
  });

  it('should not purge if match and in range', function() {
    let name = 'test-name';

    let oldEncoded = encodeString(name);

    expect(shouldPurge(oldEncoded, [name])).to.be.false;
  });

  it('should purge if match and not in range', function() {
    let name = 'test-name';

    this.sandbox.useFakeTimers(new Date().getTime() - 60 * 60 * 1000);

    let oldEncoded = encodeString(name);

    this.sandbox.restore();

    expect(shouldPurge(oldEncoded, [name], 30 * 60 * 1000)).to.be.true;
  });

  it('should purge if match and force not in range', function() {
    let name = 'test-name';

    let oldEncoded = encodeString(name, true);

    expect(shouldPurge(oldEncoded, [name])).to.be.true;
  });
});

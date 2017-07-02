// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if gte returns true when the first number is greater than or equal to the second number, false if not', (t) => {
  const largerNumber = 10;
  const equalNumber = 10;
  const smallerNumber = 5;

  t.true(utils.gte(largerNumber, smallerNumber));
  t.true(utils.gte(largerNumber, equalNumber));
  t.false(utils.gte(smallerNumber, largerNumber));
});

test('if getComponentName returns the name if it exists, else returns function', (t) => {
  function Foo() {}

  const namedResult = utils.getComponentName(Foo);

  t.is(namedResult, 'Foo');

  Foo.displayName = 'Bar';

  const displayNameResult = utils.getComponentName(Foo);

  t.is(displayNameResult, Foo.displayName);

  const Arrow = () => {};
  const arrowResult = utils.getComponentName(Arrow);

  t.is(arrowResult, 'Arrow');

  const lamdaResult = utils.getComponentName(() => {});

  t.is(lamdaResult, 'Component');
});

test('if getFunctionNameViaRegexp will match the function name if it exists', (t) => {
  function Foo() {}

  const namedResult = utils.getFunctionNameViaRegexp(Foo);

  t.is(namedResult, 'Foo');

  const anonymousResult = utils.getFunctionNameViaRegexp(function() {}); //eslint-disable-line prefer-arrow-callback

  t.is(anonymousResult, '');

  const invalidResult = utils.getFunctionNameViaRegexp('foo'); //eslint-disable-line prefer-arrow-callback

  t.is(invalidResult, '');
});

test('if hasWindow will return false if no window exists', (t) => {
  t.false(utils.hasWindow());
});

test.serial('if hasWindow will return true if a window exists globally', (t) => {
  const current = global.window;

  global.window = {};

  t.true(utils.hasWindow());

  global.window = current;
});

test('if isPlainObject only returns true if the parameter passed is a plain object', (t) => {
  const array = [];
  const boolean = true;
  const fn = () => {};
  const nul = null;
  const number = 123;
  const plainObject = {};
  const regexp = /foo/;
  const string = 'foo';
  const symbol = Symbol('foo');
  const undef = undefined;

  t.false(utils.isPlainObject(array));
  t.false(utils.isPlainObject(boolean));
  t.false(utils.isPlainObject(fn));
  t.false(utils.isPlainObject(nul));
  t.false(utils.isPlainObject(number));
  t.false(utils.isPlainObject(regexp));
  t.false(utils.isPlainObject(string));
  t.false(utils.isPlainObject(symbol));
  t.false(utils.isPlainObject(undef));

  t.true(utils.isPlainObject(plainObject));
});

test.serial('if resetTimers will default now to Date.now()', (t) => {
  const current = global.window;

  global.window = {
    localStorage: {
      setItem: sinon.spy()
    }
  };

  const key = 'foo';
  const options = {
    idleAfter: 10,
    timeOutAfter: 20
  };
  const now = Date.now();

  utils.resetTimers(key, options);

  t.true(global.window.localStorage.setItem.calledOnce);

  const newValues = JSON.parse(global.window.localStorage.setItem.firstCall.args[1]);

  t.true(newValues.idleAfter >= now + options.idleAfter);
  t.true(newValues.timeOutAfter >= now + options.timeOutAfter);

  global.window = current;
});

test('if setLocalStorageValues will do nothing if there is no window', (t) => {
  try {
    utils.setLocalStorageValues();

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test.serial('if setLocalStorageValues will set the localStorage values for the keys passed', (t) => {
  const current = global.window;

  global.window = {
    localStorage: {
      setItem: sinon.spy()
    }
  };

  const key = 'foo';
  const values = {bar: 'baz'};

  utils.setLocalStorageValues(key, values);

  t.true(global.window.localStorage.setItem.calledOnce);
  t.true(global.window.localStorage.setItem.calledWith(key, JSON.stringify(values)));

  global.window = current;
});

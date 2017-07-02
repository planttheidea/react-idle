// constants
import {
  FUNCTION_NAME_REGEXP
} from './constants';

/**
 * @function gte
 *
 * @description
 * is the firstNumber greater than or equal to the secondNumber
 *
 * @param {number} firstNumber
 * @param {number} secondNumber
 * @returns {boolean}
 */
export const gte = (firstNumber, secondNumber) => {
  return firstNumber >= secondNumber;
};

/**
 * @private
 *
 * @function getFunctionNameViaRegexp
 *
 * @description
 * use regexp match on stringified function to get the function name
 *
 * @param {function} fn function to get the name of
 * @returns {string} function name
 */
export const getFunctionNameViaRegexp = (fn: Function): string => {
  const match = fn.toString().match(FUNCTION_NAME_REGEXP);

  return match ? match[1] : '';
};

/**
 * @private
 *
 * @function getComponentName
 *
 * @description
 * get the component name, either from modern property or regexp match, falling back to generic string
 *
 * @param {function} fn function to get the name of
 * @returns {string} function name
 */
export const getComponentName = (fn: Function): string => {
  return fn.displayName || fn.name || getFunctionNameViaRegexp(fn) || 'Component';
};

/**
 * @function hasWindow
 *
 * @description
 * does the window exist
 *
 * @returns {boolean} does the window exist
 */
export const hasWindow = () => {
  return typeof window !== 'undefined';
};

/**
 * @function isPlainObject
 *
 * @description
 * is the object passed a plain object
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object a plain object
 */
export const isPlainObject = (object) => {
  return !!object && object.constructor === Object;
};

/**
 * @function setLocalStorageValues
 *
 * @description
 * set the values passed in local storage
 *
 * @param {string} key the key to assign the values to
 * @param {Object} values the values to save
 */
export const setLocalStorageValues = (key, values) => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(values));
};

/**
 * @function resetTimers
 *
 * @description
 * reset the timers to new values based on the current datetime
 *
 * @param {string} key the key to assign the values to
 * @param {Object} options the options passed to the component instance
 * @param {number} options.timeOutAfter the amount of milliseconds to wait before timing out
 * @param {number} options.idleAfter the amount of milliseconds to wait before warning of impending out
 * @returns {Object} the new values saved in storage
 */
export const resetTimers = (key, options) => {
  const now = Date.now();
  const idleAfter = now + options.idleAfter;
  const timeOutAfter = idleAfter + options.timeOutAfter;

  const newValues = {
    idleAfter,
    timeOutAfter
  };

  setLocalStorageValues(key, newValues);

  return newValues;
};

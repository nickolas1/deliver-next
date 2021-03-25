(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }

    var number = Number(dirtyNumber);

    if (isNaN(number)) {
      return number;
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }

  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
    }
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */

  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument); // Clone the date

    if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime());
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument);
    } else {
      if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

        console.warn(new Error().stack);
      }

      return new Date(NaN);
    }
  }

  /**
   * @name addMonths
   * @category Month Helpers
   * @summary Add the specified number of months to the given date.
   *
   * @description
   * Add the specified number of months to the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the months added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 5 months to 1 September 2014:
   * const result = addMonths(new Date(2014, 8, 1), 5)
   * //=> Sun Feb 01 2015 00:00:00
   */

  function addMonths(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var amount = toInteger(dirtyAmount);

    if (isNaN(amount)) {
      return new Date(NaN);
    }

    if (!amount) {
      // If 0 months, no-op to avoid changing times in the hour before end of DST
      return date;
    }

    var dayOfMonth = date.getDate(); // The JS Date object supports date math by accepting out-of-bounds values for
    // month, day, etc. For example, new Date(2020, 1, 0) returns 31 Dec 2019 and
    // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
    // want except that dates will wrap around the end of a month, meaning that
    // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
    // we'll default to the end of the desired month by adding 1 to the desired
    // month and using a date of 0 to back up one day to the end of the desired
    // month.

    var endOfDesiredMonth = new Date(date.getTime());
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
    var daysInMonth = endOfDesiredMonth.getDate();

    if (dayOfMonth >= daysInMonth) {
      // If we're already at the end of the month, then this is the correct date
      // and we're done.
      return endOfDesiredMonth;
    } else {
      // Otherwise, we now know that setting the original day-of-month value won't
      // cause an overflow, so set the desired day-of-month. Note that we can't
      // just set the date of `endOfDesiredMonth` because that object may have had
      // its time changed in the unusual case where where a DST transition was on
      // the last day of the month and its local time was in the hour skipped or
      // repeated next to a DST transition.  So we use `date` instead which is
      // guaranteed to still have the original time.
      date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
      return date;
    }
  }

  /**
   * @name addQuarters
   * @category Quarter Helpers
   * @summary Add the specified number of year quarters to the given date.
   *
   * @description
   * Add the specified number of year quarters to the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of quarters to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the quarters added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 1 quarter to 1 September 2014:
   * const result = addQuarters(new Date(2014, 8, 1), 1)
   * //=> Mon Dec 01 2014 00:00:00
   */

  function addQuarters(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    var months = amount * 3;
    return addMonths(dirtyDate, months);
  }

  /**
   * @name addYears
   * @category Year Helpers
   * @summary Add the specified number of years to the given date.
   *
   * @description
   * Add the specified number of years to the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of years to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the years added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 5 years to 1 September 2014:
   * const result = addYears(new Date(2014, 8, 1), 5)
   * //=> Sun Sep 01 2019 00:00:00
   */

  function addYears(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMonths(dirtyDate, amount * 12);
  }

  function nextQuarter(fromWhen = new Date()) {
    const month = addQuarters(fromWhen, 1).getMonth() + 1;
    return 'Q' + Math.ceil(month / 3)
  }

  function nextYear(fromWhen = new Date()) {
    return addYears(fromWhen, 1).getFullYear().toString()
  }

  module.exports = {
    nextQuarter,
    nextYear
  };

})));

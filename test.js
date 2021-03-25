const {nextQuarter, nextYear} = require('./dist/bundle');
const {parseISO} = require('date-fns');

test('nextQuarter gives the next quarter', () => {
  expect(nextQuarter(parseISO('2020-02-01T00:00:00Z'))).toBe('Q2')
  expect(nextQuarter(parseISO('2008-12-01T00:00:00Z'))).toBe('Q1')
})

test('nextYear gives the next year', () => {
  expect(nextYear(parseISO('2020-02-01T00:00:00Z'))).toBe('2021')
  expect(nextYear(parseISO('2008-12-01T00:00:00Z'))).toBe('2009')
})

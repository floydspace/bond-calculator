import R from 'ramda';

import {
  isEqual, getYear, setYear, getMonth, addMonths, startOfDay, endOfDay, endOfMonth,
} from 'date-fns';

const min30 = R.min(30);
const min30If = condition => R.when(R.always(condition), min30);
const base30360Formula = (d1, m1, y1, d2, m2, y2) => (y2 - y1) * 360 + (m2 - m1) * 30 + d2 - d1;

/* eslint-disable max-len */
export const countDays30E360 = (d1, m1, y1, d2, m2, y2) => base30360Formula(min30(d1), m1, y1, min30(d2), m2, y2);
export const countDays30360 = (d1, m1, y1, d2, m2, y2) => base30360Formula(min30(d1), m1, y1, min30If(d1 >= 30)(d2), m2, y2);
/* eslint-enable max-len */

export const startOfEndOfMonth = R.compose(startOfDay, endOfMonth);

export const isEndOfMonth = R.converge(isEqual, [endOfDay, endOfMonth]);
export const isFebruary = R.compose(R.equals(1), getMonth);
export const isEndOfFebruary = R.both(isEndOfMonth, isFebruary);

export const endOfFebruary = year => startOfEndOfMonth(new Date(year, 1));

export const addPeriods = R.curry((date, frequency, n) => addMonths(date, 12 / frequency * n));

export const changeYear = (date1, date2) => (
  isEndOfFebruary(date1) ? endOfFebruary(getYear(date2)) : setYear(date1, getYear(date2))
);

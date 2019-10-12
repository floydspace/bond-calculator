import R from 'ramda';

import {
  differenceInDays,
  differenceInMonths,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';

import {
  addPeriods,
  changeYear,
  countDays30360,
  countDays30E360,
  isEndOfFebruary,
  isEndOfMonth,
  startOfEndOfMonth,
} from './utils';

const differenceInMonthsC = R.curry(differenceInMonths);
const isBeforeOrEqual = R.curry((dateLeft, dateRight) => R.either(isBefore, isEqual)(dateLeft, dateRight));
const isAfterC = R.curry(isAfter);

export const days = (previous: Date | string, next: Date | string, frequency: number, convention: string) => {
  switch (convention) {
    case 'ACTUAL/365':
      return 365 / frequency;
    case 'ACTUAL/ACTUAL':
      return differenceInDays(next, previous);
    case '30U/360':
    case '30E/360':
    case '30/360':
    case 'ACTUAL/360':
    default:
      return 360 / frequency;
  }
};

export const accrued = (date1: Date | string, date2: Date | string, convention: string) => {
  let d1 = getDate(date1);
  const m1 = getMonth(date1);
  const y1 = getYear(date1);

  let d2 = getDate(date2);
  const m2 = getMonth(date2);
  const y2 = getYear(date2);

  switch (convention) {
    case '30/360':
      return countDays30360(d1, m1, y1, d2, m2, y2);
    case '30E/360':
      return countDays30E360(d1, m1, y1, d2, m2, y2);
    case 'ACTUAL/360':
    case 'ACTUAL/365':
    case 'ACTUAL/ACTUAL':
      return differenceInDays(date2, date1);
    case '30U/360':
    default:
      if (isEndOfFebruary(date1)) d1 = 30;
      if (isEndOfFebruary(date1) && isEndOfFebruary(date2)) d2 = 30;
      return countDays30360(d1, m1, y1, d2, m2, y2);
  }
};

export const dates = (settlement: Date | string, maturity: Date | string, frequency: number) => R.map(
  R.compose(
    R.when(R.always(isEndOfMonth(maturity)), startOfEndOfMonth),
    addPeriods(changeYear(maturity, settlement), frequency)
  ),
  R.range(1 - R.max<number>(4)(frequency), R.max<number>(4)(frequency))
);

export const previous = (settlement: Date | string, maturity: Date | string, frequency: number) => R.compose(
  R.findLast(isBeforeOrEqual(R.__, settlement)),
  dates
)(settlement, maturity, frequency);

export const next = (settlement: Date | string, maturity: Date | string, frequency: number) => R.compose(
  R.find<any>(isAfterC(R.__, settlement)), // eslint-disable-line @typescript-eslint/no-explicit-any
  dates
)(settlement, maturity, frequency);

export const num = (settlement: Date | string, maturity: Date | string, frequency: number) => R.compose(
  Math.ceil,
  R.add(1),
  R.multiply(frequency / 12),
  differenceInMonthsC(maturity),
  next
)(settlement, maturity, frequency);

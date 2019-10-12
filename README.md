# Bond calculator

[![npm version](https://badge.fury.io/js/%40floydspace%2Fbond-calculator.svg)](https://badge.fury.io/js/%40floydspace%2Fbond-calculator)
[![Build Status](https://travis-ci.org/floydspace/bond-calculator.svg?branch=master)](https://travis-ci.org/floydspace/bond-calculator)
[![Coverage Status](https://coveralls.io/repos/github/floydspace/bond-calculator/badge.svg?branch=master)](https://coveralls.io/github/floydspace/bond-calculator?branch=master)

Yield and price calculations for bonds.

Gives the same results as Excel [YIELD](https://support.office.com/en-US/article/YIELD-function-F5F5CA43-C4BD-434F-8BD2-ED3C9727A4FE) and [PRICE](https://support.office.com/en-us/article/PRICE-function-3ea9deac-8dfa-436f-a7c8-17ea02c21b0a) functions.

The following day count conventions are supported:
* 30U/360
* ACTUAL/ACTUAL
* ACTUAL/360
* ACTUAL/365
* 30E/360
* 30/360

More info about day count conventions can be found on [Wikipedia](https://en.wikipedia.org/wiki/Day_count_convention).

## Installation
```
npm install --save @floydspace/bond-calculator
```

## Usage
```javascript
const bondCalculator = require('@floydspace/bond-calculator');

const bond = bondCalculator({
  settlement: '2016-12-26',
  maturity: '2023-01-17',
  rate: 0.02625, // 2.625%
  redemption: 100,
  frequency: 2, // 1=Annual, 2=Semiannual, 4=Quarterly, 12=Monthly
  convention: '30U/360',
});

// Calculate yield for a given price
const yld = bond.yield(98); // 2.98817753210426%

// Calculate price for a given yield
const price = bond.price(0.025); // 100.69785390232649
```

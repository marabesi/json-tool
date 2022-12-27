/* istanbul ignore file */

// ignore file is in here because of cypress instrumentation code

// @preval
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../tailwind.config');
module.exports = resolveConfig(tailwindConfig);

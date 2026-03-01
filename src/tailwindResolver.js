/* istanbul ignore file */

// ignore file is in here because of cypress instrumentation code

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config';

export default resolveConfig(tailwindConfig);

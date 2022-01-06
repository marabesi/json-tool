#!/bin/bash

rm -rf node_modules/
npm i
npm run build
CI=true npm run test
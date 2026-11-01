#!/bin/bash

docker compose run --rm json-tool rm -rf node_modules/ coverage/ build/ .nyc_output
docker compose run --rm json-tool pnpm install
docker compose run --rm json-tool pnpm run docs:build
docker compose run --rm json-tool pnpm run build
docker compose run --service-ports --rm -d json-tool pnpm run start-instrumented
echo "Sleeping 20 seconds for the application to start"
sleep 20
echo "Woke up, after 20 seconds, running tests now..."
docker compose run --rm -e CI=true json-tool pnpm run test
echo "Building Cypress image with Chrome for Testing..."
docker build -f Dockerfile.cypress -t json-tool-cypress:16.2.1 .
docker run --network=host --rm --entrypoint /usr/local/bin/node -e CYPRESS_BASE_URL=http://localhost:3000 -v "$(pwd)":/app -w /app json-tool-cypress:16.2.1 scripts/run-cypress.mjs run --headed
docker compose down --remove-orphans
docker compose run --rm json-tool rm -rf node_modules/ coverage/ build/ .nyc_output
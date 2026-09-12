#!/bin/bash

docker compose run --rm json-tool rm -rf node_modules/ coverage/ build/ .nyc_output
docker compose run --rm json-tool pnpm install
docker compose run --rm json-tool pnpm run build
docker compose run --service-ports --rm -d json-tool pnpm run start-instrumented
echo "Sleeping 20 seconds for the application to start"
sleep 20
echo "Woke up, after 20 seconds, running tests now..."
docker compose run --rm -e CI=true json-tool pnpm run test
docker run --network=host --rm -e CYPRESS_BASE_URL=http://localhost:3000 -e ELECTRON_EXTRA_LAUNCH_ARGS=--remote-debugging-port=9222 -v $(pwd):/app -w /app cypress/included:16.0.0 pnpm run e2e
docker compose down --remove-orphans
docker compose run --rm json-tool rm -rf node_modules/ coverage/ build/ .nyc_output
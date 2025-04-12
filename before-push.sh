#!/bin/bash

docker compose run --rm json-tool rm -rf node_modules/ coverage/ build/ .nyc_output
docker compose run --rm json-tool npm i 
docker compose run --rm json-tool npm run build
docker compose run --service-ports --rm -d json-tool npm run start
echo "Sleeping 10 seconds for the application to start"
sleep 10
echo "Woke up, after 10 seconds, running tests now..."
docker compose run --rm -e CI=true json-tool npm run test
docker run --network=host --rm -e CYPRESS_BASE_URL=http://localhost:3000 -v $(pwd):/app -w /app cypress/included:14.3.0 npm run e2e
docker compose down --remove-orphans
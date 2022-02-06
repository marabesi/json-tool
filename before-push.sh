#!/bin/bash

docker-compose run --rm json-tool rm -rf node_modules/
docker-compose run --rm json-tool npm i
docker-compose run --rm json-tool npm run build
docker-compose run --rm -d json-tool npm run start
echo "Sleeping 10 seconds for the application to start"
sleep 10
echo "Woke up, after 10 seconds, running tests now..."
docker-compose run --rm -e CI=true json-tool npm run test
docker run --rm -v $(pwd):/app -w /app cypress/included:3.2.0 npm run e2e
docker-compose down --remove-orphans
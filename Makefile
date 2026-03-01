.PHONY: build start e2e clean before-push

build:
		@echo "Running build steps..."
		docker compose run --rm json-tool rm -rf node_modules/ coverage/ build/ .nyc_output
		docker compose run --rm json-tool npm i 
		docker compose run --rm json-tool npm run build

start:
		@echo "Starting the application..."
		docker compose run --service-ports --rm -d json-tool npm run start
		@echo "Sleeping 10 seconds for the application to start"
		sleep 10

e2e:
		@echo "Running tests..."
		docker compose run --rm -e CI=true json-tool npm run test
		docker run --network=host --rm -e CYPRESS_BASE_URL=http://localhost:3000 -v $(shell pwd):/app -w /app cypress/included:15.10.0 npm run e2e

clean:
		@echo "Cleaning up..."
		docker compose down --remove-orphans

before-push:
		@if [ "$(BUIL_APP)" = "true" ]; then \
				$(MAKE) build; \
		else \
				echo "Skipping build steps..."; \
		fi
		@if [ "$(START_APP)" = "true" ]; then \
				$(MAKE) start; \
		else \
				echo "Skipping start steps..."; \
		fi
		@if [ "$(RUN_E2E)" = "true" ]; then \
				$(MAKE) e2e; \
		else \
				echo "Skipping E2E tests..."; \
		fi
		$(MAKE) clean
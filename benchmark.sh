#!/bin/bash

# Build Benchmarking Script
# Measures npm install and build performance across git commits
# Usage: ./benchmark.sh <start-commit> <end-commit> [runs-per-commit]

set -e

# Configuration
RUNS_PER_COMMIT=${3:-3}
CSV_FILE="benchmark-results.csv"
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
LOG_FILE="benchmark-$(date +%s).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}" | tee -a "$LOG_FILE"
}

# Validation
if [ $# -lt 2 ]; then
    error "Usage: $0 <start-commit> <end-commit> [runs-per-commit]"
    error "Example: $0 abc123 def456 5"
    exit 1
fi

START_COMMIT=$1
END_COMMIT=$2

# Verify commits exist
if ! git rev-parse "$START_COMMIT" > /dev/null 2>&1; then
    error "Start commit '$START_COMMIT' not found"
    exit 1
fi

if ! git rev-parse "$END_COMMIT" > /dev/null 2>&1; then
    error "End commit '$END_COMMIT' not found"
    exit 1
fi

# System info
log "=== System Information ==="
log "Node version: $(node --version)"
log "npm version: $(npm --version)"
log "OS: $(uname -s)"
log "CPU cores: $(sysctl -n hw.ncpu 2>/dev/null || echo 'unknown')"
log "Original branch: $ORIGINAL_BRANCH"
log "Runs per commit: $RUNS_PER_COMMIT"
log ""

# Initialize CSV
log "=== Starting Benchmark ==="
echo "commit_hash,commit_date,commit_message,run_number,npm_ci_duration_ms,build_duration_ms,total_duration_ms,timestamp" > "$CSV_FILE"
success "CSV file initialized: $CSV_FILE"

# Get list of commits
COMMITS=$(git rev-list "$START_COMMIT..$END_COMMIT")
COMMIT_COUNT=$(echo "$COMMITS" | wc -l)
log "Found $COMMIT_COUNT commits to benchmark"
log ""

CURRENT_COMMIT_NUM=0

# Main benchmark loop
for COMMIT in $COMMITS; do
    CURRENT_COMMIT_NUM=$((CURRENT_COMMIT_NUM + 1))
    COMMIT_HASH=$(git rev-parse --short "$COMMIT")
    COMMIT_DATE=$(git log -1 --pretty=format:"%aI" "$COMMIT")
    COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s" "$COMMIT" | sed 's/,/ /g') # Escape commas for CSV
    
    log "[$CURRENT_COMMIT_NUM/$COMMIT_COUNT] Testing commit $COMMIT_HASH: $COMMIT_MESSAGE"
    
    # Checkout commit
    if ! git checkout "$COMMIT" > /dev/null 2>&1; then
        error "Failed to checkout commit $COMMIT_HASH"
        continue
    fi
    
    # Run benchmark iterations
    for RUN in $(seq 1 "$RUNS_PER_COMMIT"); do
        log "  Run $RUN/$RUNS_PER_COMMIT..."
        
        # Clean build artifacts
        rm -rf dist build node_modules/.vite node_modules/.cache 2>/dev/null || true
        
        TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
        
        # Measure npm ci
        NPM_CI_START=$(date +%s%N)
        if npm ci --legacy-peer-deps > /dev/null 2>&1; then
            NPM_CI_END=$(date +%s%N)
            NPM_CI_MS=$(( (NPM_CI_END - NPM_CI_START) / 1000000 ))
        else
            error "npm ci failed for commit $COMMIT_HASH run $RUN"
            NPM_CI_MS=0
        fi
        
        # Measure build
        BUILD_START=$(date +%s%N)
        if npm run build > /dev/null 2>&1; then
            BUILD_END=$(date +%s%N)
            BUILD_MS=$(( (BUILD_END - BUILD_START) / 1000000 ))
        else
            error "npm run build failed for commit $COMMIT_HASH run $RUN"
            BUILD_MS=0
        fi
        
        TOTAL_MS=$((NPM_CI_MS + BUILD_MS))
        
        # Append to CSV
        echo "$COMMIT_HASH,$COMMIT_DATE,\"$COMMIT_MESSAGE\",$RUN,$NPM_CI_MS,$BUILD_MS,$TOTAL_MS,$TIMESTAMP" >> "$CSV_FILE"
        
        log "    npm ci: ${NPM_CI_MS}ms | build: ${BUILD_MS}ms | total: ${TOTAL_MS}ms"
    done
    
    log ""
done

# Return to original branch
log "Returning to original branch: $ORIGINAL_BRANCH"
git checkout "$ORIGINAL_BRANCH" > /dev/null 2>&1
success "Benchmark complete!"

# Calculate and display statistics
log ""
log "=== Summary Statistics ==="
log "Results saved to: $CSV_FILE"
log ""

# Display statistics using awk
awk -F',' '
NR > 1 {
    commit = $1
    build_time = $5
    
    if (!(commit in build_times)) {
        build_times[commit] = 0
        count[commit] = 0
    }
    
    build_times[commit] += build_time
    count[commit]++
}

END {
    printf "%-12s %-25s %-12s\n", "Commit", "Avg Build Time (ms)", "Runs"
    printf "%-12s %-25s %-12s\n", "------", "-----------------", "----"
    
    for (commit in build_times) {
        avg = build_times[commit] / count[commit]
        printf "%-12s %-25.0f %-12s\n", commit, avg, count[commit]
    }
}' "$CSV_FILE"

log ""
success "✓ Benchmark data ready for analysis in $CSV_FILE"
log "Log file: $LOG_FILE"

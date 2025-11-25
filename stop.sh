#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$SCRIPT_DIR/api.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "API server is not running (no PID file found)"
    exit 1
fi

PID=$(cat "$PID_FILE")

if ps -p "$PID" > /dev/null 2>&1; then
    kill "$PID"
    rm "$PID_FILE"
    echo "API server stopped (PID: $PID)"
else
    rm "$PID_FILE"
    echo "API server was not running (stale PID file removed)"
fi

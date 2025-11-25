#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$SCRIPT_DIR/api.pid"
LOG_FILE="$SCRIPT_DIR/api.log"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "API server is already running (PID: $PID)"
        exit 1
    else
        rm "$PID_FILE"
    fi
fi

cd "$SCRIPT_DIR"
nohup node index.js > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

echo "API server started (PID: $(cat $PID_FILE))"
echo "Logs: $LOG_FILE"

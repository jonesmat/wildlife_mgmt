#!/bin/bash
PID=$(lsof -ti :3000 2>/dev/null)
if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null
    echo " Server stopped."
else
    echo " Server is not running."
fi

#!/bin/bash

declare -a PIDS="()"
die() {
  local status_code=$1
  local PID

  for PID in "${PIDS[@]}"; do
    kill $PID 2>/dev/null
  done

  exit "$status_code"
}

trap "die 1" SIGINT SIGTERM
trap "kill 0" EXIT

npm run webpack

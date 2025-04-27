#!/bin/bash

# Kill any existing Vite processes
pkill -f "vite" || true

# Start the development server with the correct configuration
npx vite --port 5173 --host

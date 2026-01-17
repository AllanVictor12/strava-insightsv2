#!/bin/sh

# Iniciar o backend (API) em background
cd /app/server
node index.js &

# Iniciar o frontend (servidor estático)
cd /app
serve -s dist -l 3000


#!/bin/sh
set -e

echo "Dependências..."
npm install

echo "Iniciando aplicação..."
exec npm run dev

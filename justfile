# run `just` to see all recipes

set shell := ["bash", "-cu"]

# show available recipes (default)
default:
    @just --list

# install dependencies (open the portal)
install:
    npm install

# run the dev server (fire up the garage)
dev: _ensure-deps
    npm run dev:api & npm run dev

# build for production (compress into a microverse)
build: _ensure-deps
    npm run build

# run the built site and API together
start: build
    npm run start

# preview the production build
preview: build
    npm run preview

# nuke node_modules + build output (schwifty reset)
clean:
    rm -rf node_modules dist .vite

# install deps only if node_modules is missing
_ensure-deps:
    @[ -d node_modules ] || just install

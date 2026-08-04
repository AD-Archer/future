# FUTURE — run `just` to see all recipes

set shell := ["bash", "-cu"]

# show available recipes (default)
default:
    @just --list

# install dependencies
install:
    npm install

# run the dev server
dev: _ensure-deps
    npm run dev

# build for production (static site in dist/)
build: _ensure-deps
    npm run build

# preview the production build
preview: build
    npm run preview

# nuke node_modules + build output
clean:
    rm -rf node_modules dist .vite

# install deps only if node_modules is missing
_ensure-deps:
    @[ -d node_modules ] || just install

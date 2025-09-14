
# mobx-router

A minimal, observable-first router for React apps, powered by MobX. This library provides a simple, store-driven approach to client-side routing, making navigation and route state observable and easy to react to in your UI. It is ideal for projects that want to leverage MobX for all state, including navigation, without the complexity of traditional router libraries.


## Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [Setup](#setup)
- [Development](#development)
- [Example App](#example-app)

## Purpose

`mobx-router` is designed to provide a lightweight, MobX-native routing solution for React applications. It exposes navigation and route state as observable properties, enabling seamless integration with MobX-powered UIs.

## Features

- Observable route state and navigation
- Simple API: just a MobX store and a few helpers
- No context providers or hooks required
- Easily testable and composable
- TypeScript support

## Setup

Install the dependencies:

```bash
pnpm install
```

## Development

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

## Example App

An example React app using `mobx-router` is available in the [`example/`](./example) directory. To run it:

```bash
cd example
pnpm install
pnpm dev
```

## License

MIT

## Author

Luis Middleton

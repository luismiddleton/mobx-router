# Project Overview

This project is a lightweight, observable-first router for React applications, powered by MobX. It provides a simple, store-driven approach to client-side routing, making navigation and route state observable and easy to react to in your UI. It is ideal for projects that want to leverage MobX for all state, including navigation, without the complexity of traditional router libraries.

The main technologies used are:
- **TypeScript**: For static typing.
- **React**: For the UI.
- **MobX**: For state management.
- **Vite**: For the build tooling and test runner.

The project is structured as a library, with the main source code in the `src` directory and an example application in the `example` directory.

# Building and Running

## Building the library

To build the library, run:

```bash
pnpm build
```

To build the library in watch mode, run:

```bash
pnpm dev
```

## Running the example app

An example React app using `mobx-router` is available in the `example/` directory. To run it:

```bash
cd example
pnpm install
pnpm dev
```

## Running tests

To run the tests, run:

```bash
pnpm test
```

To run the tests in watch mode, run:

```bash
pnpm test:watch
```

To run the tests with coverage, run:

```bash
pnpm test:coverage
```

# Development Conventions

## Coding Style

The project uses TypeScript and follows standard React and MobX conventions. The code is organized into a `src` directory with a main `Store.ts` file that contains the core logic of the router.

## Testing

The project uses `vitest` for testing. Tests are located in the `src` directory alongside the files they test, with a `.test.ts` extension. The tests use `jsdom` to simulate a browser environment.

## Contribution Guidelines

There are no explicit contribution guidelines in the repository. However, the presence of a `LICENSE` file and a `package.json` with a repository field suggests that contributions are welcome. It is recommended to follow the existing coding style and to add tests for any new features.

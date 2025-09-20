This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/
  index.ts
  Store.test.ts
  Store.ts
  Store.types.ts
```

# Files

## File: src/index.ts
```typescript

```

## File: src/Store.types.ts
```typescript
import type { ReactElement } from "react";
⋮----
export type Route = {
  path: string;
  /**
   * The React component to render for this route.
   */
  component: ReactElement;
  /**
   * A callback function that loads data before rendering the component.
   * @todo Add support for onLoaderSuccess and onLoaderError
   */
  loader?: () => Promise<void>;
  /**
   * A React component to display while the route is loading.
   * @todo Add support for onLoaderSuccess and onLoaderError
   */
  loadingComponent?: ReactElement;
  /**
   * A callback function that is called when the loader throws.
   * @todo Add support for onLoaderSuccess and onLoaderError
   * @param error  
   */
  onLoaderError?: (error: unknown) => void;
};
⋮----
/**
   * The React component to render for this route.
   */
⋮----
/**
   * A callback function that loads data before rendering the component.
   * @todo Add support for onLoaderSuccess and onLoaderError
   */
⋮----
/**
   * A React component to display while the route is loading.
   * @todo Add support for onLoaderSuccess and onLoaderError
   */
⋮----
/**
   * A callback function that is called when the loader throws.
   * @todo Add support for onLoaderSuccess and onLoaderError
   * @param error  
   */
```

## File: src/Store.test.ts
```typescript
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import RouterStore from "./Store";
import type { ReactElement } from "react";
import { Route } from "./Store.types";
⋮----
// Mock components for testing
⋮----
// Mock window.history.pushState
⋮----
// Mock window.location.href
⋮----
// Dispatch the event
⋮----
// Check that the location has been updated
⋮----
// Restore original window.location.href
⋮----
// @ts-ignore
```

## File: src/Store.ts
```typescript
import type { ReactElement } from "react";
import {
  observable,
  makeObservable,
  reaction,
  action,
  IReactionDisposer,
  computed,
} from "mobx";
import { Route } from "./Store.types";
⋮----
/**
 * @class RouterStore
 * @description A MobX store to manage routing state and actions.
 */
class RouterStore
⋮----
/**
   * The current location object, containing pathname, search, and hash.
   * @observable
   */
⋮----
/**
   * The currently active React component based on the route.
   * @observable
   */
⋮----
/**
   * A flag to indicate if the route is currently loading.
   * @observable
   */
⋮----
/**
   * A disposer for the MobX reaction to prevent memory leaks.
   */
⋮----
/**
   * Initializes the RouterStore, sets up observables, and adds a popstate event listener.
   */
constructor()
⋮----
/**
   * Navigates to a new path, updating the browser history and the store's location.
   * @param {string} path - The path to navigate to.
   * @action
   */
⋮----
/**
   * Parses a URL path string into a location object.
   * @param {string} path - The URL path string.
   */
parsePath(path: string)
⋮----
// Handle cases where the path is not a full URL
⋮----
/**
   * Handles the browser's popstate event to update the location.
   */
⋮----
// Explicitly update the properties of the observable object
⋮----
/**
   * Sets the active component to be rendered.
   * @param component - The React component to set as active.
   */
setActiveComponent(component: ReactElement)
⋮----
/**
   * Sets up a MobX reaction to match the current path against a list of routes
   * and update the active component accordingly. It also handles loading states.
   * @param {Route[]} routes - An array of route objects.
   * @param {ReactElement} NotFoundComponent - The component to display when no route matches.
   */
⋮----
/**
   * Renders the currently active component
   */
get renderComponent()
⋮----
/**
   * Cleans up resources, removing event listeners and disposing of MobX reactions
   * to prevent memory leaks.
   */
```

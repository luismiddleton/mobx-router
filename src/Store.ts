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

/**
 * @class RouterStore
 * @description A MobX store to manage routing state and actions.
 */
class RouterStore {
  /**
   * The current location object, containing pathname, search, and hash.
   * @observable
   */
  location = { pathname: "/", search: "", hash: "" };
  /**
   * The currently active React component based on the route.
   * @observable
   */
  activeComponent: ReactElement | null = null;
  /**
   * A flag to indicate if the route is currently loading.
   * @observable
   */
  isLoading = false;
  /**
   * A disposer for the MobX reaction to prevent memory leaks.
   */
  disposeReaction: IReactionDisposer | null = null;

  /**
   * Initializes the RouterStore, sets up observables, and adds a popstate event listener.
   */
  constructor() {
    makeObservable(this, {
      location: observable,
      isLoading: observable,
      activeComponent: observable.ref,
      navigate: action,
      setActiveComponent: action,
      renderComponent: computed,
    });
    window.addEventListener("popstate", this.handlePopState);
  }

  /**
   * Navigates to a new path, updating the browser history and the store's location.
   * @param {string} path - The path to navigate to.
   * @action
   */
  navigate = (path: string) => {
    history.pushState({}, "", path);
    this.location = this.parsePath(path);
  };

  /**
   * Parses a URL path string into a location object.
   * @param {string} path - The URL path string.
   */
  parsePath(path: string) {
    try {
      const url = new URL(path);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      };
    } catch (e) {
      // Handle cases where the path is not a full URL
      const [pathname, hash] = path.split("#");
      const [pathWithoutHash, search] = pathname.split("?");
      return {
        pathname: pathWithoutHash,
        search: search ? `?${search}` : "",
        hash: hash ? `#${hash}` : "",
      };
    }
  }

  /**
   * Handles the browser's popstate event to update the location.
   */
  handlePopState = action("handlePopState", () => {
    const newLocation = this.parsePath(window.location.href);
    // Explicitly update the properties of the observable object
    this.location.pathname = newLocation.pathname;
    this.location.search = newLocation.search;
    this.location.hash = newLocation.hash;
  });

  /**
   * Sets the active component to be rendered.
   * @param component - The React component to set as active.
   */
  setActiveComponent(component: ReactElement) {
    this.activeComponent = component;
  }

  /**
   * Sets up a MobX reaction to match the current path against a list of routes
   * and update the active component accordingly. It also handles loading states.
   * @param {Route[]} routes - An array of route objects.
   * @param {ReactElement} NotFoundComponent - The component to display when no route matches.
   */
  matchRoutes = (routes: Route[], NotFoundComponent: ReactElement) => {
    this.disposeReaction = reaction(
      () => this.location.pathname,
      (pathname) => {
        const matchingRoute = this.findMatchingRoute(routes, pathname);

        this.setActiveComponent(
          matchingRoute ? matchingRoute.component : NotFoundComponent
        );
      },
      { fireImmediately: true, name: "Route Matching Reaction" }
    );
  };

  /**
   * Recursively searches for a matching route in the routes array.
   * @param routes - The routes to search through.
   * @param pathname - The current pathname to match against.
   * @returns The matching route or undefined if no match is found.
   */
  private findMatchingRoute(
    routes: Route[],
    pathname: string,
    basePath = ""
  ): Route | undefined {
    for (const route of routes) {
      // Combine basePath and route.path, then normalize slashes.
      const combinedPath = [basePath, route.path].join("/");
      let fullPath = combinedPath.replace(/\/+/g, "/");

      // Remove trailing slash unless it's the root path.
      if (fullPath !== "/" && fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1);
      }

      if (fullPath === pathname) {
        return route;
      }

      if (route.children) {
        const childMatch = this.findMatchingRoute(
          route.children,
          pathname,
          fullPath
        );
        if (childMatch) {
          return childMatch;
        }
      }
    }
    return undefined;
  }

  /**
   * Renders the currently active component
   */
  get renderComponent() {
    return this.activeComponent!;
  }

  /**
   * Cleans up resources, removing event listeners and disposing of MobX reactions
   * to prevent memory leaks.
   */
  dispose = () => {
    window.removeEventListener("popstate", this.handlePopState);
    if (this.disposeReaction) {
      this.disposeReaction();
    }
  };
}

export default RouterStore;

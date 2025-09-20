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
   * Route parameters extracted from the URL.
   * @observable
   */
  params: Record<string, string> = {};
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
      params: observable,
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
      (pathname) => this.handleRouteMatch(routes, pathname, NotFoundComponent),
      { fireImmediately: true, name: "Route Matching Reaction" }
    );
  };

  /**
   * Handles the logic for matching a route and updating the store.
   * @param {Route[]} routes - An array of route objects.
   * @param {string} pathname - The current pathname to match against.
   * @param {ReactElement} NotFoundComponent - The component to display when no route matches.
   */
  private async handleRouteMatch(
    routes: Route[],
    pathname: string,
    NotFoundComponent: ReactElement
  ) {
    const match = this.findMatchingRoute(routes, pathname);

    if (!match) {
      this.setActiveComponent(NotFoundComponent);
      this.params = {};
      return;
    }

    const { route: matchingRoute, params } = match;
    this.params = params;

    if (!matchingRoute.loader) {
      this.setActiveComponent(matchingRoute.component);
      return;
    }

    this.isLoading = true;
    if (matchingRoute.loadingComponent) {
      this.setActiveComponent(matchingRoute.loadingComponent);
    }

    try {
      await matchingRoute.loader?.(this.params);
      this.setActiveComponent(matchingRoute.component);
    } catch (error) {
      if (matchingRoute.onLoaderError) {
        matchingRoute.onLoaderError(error);
      } else {
        console.error("Loader error:", error);
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Extracts params from a route path (single value per param)
   */
  private extractParams(
    routePath: string,
    pathname: string
  ): Record<string, string> {
    const routeSegments = routePath.split("/").filter(Boolean);
    const pathSegments = pathname.split("/").filter(Boolean);
    const params: Record<string, string> = {};
    let i = 0;
    for (let j = 0; j < routeSegments.length; j++) {
      const segment = routeSegments[j];
      if (segment.startsWith(":")) {
        const paramName = segment.replace(/^:/, "");
        params[paramName] = pathSegments[i] || "";
        i++;
      } else {
        if (segment !== pathSegments[i]) return {};
        i++;
      }
    }
    // Ensure all param values are strings
    Object.keys(params).forEach((key) => {
      if (Array.isArray(params[key])) {
        params[key] = (params[key] as any[]).join("/");
      }
    });
    return params;
  }
  
  /**
   * Recursively searches for a matching route in the routes array.
   * @param routes - The routes to search through.
   * @param pathname - The current pathname to match against.
   * @returns The matching route and extracted params, or undefined if no match is found.
   */
  private findMatchingRoute(
    routes: Route[],
    pathname: string,
    basePath = ""
  ): { route: Route; params: Record<string, string> } | undefined {
    for (const route of routes) {
      const combinedPath = [basePath, route.path].join("/");
      let fullPath = combinedPath.replace(/\/+/g, "/");
      if (fullPath !== "/" && fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1);
      }

      // Only support single param values
      const routePattern = fullPath.replace(/:(\w+)/g, "([^/]+)");
      const regex = new RegExp(`^${routePattern}$`);
      const match = pathname.match(regex);

      if (match) {
        const params = this.extractParams(fullPath, pathname);
        return { route, params };
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

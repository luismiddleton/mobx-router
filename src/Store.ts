import type { ReactElement } from "react";
import {
  observable,
  makeObservable,
  reaction,
  action,
  IReactionDisposer,
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
   * The component to display while a route is loading.
   * @observable
   */
  loadingComponent: ReactElement | null = null;
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
      activeComponent: observable,
      isLoading: observable,
      loadingComponent: observable,
      navigate: action,
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
    this.location = this.parsePath(window.location.href);
  });

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
        const matchingRoute = routes.find((route) => route.path === pathname);

        // Start the loading state and set the specific loading component from the route
        this.isLoading = true;
        this.activeComponent = null; // Clear the previous component
        this.loadingComponent = matchingRoute?.loadingComponent ?? null;

        if (matchingRoute) {
          this.activeComponent = matchingRoute.component;
        } else {
          this.activeComponent = NotFoundComponent;
        }
        // End the loading state after the component is ready
        this.isLoading = false;
        // Clean up the loading component state
        this.loadingComponent = null;
      },
      { fireImmediately: true }
    );
  };

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
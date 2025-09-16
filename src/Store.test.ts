import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import RouterStore from "./Store";
import type { ReactElement } from "react";
import { Route } from "./Store.types";

// Mock components for testing
const HomeComponent = { type: "div", props: { children: "Home" } } as ReactElement;
const AboutComponent = { type: "div", props: { children: "About" } } as ReactElement;
const NotFoundComponent = { type: "div", props: { children: "Not Found" } } as ReactElement;

const routes: Route[] = [
  { path: "/", component: HomeComponent },
  { path: "/about", component: AboutComponent },
];

describe("RouterStore", () => {
  let store: RouterStore;

  beforeEach(() => {
    store = new RouterStore();
    // Mock window.history.pushState
    vi.spyOn(window.history, 'pushState');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with a default location", () => {
    expect(store.location.pathname).toBe("/");
  });

  it("should navigate to a new path and update the location", () => {
    store.navigate("/about");
    expect(store.location.pathname).toBe("/about");
    expect(window.history.pushState).toHaveBeenCalledWith({}, "", "/about");
  });

  it("should match the initial route immediately", () => {
    store.matchRoutes(routes, NotFoundComponent);
    expect(store.activeComponent).toStrictEqual(HomeComponent);
  });

  it("should set the active component to the correct route component on navigation", () => {
    store.matchRoutes(routes, NotFoundComponent);
    store.navigate("/about");
    expect(store.activeComponent).toStrictEqual(AboutComponent);
  });

  it("should set the active component to the NotFoundComponent for an unknown route", () => {
    store.matchRoutes(routes, NotFoundComponent);
    store.navigate("/unknown");
    expect(store.activeComponent).toStrictEqual(NotFoundComponent);
  });

  it("should parse a path with search and hash correctly", () => {
    const location = store.parsePath("/test?query=1#section");
    expect(location).toEqual({
      pathname: "/test",
      search: "?query=1",
      hash: "#section",
    });
  });

  it("should handle popstate events", () => {
    // Mock window.location.href
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/some-other-path'
      },
      writable: true
    });

    // Dispatch the event
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Check that the location has been updated
    expect(store.location.pathname).toBe("/some-other-path");

    // Restore original window.location.href
    Object.defineProperty(window, 'location', {
      value: {
        href: originalHref
      },
      writable: true
    });
  });

  it("should dispose of the reaction and event listener", () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    store.matchRoutes(routes, NotFoundComponent);
    const disposeReaction = store.disposeReaction!;
    const disposeReactionSpy = vi.fn(disposeReaction);
    // @ts-ignore
    store.disposeReaction = vi.fn(() => disposeReactionSpy());

    store.dispose();

    expect(removeListenerSpy).toHaveBeenCalledWith("popstate", store.handlePopState);
    expect(disposeReactionSpy).toHaveBeenCalled();
  });

  describe("with nested routes", () => {
    const TeamComponent = { type: "div", props: { children: "Team" } } as ReactElement;
    const nestedRoutes: Route[] = [
      {
        path: "/",
        component: HomeComponent,
        children: [
          {
            path: "about",
            component: AboutComponent,
            children: [
              {
                path: "/team",
                component: TeamComponent,
              },
            ],
          },
        ],
      },
    ];

    it("should match a nested route", () => {
      store.matchRoutes(nestedRoutes, NotFoundComponent);
      store.navigate("/about/team");
      expect(store.activeComponent).toStrictEqual(TeamComponent);
    });

    it("should match a first-level route with children", () => {
      store.matchRoutes(nestedRoutes, NotFoundComponent);
      store.navigate("/about");
      expect(store.activeComponent).toStrictEqual(AboutComponent);
    });

    it("should set the active component to the NotFoundComponent for an unknown nested route", () => {
      store.matchRoutes(nestedRoutes, NotFoundComponent);
      store.navigate("/about/unknown");
      expect(store.activeComponent).toStrictEqual(NotFoundComponent);
    });
  });
});
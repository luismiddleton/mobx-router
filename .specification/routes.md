# Recursive Routing Context Specification

This document outlines the context specification for implementing recursive routing using the `Route` interface from `Store.types.ts`.

## Route Interface

```typescript
interface Route {
    path: string;
    component: React.ComponentType<any>;
    children?: Route[];
    exact?: boolean;
    // ...other properties
}
```

## Recursive Routing Context

- **Purpose:**  
    Enable nested routing structures where each route can contain child routes, allowing for deep navigation hierarchies.

- **Structure:**  
    - Each `Route` may have a `children` property, which is an array of `Route` objects.
    - Routing logic should traverse the route tree recursively to match paths and render components.

- **Example Route Tree:**

```typescript
const routes: Route[] = [
    {
        path: '/',
        component: HomePage,
        exact: true,
        children: [
            {
                path: '/about',
                component: AboutPage,
                children: [
                    {
                        path: 'team',
                        component: TeamPage
                    }
                ]
            },
            {
                path: '/contact',
                component: ContactPage
            }
        ]
    }
];
```

- **Routing Algorithm:**
    - Start at the root route.
    - For each route, check if the current path matches.
    - If matched and `children` exist, recursively check child routes.
    - Render the matched component.

## Considerations

- Ensure unique paths for each route.
- Support for dynamic segments and route parameters.
- A path can support dynamic parameters, e.g. `/:user`
- Only await the `loader` if the route path deeply equals the pathname.
- Handle fallback or 404 routes at any nesting level.

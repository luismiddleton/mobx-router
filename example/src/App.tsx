import { observer } from "mobx-react";
import { Route } from "@luism/mobx-router";
import { createElement, useEffect } from "react";
import { store } from "./store";
import UserPage from "./UserPage";

const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;
const NotFound = () => <div>404 Not Found</div>;
const TeamComponent = () => <div>About Team Page</div>;

const routes: Route[] = [
  { path: "/", component: <Home /> },
  {
    path: "/about",
    component: <About />,
    children: [
      {
        path: "team",
        component: <TeamComponent />,
        children: [
          {
            path: "member",
            loader: async () => {
              // Simulate a network request
              return new Promise((resolve) => setTimeout(resolve, 1000));
            },
            loadingComponent: <div>Loading Team Member...</div>,
            component: <div>Team Member Page</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/user",
    component: <div>User Base Page</div>,
    children: [
      {
        path: "/:user",
        loader: async (param) => {

          console.log("Loading user:", param?.user);
          // Simulate a network request
          return new Promise((resolve) => setTimeout(resolve, 1000));
        },
        loadingComponent: <div>Loading User...</div>,
        component: <UserPage />,
      },
    ],
  },
];

const App = observer(() => {
  useEffect(() => {
    store.matchRoutes(routes, <NotFound />);
    return () => {
      store.dispose();
    };
  }, []);

  const ActiveComponent = store.activeComponent
    ? createElement(store.activeComponent.type, store.activeComponent.props)
    : null;

  return (
    <div>
      <nav>
        <button disabled={store.isLoading} onClick={() => store.navigate("/")}>
          Home
        </button>
        <button
          disabled={store.isLoading}
          onClick={() => store.navigate("/about")}
        >
          About
        </button>
        <button
          disabled={store.isLoading}
          onClick={() => store.navigate("/about/team")}
        >
          About Team
        </button>
        <button
          disabled={store.isLoading}
          onClick={() => store.navigate("/about/team/member")}
        >
          About Team Member
        </button>
        <button
          disabled={store.isLoading}
          onClick={() => store.navigate("/user/123")}
        >
          User 123
        </button>
        <button
          disabled={store.isLoading}
          onClick={() => store.navigate("/unknown")}
        >
          Unknown
        </button>
      </nav>
      <div style={{ marginTop: 20 }}>{ActiveComponent}</div>
    </div>
  );
});

export default App;

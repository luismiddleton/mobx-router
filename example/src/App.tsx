import { observer } from "mobx-react";
import { Route } from "@luism/mobx-router";
import { createElement, useEffect } from "react";
import { store } from "./store";

const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;
const NotFound = () => <div>404 Not Found</div>;

const routes: Route[] = [
  { path: "/", component: <Home /> },
  {
    path: "/about",
    component: <About />,
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

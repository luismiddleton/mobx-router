import type { ReactElement } from "react";

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


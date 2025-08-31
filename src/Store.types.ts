import type { ReactElement } from "react";

export type Route = {
  path: string;
  component: ReactElement;
  loadingComponent?: ReactElement;
};


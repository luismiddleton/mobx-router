import React from "react";
import { observer } from "mobx-react";
import { store } from "./store";

const UserPage: React.FC = observer(() => {

  return (
    <div>
      <h2>User Page</h2>
      <p>User ID: {store.params.user}</p>
    </div>
  );
});

export default UserPage;

import React, { Suspense } from "react";

const RemoteApp = React.lazy(() => import("remote/RemoteApp"));
const Header = React.lazy(() => import("remote/Header"));
const AuthApp = React.lazy(() => import("remote/AuthApp"));

const App = () => {
  return (
    <div>
      <h1>🏦 Bank Shell</h1>
      <Suspense fallback={<div>Loading Auth Microfrontend...</div>}>
        <AuthApp />
      </Suspense>
    </div>
  );
};

export default App;

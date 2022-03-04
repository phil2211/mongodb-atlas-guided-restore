import React from "react";
import { injectGlobal } from '@emotion/css';
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";

import LoginScreen from "./Pages/LoginScreen";
import HelloApp from "./Pages/HelloApp";
import { msalConfig } from "./lib/authConfig";

injectGlobal(`
  *, *:before, *:after {
    box-sizing: border-box;
  }
`);

const APP_ID = process.env.REACT_APP_REALMAPP;
const msalInstance = new PublicClientApplication(msalConfig);

const RequireLoggedInUser = ({ children }) => {
  // Only render children if there is a logged in user.
  const app = useRealmApp();
  return app.currentUser ? children : <LoginScreen />;
};


function App() {
  axios.defaults.baseURL = `https://eu-central-1.aws.data.mongodb-api.com/app/${APP_ID}/endpoint`;
  return (
    <RealmAppProvider appId={APP_ID}>
      <MsalProvider instance={msalInstance}>
        <RequireLoggedInUser>
          <HelloApp />
        </RequireLoggedInUser>
      </MsalProvider>
    </RealmAppProvider>      
  );
}

export default App;

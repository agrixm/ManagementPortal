import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { hydrateAuth, setAccessToken } from './features/auth/authSlice';
import { setApiAccessToken, setApiTokenUpdateHandler } from './services/api';
import { store } from './store';

store.dispatch(hydrateAuth());

let currentToken = store.getState().auth.accessToken;
setApiAccessToken(currentToken);
setApiTokenUpdateHandler((token) => {
  store.dispatch(setAccessToken(token));
});

store.subscribe(() => {
  const nextToken = store.getState().auth.accessToken;
  if (nextToken !== currentToken) {
    currentToken = nextToken;
    setApiAccessToken(nextToken);
  }
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      ) : (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )}
    </Provider>
  </StrictMode>
);

import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Loader from './component/Loader';
import Snackbar from './component/Snackbar';
import SnackbarChat from './component/SnackbarChat';
import { configStore } from './redux/store';
import reportWebVitals from './reportWebVitals';
import './index.css';

const store = configStore();

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Loader />
        <Snackbar />
        <SnackbarChat />
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

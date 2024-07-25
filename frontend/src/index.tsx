import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configStore } from './redux/store';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './Routes';
import './index.css';

const store = configStore();

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

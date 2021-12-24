import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/layout/App';
import { history } from './app/layout/base/history';
import { BrowserRouter } from './app/layout/routes/HistoryRouter';
import { store, StoreContext } from './app/stores/store';

import reportWebVitals from './reportWebVitals';

import 'semantic-ui-css/semantic.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <BrowserRouter history={history}>
            <App />
        </BrowserRouter>
    </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

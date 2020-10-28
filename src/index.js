import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import * as serviceWorker from './serviceWorker';

import '@atlaskit/css-reset';

import App from './components/App';

const AppContainer = styled.div`
  background-color: #ffffff;
`;

ReactDOM.render(
  <React.StrictMode>
    <AppContainer>
      <App />
    </AppContainer>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

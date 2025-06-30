import React from 'react';
import ReactDOM from 'react-dom/client';
import './checkList/checkListStyle.css';

// return showing MindfulReadingApp after ending of tic_tac_toe tutorial
//import { MindfulReadingApp } from './mindfulReadingProj/MindfulReadingApp';

import { AllProjectsRouter } from './checkList/AllProjectsRouter';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AllProjectsRouter />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

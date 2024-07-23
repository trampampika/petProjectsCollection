import React from 'react';
import './MindfulReadingStyle.css';
import {LightYellowContainer} from './LightYellowContainer';
import {textArray} from './LightYellowContainer';


export const MindfulReadingApp: React.FC = () => {
  return (
    <>
      <LightYellowContainer TextInsideYellowContainer={textArray[0]} />
      <button type="button">Привет</button>
    </>
  );
};





/*

import React from 'react';
import './styles.css'; // Подключение стилей, если они определены в отдельном файле

const LightYellowContainer = () => {
  return (
    <div className="light-yellow-container">
      <p>Ваш текст здесь</p>
    </div>
  );
};

export default LightYellowContainer;


*/
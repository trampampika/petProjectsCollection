import React from 'react';
import { NumberTreeContainer } from './NumberTreeContainer';

export const App: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#282c34',
    }}
  >
    <NumberTreeContainer value={512} divisor={2} timer={2000} />
  </div>
);

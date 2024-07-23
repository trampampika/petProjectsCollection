import React from 'react';

export interface IProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<IProps> =
  ({ text, onClick }) => (
    <button onClick={onClick}>
      {text}
    </button>
  );

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { NumberTree, IProps as INumberTreeProps } from './NumberTree';

export interface IProps {
  timer: number;
  value: INumberTreeProps['value'];
  divisor: INumberTreeProps['divisor'];
}

export const NumberTreeContainer: React.FC<IProps> = (props) => {
  const { timer, value, divisor } = props;

  const [isTimerStarted, setTimerStarted] = useState(false);
  const [isTimerExceed, setTimerExceed] = useState(false);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimerStarted(true);
  };

  useEffect(() => {
    if (isTimerStarted) {
      setTimeout(() => {
        setTimerExceed(true);
      }, timer);
    }
  }, [timer, isTimerStarted]);

  return (
    <div>
      <NumberTree value={value} divisor={divisor} isDivided={isTimerExceed} />
      <Button text="Разверачивать все" onClick={handleButtonClick} />
    </div>
  );
};

import { Number } from './Number';
import { isDividableWithoutRemainder } from './isDividableWithoutRemainder';

export interface IProps {
  value: number;
  divisor: number;
  isDivided: boolean;
};

export const NumberTree: React.FC<IProps> = (props) => {
  const { value, divisor, isDivided } = props;

  const divisionResult = value / divisor;

  const content = isDivided && isDividableWithoutRemainder(value, divisor)
    ? (
      <>
        <NumberTree value={divisionResult} divisor={divisor} isDivided={isDivided} />
        <NumberTree value={divisionResult} divisor={divisor} isDivided={isDivided} />
      </>
    )
    : (
      <Number value={value} />
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {content}
    </div>
  );
};

export interface IProps {
  value: number;
};

export const Number: React.FC<IProps> = ({ value }) => (
  <div style={{
    width: 50,
    height: 50,
    display: 'inline',
    backgroundColor: 'lightgray',
    padding: 30,
    margin: 10,
    textAlign: 'center',
    fontSize: 30,
  }}>
    {value}
  </div>
);

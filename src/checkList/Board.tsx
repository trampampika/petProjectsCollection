import './Board.css';

export interface IProps{
  id: number;
  value: string;
  isEditing: boolean;
  onBlur: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, boardId: number) => void;
  onClick: (boardId: number) => void;
}

export const Board: React.FC<IProps> = (props) => {
  const { id, value, isEditing, onBlur, onChange, onClick } = props;

  return (
    <div className="board" onClick={() => onClick(id)}>
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => onChange(e, id)}
          onBlur={onBlur}
        />
      ) : (
        <div>
          {value}
        </div>
      )}
    </div>
  );
};

//// add classnames
//// read whitepaper about controlled inputs vs uncontrolled inputs
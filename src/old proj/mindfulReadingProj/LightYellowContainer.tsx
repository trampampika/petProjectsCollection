
interface LightYellowContainerProps {
  TextInsideYellowContainer: string;
}

export const LightYellowContainer: React.FC<LightYellowContainerProps> = ({ TextInsideYellowContainer }) => {
  return (
    <div className="light-yellow-container">
      <p>
        {TextInsideYellowContainer}
      </p>
    </div>
  );
}


export const textArray: string[] = [];
textArray.push("я текст адын");
textArray.push("я текст дво");
textArray.push("я текст тры");

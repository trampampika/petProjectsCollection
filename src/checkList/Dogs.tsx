import { useState } from 'react';

export const Dogs = () => {
  const [dog, setDog] = useState("");

  async function getRandomDog () {
    try{
      const data = await fetch("https://dog.ceo/api/breeds/image/random");
      const dogIMG = await data.json();

      setDog(dogIMG.message);
    }
    catch{
      console.log("catched");
    }
  };

  return (
    <>
    <button onClick = {getRandomDog}>Показать другую собаку</button>
      <img src={dog} alt="Собака"  style={{ maxHeight: '300px', maxWidth: '300px' }} />
    </>
  );
};
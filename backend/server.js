import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

const port = 3001;

app.get('/api/objects', (req, res) => {
  const { year, month } = req.query;

  // Проверяем, что year и month переданы
  if (!year || !month) {
    return res.status(400).json({ error: 'Parameters "year" and "month" are required' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse JSON data' });
    }

    // Разворачиваем вложенные массивы
    const flattenedData = jsonData.flat();

    // Фильтрация объектов по year и month
    const filteredData = flattenedData.filter(item => {
      // Предполагаем, что каждый объект имеет свойства year и month
      return item.year === year && item.month === month;
    });

    console.log('filteredData', filteredData);
    // Отправка результата
    res.json(filteredData);
  });
});




const filePath = path.resolve('/Users/tramp/OneDrive/Рабочий стол/mindfulReading/backend/calendarData.json');

app.post('/updateObject', (req, res) => {
  // Получаем объект из тела запроса
  const data = req.body;
  const dataJSON = JSON.stringify(data, null, 2);

  const year1 = data[0].year; // Извлекаем свойства
  const month1 = data[0].month;

  console.log('year month', year1, month1);

  // Читаем JSON-файл и преобразуем его в объект
  const jsonData = JSON.parse(fs.readFileSync(absolutePathToFile, 'utf8'));

  // Находим индекс объекта, который нужно заменить
  const foundIndex = jsonData.findIndex(
    (obj) => obj.year === year1 && obj.month === month1
  );

  if (foundIndex !== -1) {
    console.log('foundObject', jsonData[foundIndex]);

    // Заменяем найденный объект на новый
    jsonData[foundIndex] = data[0];

    // Сохраняем обновленный массив обратно в JSON-файл
    fs.writeFileSync(absolutePathToFile, JSON.stringify(jsonData, null, 2), 'utf8');

    // Возвращаем обновленный объект клиенту
    res.json(jsonData[foundIndex]);
  } else {
    // Если объект не найден, добавляем его в конец массива с помощью spread оператора
    const updatedJsonData = [...jsonData, data[0]];

    // Сохраняем обновленный массив обратно в JSON-файл
    fs.writeFileSync(absolutePathToFile, JSON.stringify(updatedJsonData, null, 2), 'utf8');

    // Возвращаем сообщение об успешном добавлении и новый объект
    res.status(201).json(data[0]);
  }
});





app.post('/saveCalendar', (req, res) => {
  console.log('Request received:', req.method, req.originalUrl, req.body);
  const filePath = path.resolve('/Users/tramp/OneDrive/Рабочий стол/mindfulReading/backend/calendarData.json');
  console.log('Тело запроса:', req.body);


  const data = req.body;
  const jsonData = JSON.stringify(data, null, 2);


  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  console.log('Текущая директория сервера:', process.cwd());


  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('Ошибка записи файла:', err.message);
      return res.status(500).send('Saving error.');
    }
    console.log(`Данные успешно сохранены в файл: ${filePath}`); // Исправлено
    res.status(200).send('Saved successfully.');
  });
});


const absolutePathToFile = '/Users/tramp/OneDrive/Рабочий стол/mindfulReading/backend/calendarData.json';

app.get('/setData', (req, res) => {

  fs.readFile(absolutePathToFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Ошибка чтения файла: ${err.message}`);
      return res.status(500).json({ message: 'Ошибка чтения файла' });
    }

    console.log(`Данные из файла: ${data}`);

    let parsedData;
    try {
      parsedData = JSON.parse(data);
      console.log(`Парсинг прошел успешно: ${parsedData}`);
    } catch (e) {
      console.error(`Ошибка парсинга JSON: ${e.message}`);
    //  return res.status(400).json({ message: 'Неверный формат JSON в calendarData.json' });
    }
    res.json(parsedData); // Отправляем уже распарсенный объект
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

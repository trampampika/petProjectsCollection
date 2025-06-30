const fs = require('fs/promises');
const { join } = require('path');

async function getFilesSum() {
  try {
    const filenames = await fs.readdir('C:\\Users\\tramp\\OneDrive\\Рабочий стол\\folderForNode'
);

const baseDir = 'C:\\Users\\tramp\\OneDrive\\Рабочий стол\\folderForNode';

const pathsArray = filenames.map(filename => join(baseDir, filename));

console.log(pathsArray, 'pathsArray');

const allFilesSizesBits = await Promise.all(
  pathsArray.map(async (path) => {
    const stats = await fs.stat(path);
    return stats.size;
  })
);

const totalBytes = allFilesSizesBits.reduce((sum, bytes) => sum + bytes, 0);

const allFilesSizesKB = formatFileSize(totalBytes);

    console.log(allFilesSizesBits,"allFilesSizes", allFilesSizesKB, 'allFilesSizesMgBits' );
    console.log("positive");

  } catch(err) {
    console.error(err.message);
  }
}

getFilesSum();

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
import fs from 'fs';

function lastModified(filePathWithName) {

  let stats = fs.statSync(filePathWithName);

  let statsDate = stats.mtime;

  let formattedDate = 
  statsDate.getFullYear()
  + '-' +
  ('0' + (statsDate.getMonth()+1)).slice(-2)
  + '-' +
  ('0' + statsDate.getDate()).slice(-2);

  return `${formattedDate}`;
};

export { lastModified };
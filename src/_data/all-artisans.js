import fs from 'fs';
import path from 'path';

function makeArray() {
  let allArtisansArray = [];
  
  let pathToData = './src/_data';
  
  let files = fs.readdirSync(pathToData).filter(name => path.extname(name) === ".json");
  
  for (let i = 0; i < files.length; i++) {
    let filePath = './src/_data/' + files[i];
  
    let fileName = path.parse(filePath).name;
  
    if (fileName !== "artisanTypesData") {
    
      let fileContentObject = fs.readFileSync(filePath, "utf-8");
    
      let parsedArtisanObjects = JSON.parse(fileContentObject);
  
      parsedArtisanObjects.forEach(artisan => {
        artisan.artisanType = fileName;
      });
  
      // pushing with spread each object into the final all-inclusive array of objects
      allArtisansArray.push(...parsedArtisanObjects);
    }; // end if
  }; // end for
  
  return allArtisansArray;
  
}; // end makeArray

export default makeArray;
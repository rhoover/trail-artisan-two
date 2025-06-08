import fs from 'fs';
import path from 'path';

let allArtisansArray = [];

let pathToData = './src/_data';

let files = fs.readdirSync(pathToData).filter(name => path.extname(name) === ".json");

for (let i = 0; i < files.length; i++) {
  let filePath = './src/_data/' + files[i];

  let fileName = path.parse(filePath).name;

  if (fileName !== "artisanTypesData" && fileName !== "all-artisans") {
  
    let fileContentObject = fs.readFileSync(filePath, "utf-8");
  
    let parsedArtisanObjects = JSON.parse(fileContentObject);

    parsedArtisanObjects.forEach(artisan => {
      artisan.artisanType = fileName;
    });

    // pushing with spread each object into the final all-inclusive array of objects
    allArtisansArray.push(...parsedArtisanObjects);
  };
};

fs.writeFile("./src/all-artisan-data/all-artisan-data.json", JSON.stringify(allArtisansArray, null, 2), err => {
  if (err) throw error;
  console.log("JSON Success");
});
fs.writeFile("./src/_data/all-artisans.json", JSON.stringify(allArtisansArray, null, 2), err => {
  if (err) throw error;
  console.log("JSON Success");
});
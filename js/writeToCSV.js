const json2csv = require('json2csv');
const fs = require('fs');

function writeObjectToCsvFile(obj, fileName) {

  var fields = Object.keys(obj[0]);
  var csv = json2csv({
    "data" : obj,
    "fields"  : fields
  });
  fs.writeFile(fileName, csv, function (err) {
    if(err) {
      throw err
    }
    console.log("File saved.");
  });
}


module.exports.writeObjectToCsvFile = writeObjectToCsvFile;

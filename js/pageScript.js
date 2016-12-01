const sqlMethods = require('./js/sqlMethods.js');
const fs = require('fs');

console.log("pageScript Loaded.");

$(function () {
  $("#testButton").bind("click", function () {
    console.log("test Clicked");
    sqlMethods.executeQuery("SELECT * FROM information_schema.tables;");
  });

  /*$("#updateButton").bind("click", function () {
    console.log("Update Clicked.");
    resetTables.closeConnectionPool();

  });*/

});

function populateOutputTable(data) {
  var table = $("#outputTable");
  table.empty();

  console.log(data);

}

const resetTables = require('./js/resetTables.js');

console.log("pageScript Loaded.");

$(function () {
  $("#testButton").bind("click", function () {
    console.log("test Clicked");
    resetTables.executeUpdate(resetTables.dropAllTables);
    resetTables.executeUpdate(resetTables.createAllTables);
    resetTables.executeUpdate(resetTables.getTableNames);
    populateOutputTable({
      "Test": 5,
      "bob": 4
    });
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


$(window).onbeforeunload = function () {
  resetTables.closeConnectionPool();
  alert("Closing connection.");
};

const sqlMethods = require('./js/sqlMethods.js');
const fs = require('fs');

console.log("pageScript Loaded.");

$(function () {
  bindButtons();
});

function bindButtons() {
  $("#testButton").bind("click", function () {
    console.log("test Clicked");
    sqlMethods.executeQuery("SELECT * FROM information_schema.tables;");
  });

  $("#displayItemsButton").bind("click", function () {
    console.log("displayItemsButton clicked");
    sqlMethods.displayTable("amazon_items", populateOutputTable);
  });

  $("#displayWarehousesButton").bind("click", function () {
    console.log("displayItemsButton clicked");
    sqlMethods.displayTable("amazon_warehouses", populateOutputTable);
  });

  $("#displayShippingButton").bind("click", function () {
    console.log("displayShippingButton clicked");
    sqlMethods.displayTable("amazon_warehouse_ships", populateOutputTable);
  });

  $("#displayStockButton").bind("click", function () {
    console.log("displayStockButton clicked");
    sqlMethods.displayTable("amazon_warehouse_stock", populateOutputTable);
  });

  $("#displayCustomersButton").bind("click", function () {
    console.log("displayCustomersButton clicked");
    sqlMethods.displayTable("amazon_customers", populateOutputTable);
  });

  $("#displayAddressesButton").bind("click", function () {
    console.log("displayAddressesButton clicked");
    sqlMethods.displayTable("amazon_customer_addresses", populateOutputTable);
  });

  $("#displayTransactionsButton").bind("click", function () {
    console.log("displayTransactionsButton clicked");
    sqlMethods.displayTable("amazon_transactions", populateOutputTable);
  });
}

function populateOutputTable(data) {
  //Takes a data object from MYSQL which is expected as
  //an array of of objects and populates #outputTable
  var table = $("#outputTable");
  nRows = data.length;
  if(nRows == 0) {
    console.log("Recieved data object with 0 rows.");
    data = [{
      "Unable to complete transaction"  : ""
    }];
  }
  var tableHeader = Object.keys(data[0]);

  //Dealling with the table
  var tableContents = "<thead><tr>";

  //Header
  for(i in tableHeader) {
    tableContents += "<th>" + tableHeader[i] + "</th>";
  }
  tableContents += "</tr></thead>";

  //Rows
  tableContents += "<tbody>";
  for(row in data) {
    tableContents += "<tr>";
    for(element in data[row]) {
      tableContents += "<td>" + data[row][element] + "</td>";
    }
    tableContents += "</tr>";
  }
  tableContents += "</tbody>"
  table.empty();

  table.append(tableContents);

}

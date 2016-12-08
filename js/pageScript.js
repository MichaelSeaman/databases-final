const sqlMethods = require('./js/sqlMethods.js');
const fs = require('fs');

console.log("pageScript Loaded.");

$(function () {
  bindButtons();
});

function bindButtons() {
  $("#testButton").bind("click", function () {
    console.log("test Clicked");
    sqlMethods.selectStar("information_schema.tables", populateOutputTable);
    updateTaskLabel("Test");
  });

  $("#displayItemsButton").bind("click", function () {
    console.log("displayItemsButton clicked");
    sqlMethods.displayTable("amazon_items", populateOutputTable);
    updateTaskLabel("Items");
  });

  $("#displayWarehousesButton").bind("click", function () {
    console.log("displayItemsButton clicked");
    sqlMethods.displayTable("amazon_warehouses", populateOutputTable);
    updateTaskLabel("Warehouses");
  });

  $("#displayShippingButton").bind("click", function () {
    console.log("displayShippingButton clicked");
    sqlMethods.displayTable("amazon_warehouse_ships", populateOutputTable);
    updateTaskLabel("Warehouse Shipping");
  });

  $("#displayStockButton").bind("click", function () {
    console.log("displayStockButton clicked");
    sqlMethods.displayTable("amazon_warehouse_stock", populateOutputTable);
    updateTaskLabel("Stock");
  });

  $("#displayCustomersButton").bind("click", function () {
    console.log("displayCustomersButton clicked");
    sqlMethods.displayTable("amazon_customers", populateOutputTable);
    updateTaskLabel("Customers");
  });

  $("#displayAddressesButton").bind("click", function () {
    console.log("displayAddressesButton clicked");
    sqlMethods.displayTable("amazon_customer_addresses", populateOutputTable);
    updateTaskLabel("Customers' Addresses");
  });

  $("#displayTransactionsButton").bind("click", function () {
    console.log("displayTransactionsButton clicked");
    sqlMethods.displayTable("amazon_transactions", populateOutputTable);
    updateTaskLabel("Transactions");
  });

  $("#searchItemsIDSubmit").bind("click", function () {
    console.log("searchItemsIDSubmit clicked");
    var input = $("#searchItemsIDInput").val();
    console.log(`searchItemsIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_items", "item_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Items");
  });

  $("#searchItemsIDSubmit").bind("click", function () {
    console.log("searchItemsIDSubmit clicked");
    var input = $("#searchItemsIDInput").val();
    console.log(`searchItemsIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_items", "item_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Items");
  });

  $("#searchItemsNameSubmit").bind("click", function () {
    console.log("searchItemsNameSubmit clicked");
    var input = $("#searchItemsNameInput").val();
    console.log(`searchItemsNameInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_items", "name", input, populateOutputTable);
    updateTaskLabel("Searching Items");
  });

  $("#searchItemsPriceSubmit").bind("click", function () {
    console.log("searchItemsPriceSubmit clicked");
    var input = $("#searchItemsPriceInput").val();
    console.log(`searchItemsPriceInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_items", "price", parseFloat(input), populateOutputTable);
    updateTaskLabel("Searching Items");
  });

  $("#searchWarehousesIDSubmit").bind("click", function () {
    console.log("searchWarehousesIDSubmit clicked");
    var input = $("#searchWarehousesIDInput").val();
    console.log(`searchWarehousesIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouses", "warehouse_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Warehouses");
  });

  $("#searchWarehousesNameSubmit").bind("click", function () {
    console.log("searchWarehousesNameSubmit clicked");
    var input = $("#searchWarehousesNameInput").val();
    console.log(`searchWarehousesNameInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouses", "name", input, populateOutputTable);
    updateTaskLabel("Searching Warehouses");
  });

  $("#searchWarehousesAddressSubmit").bind("click", function () {
    console.log("searchWarehousesAddressSubmit clicked");
    var input = $("#searchWarehousesAddressInput").val();
    console.log(`searchWarehousesAddressInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouses", "addr", input, populateOutputTable);
    updateTaskLabel("Searching Warehouses");
  });

  $("#searchWarehousesCitySubmit").bind("click", function () {
    console.log("searchWarehousesCitySubmit clicked");
    var input = $("#searchWarehousesCityInput").val();
    console.log(`searchWarehousesCityInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouses", "city", input, populateOutputTable);
    updateTaskLabel("Searching Warehouses");
  });
  $("#searchWarehousesStateSubmit").bind("click", function () {
    console.log("searchWarehousesStateSubmit clicked");
    var input = $("#searchWarehousesStateInput").val();
    console.log(`searchWarehousesStateInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouses", "state", input, populateOutputTable);
    updateTaskLabel("Searching Warehouses");
  });


  $("#searchShippingIDSubmit").bind("click", function () {
    console.log("searchShippingIDSubmit clicked");
    var input = $("#searchShippingIDInput").val();
    console.log(`searchShippingIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_ships", "ship_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Shipping");
  });


  $("#searchShippingWarehouseIDSubmit").bind("click", function () {
    console.log("searchShippingWarehouseIDSubmit clicked");
    var input = $("#searchShippingWarehouseIDInput").val();
    console.log(`searchShippingWarehouseIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_ships", "warehouse_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Shipping");
  });


  $("#searchShippingStateSubmit").bind("click", function () {
    console.log("searchShippingStateSubmit clicked");
    var input = $("#searchShippingStateInput").val();
    console.log(`searchShippingStateInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_ships", "state", input, populateOutputTable);
    updateTaskLabel("Searching Shipping");
  });


  $("#searchStockIDSubmit").bind("click", function () {
    console.log("searchStockIDSubmit clicked");
    var input = $("#searchStockIDInput").val();
    console.log(`searchStockIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_stock", "stock_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Stock");
  });


  $("#searchStockWarehouseIDSubmit").bind("click", function () {
    console.log("searchStockWarehouseIDSubmit clicked");
    var input = $("#searchStockWarehouseIDInput").val();
    console.log(`searchStockWarehouseIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_stock", "warehouse_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Stock");
  });


  $("#searchStockItemIDSubmit").bind("click", function () {
    console.log("searchStockItemIDSubmit clicked");
    var input = $("#searchStockItemIDInput").val();
    console.log(`searchStockItemIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_stock", "item_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Stock");
  });
  $("#searchStockQuantitySubmit").bind("click", function () {
    console.log("searchStockQuantitySubmit clicked");
    var input = $("#searchStockQuantityInput").val();
    console.log(`searchStockQuantityInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_warehouse_stock", "quantity", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Stock");
  });


  $("#searchCustomersIDSubmit").bind("click", function () {
    console.log("searchCustomersIDSubmit clicked");
    var input = $("#searchCustomersIDInput").val();
    console.log(`searchCustomersIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customers", "customer_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Customers");
  });


  $("#searchCustomersFirstNameSubmit").bind("click", function () {
    console.log("searchCustomersFirstNameSubmit clicked");
    var input = $("#searchCustomersFirstNameInput").val();
    console.log(`searchCustomersFirstNameInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customers", "first_name", input, populateOutputTable);
    updateTaskLabel("Searching Customers");
  });


  $("#searchCustomersLastNameSubmit").bind("click", function () {
    console.log("searchCustomersLastNameSubmit clicked");
    var input = $("#searchCustomersLastNameInput").val();
    console.log(`searchCustomersLastNameInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customers", "last_name", input, populateOutputTable);
    updateTaskLabel("Searching Customers");
  });


  $("#searchCustomersEmailSubmit").bind("click", function () {
    console.log("searchCustomersEmailSubmit clicked");
    var input = $("#searchCustomersEmailInput").val();
    console.log(`searchCustomersEmailInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customers", "email", input, populateOutputTable);
    updateTaskLabel("Searching Customers");
  });


  $("#searchCustomersUsernameSubmit").bind("click", function () {
    console.log("searchCustomersUsernameSubmit clicked");
    var input = $("#searchCustomersUsernameInput").val();
    console.log(`searchCustomersUsernameInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customers", "username", input, populateOutputTable);
    updateTaskLabel("Searching Customers");
  });


  $("#searchCustomersPasswordSubmit").bind("click", function () {
    console.log("searchCustomersPasswordSubmit clicked");
    var input = $("#searchCustomersPasswordInput").val();
    console.log(`searchCustomersPasswordInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customers", "password", input, populateOutputTable);
    updateTaskLabel("Searching Customers");
  });


  $("#searchAddressesIDSubmit").bind("click", function () {
    console.log("searchAddressesIDSubmit clicked");
    var input = $("#searchAddressesIDInput").val();
    console.log(`searchAddressesIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customer_addresses", "customer_address_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Customer Addresses");
  });


  $("#searchAddressesCustomerIDSubmit").bind("click", function () {
    console.log("searchAddressesCustomerIDSubmit clicked");
    var input = $("#searchAddressesCustomerIDInput").val();
    console.log(`searchAddressesCustomerIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customer_addresses", "customer_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Customer Addresses");
  });


  $("#searchAddressesAddressSubmit").bind("click", function () {
    console.log("searchAddressesAddressSubmit clicked");
    var input = $("#searchAddressesAddressInput").val();
    console.log(`searchAddressesAddressInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customer_addresses", "addr", input, populateOutputTable);
    updateTaskLabel("Searching Customer Addresses");
  });


  $("#searchAddressesCitySubmit").bind("click", function () {
    console.log("searchAddressesCitySubmit clicked");
    var input = $("#searchAddressesCityInput").val();
    console.log(`searchAddressesCityInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customer_addresses", "city", input, populateOutputTable);
    updateTaskLabel("Searching v");
  });


  $("#searchAddressesStateSubmit").bind("click", function () {
    console.log("searchAddressesStateSubmit clicked");
    var input = $("#searchAddressesStateInput").val();
    console.log(`searchAddressesStateInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_customer_addresses", "state", input, populateOutputTable);
    updateTaskLabel("Searching Customer Addresses");
  });


  $("#searchTransactionIDSubmit").bind("click", function () {
    console.log("searchTransactionIDSubmit clicked");
    var input = $("#searchTransactionIDInput").val();
    console.log(`searchTransactionIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_transactions", "transaction_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Transactions");
  });


  $("#searchTransactionCustomerIDSubmit").bind("click", function () {
    console.log("searchTransactionCustomerIDSubmit clicked");
    var input = $("#searchTransactionCustomerIDInput").val();
    console.log(`searchTransactionCustomerIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_transactions", "customer_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Transactions");
  });


  $("#searchTransactionItemIDSubmit").bind("click", function () {
    console.log("searchTransactionItemIDSubmit clicked");
    var input = $("#searchTransactionItemIDInput").val();
    console.log(`searchTransactionItemIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_transactions", "item_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Transactions");
  });


  $("#searchTransactionWarehouseIDSubmit").bind("click", function () {
    console.log("searchTransactionWarehouseIDSubmit clicked");
    var input = $("#searchTransactionWarehouseIDInput").val();
    console.log(`searchTransactionWarehouseIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_transactions", "warehouse_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Transactions");
  });


  $("#searchTransactionAddressIDSubmit").bind("click", function () {
    console.log("searchTransactionAddressIDSubmit clicked");
    var input = $("#searchTransactionAddressIDInput").val();
    console.log(`searchTransactionAddressIDInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_transactions", "customer_address_id", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Transactions");
  });
  $("#searchTransactionQuantitySubmit").bind("click", function () {
    console.log("searchTransactionQuantitySubmit clicked");
    var input = $("#searchTransactionQuantityInput").val();
    console.log(`searchTransactionQuantityInput: ${input}`);
    sqlMethods.searchTableByColumn("amazon_transactions", "quantity", parseInt(input), populateOutputTable);
    updateTaskLabel("Searching Transactions");
  });


}

function updateTaskLabel(str) {
  //Takes a string object and puts it in the h2 tag
  //At the top of the page
  var label = $("#taskLabel");
  label.text(str);
}


function populateOutputTable(data, err) {
  //Takes a data object from MYSQL which is expected as
  //an array of of objects and populates #outputTable

  var table = $("#outputTable");
  nRows = data.length;

  if(err) {
    if(err.code == "ER_USER_LIMIT_REACHED") {
      data = [
        {"Error" : "Max user limit reached."},
        {"Error" : "Try waiting a few minutes and restarting."}];
    }
    else if (err.code === "ER_BAD_FIELD_ERROR") {
      data = [{
        "Error" : "One or more of the fields provided was entered incorrectly."
      }]
    }
    else {
      data = [{
        "Error" : "Unable to query Database."
      }];
    }
  }
  else if(nRows == 0) {
    console.log("Recieved data object with 0 rows.");
    data = [{
      "Uh-oh" : "Your query returned no records."
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

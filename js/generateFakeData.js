const faker = require('faker');
const sqlMethods2 = require('./js/sqlMethods.js');
var sqlTableData2 = JSON.parse(fs.readFileSync('tableData.json', 'utf-8')).tables;


function generateRecords(n) {
  //Generates and inputs:
  //100n new Customers
  //100n new Items
  //n new Warehouses
  //200n new Addresses
  //~50n^2 new Stocks
  //10n new Shippings
  //and 1000n new Transactions

  var newData = {
    "customers" : [],
    "items" : [],
    "warehouses" : [],
    "addresses" : [],
    "stocks" : [],
    "ships" : [],
    "transactions" : []
  };

  generateRecordsPhase1(newData, n);
}

function checkIfColumnsAreDoneInserting(data, colIndexes) {
  //Returns true if data[colIndexes].doneInserting = true for
  //all entries
  //colIndexes is an array of ints
  for (var i = 0; i < colIndexes.length; i++) {
    var column = data[Object.keys(data)[colIndexes[i]]];
    if(!column.doneInserting) {
      return false
    }
  }
  return true;
}


function generateRecordsPhase1(newData, n) {
  //Handles the creation and inserting of customer, item,
  //and warehouse rows
  newData.customers = generateCustomers(100 * n);
  newData.items = generateItems(100 * n);
  newData.warehouses = generateWarehouses(n);
  insertRowsAndSaveIds(newData.customers, 0, function () {
    if(checkIfColumnsAreDoneInserting(newData, [0,1,2])) {
      generateRecordsPhase2(newData, n)
    }
  });
  insertRowsAndSaveIds(newData.items, 1, function () {
    if(checkIfColumnsAreDoneInserting(newData, [0,1,2])) {
      generateRecordsPhase2(newData, n)
    }
  });
  insertRowsAndSaveIds(newData.warehouses, 2, function () {
    if(checkIfColumnsAreDoneInserting(newData, [0,1,2])) {
      generateRecordsPhase2(newData, n)
    }
  });
}

function generateRecordsPhase2(newData, n) {
  //Handles the creation and inserting of customer addresses
  newData.addresses = generateAddresses(200 * n, newData.customers);
  insertRowsAndSaveIds(newData.addresses, 3, function () {
    generateRecordsPhase3(newData, n);
  })
}

function generateRecordsPhase3(newData, n) {
  //handles the creation and inserts of stocks, ships, and transactions
  newData.stocks = generateStocks(newData.warehouses, newData.items);
  newData.ships = generateShips(10, newData.warehouses);
  newData.transactions = generateTransactions(1000 * n, newData.customers, newData.items, newData.warehouses, newData.addresses);
  insertRowsAndSaveIds(newData.stocks, 4, function () {});
  insertRowsAndSaveIds(newData.ships, 5, function () {});
  insertRowsAndSaveIds(newData.transactions, 6, function () {
    console.log("Done.");
  });
}

function generateCustomers(n) {
  //outputs a list of n customer objects
  var customers = [];
  for (var i = 0; i < n; i++) {
    var card = faker.helpers.contextualCard();
    var firstName = card.name;
    var lastName = faker.name.lastName();
    var email = card.email;
    var username = card.username;
    var password = faker.internet.password();
    customers.push({
      "firstName" : firstName,
      "lastName" : lastName,
      "email" : email,
      "username" : username,
      "password" : password
    });
  }
  return customers;
}

function generateItems(n) {
  //outputs a list of n item objects
  var items = [];
  for (var i = 0; i < n; i++) {
    var name = faker.commerce.productName();
    var desc = faker.company.catchPhrase();
    var price = faker.commerce.price() / 10;
    items.push({
      "name"  : name,
      "description" : desc,
      "price" : price
    });
  }
  return items;
}

function generateWarehouses(n) {
  //outputs a list of n warehouse objects
  var warehouses = [];
  for (var i = 0; i < n; i++) {
    var name = faker.company.companyName() + " " + faker.commerce.department();
    var address = faker.address.streetAddress();
    var city = faker.address.city();
    var state = faker.address.stateAbbr();
    warehouses.push({
      "name"  : name,
      "address" : address,
      "city"  : city,
      "state" : state
    });
  }
  return warehouses;
}

function generateAddresses(n, customerData) {
  //takes the number of addresses n to be generated, and the list
  //of customer objects customerData
  //outputs a list of addresses
  var addresses = [];
  for(var i = 0; i < n; i++) {
    var customerId = customerData[Math.floor(Math.random() * customerData.length)].insertId;
    var address = faker.address.streetAddress();
    var city = faker.address.city();
    var state = faker.address.stateAbbr();
    addresses.push({
      "customer_id" : customerId,
      "address" : address,
      "city"  : city,
      "state" : state
    });
  }
  return addresses
}

function generateStocks(warehouseData, itemData) {
  //For every warehouse and item, creates a quantity
  var stocks = [];
  for (warehouse of warehouseData) {
    for (item of itemData) {
      var warehouseId = warehouse.insertId;
      var itemId = item.insertId;
      var quantity = Math.floor(faker.random.number() / 100) * 100;
      stocks.push({
        "warehouse_id" : warehouseId,
        "item_id"  : itemId,
        "quantity"  : quantity
      });
    }
  }
  return stocks;
}

function generateShips(n, warehouseData) {
  //Generates n shipping states for each warehouse
  //in warehouseData
  var ships = [];
  for(warehouse of warehouseData) {
    for(var i = 0; i < n; i++) {
      var warehouseId = warehouse.insertId;
      var state = faker.address.stateAbbr();
      ships.push({
        "warehouse_id" : warehouseId,
        "state" : state
      });
    }
  }
  return ships;
}

function generateTransactions(n, customerData, itemData, warehouseData, addressData) {
  //generates n new transactions picking random items, warehouses, and addresses
  var transactions = [];
  for(var i = 0; i < n; i++) {
    var addressChoice = addressData[Math.floor(Math.random() * addressData.length)];
    var customerId = addressChoice.customer_id;
    var itemId = itemData[Math.floor(Math.random() * itemData.length)].insertId;
    var quantity = Math.ceil(Math.random() * 10);
    var warehouseId = warehouseData[Math.floor(Math.random() * warehouseData.length)].insertId;
    var addressId = addressChoice.insertId;
    transactions.push({
      "customer_id" : customerId,
      "item_id" : itemId,
      "quantity"  : quantity,
      "warehouse_id"  : warehouseId,
      "address_id"  : addressId
    });
  }
  return transactions;
}

function insertRowsAndSaveIds(rowList, tableIndex, onComplete) {
  //Takes a list of objects rowList assumed to be the column values of an
  //insert, and inserts them into the table identified by its index in tableData.json
  //Saves the ids in row list as they are inserted

  var tableName = sqlTableData2[tableIndex].sql_table_name;
  var validInsertColumns = sqlTableData2[tableIndex].sql_cols.filter(function (column) {
    //Only returns columns that aren't autoincrement
    return !(column.auto);
  });
  var validInsertColumnNames = validInsertColumns.map(function (column) {
    return column.col_name;
  });
  for (var i = 0; i < rowList.length; i++) {
    var values = Object.keys(rowList[i]).map(function (key) {
      return rowList[i][key];
    });
    sqlMethods2.insertValuesToTable(values, validInsertColumnNames, tableName, [rowList, rowList[i], onComplete], saveInsertID);
  }

}

function saveInsertID(data, refereceToObjectAndRow) {
  //Takes an OkPacket 'data' and a list with 2 elements 'refereceToObjectAndRow'
  //Where the first element is the newData Rowlist, and the second is a refrence
  //to the object created. Creates an attribute insertId in the rowReference
  //When the entire object refrence has been filled, sends a message
  var refrenceToDataObject = refereceToObjectAndRow[0];
  var refereceToRow = refereceToObjectAndRow[1];
  var onComplete = refereceToObjectAndRow[2];
  refereceToRow.insertId = data.insertId;
  var allDone = refrenceToDataObject.every(function (row) {
    return row.insertId ? true : false;
  });
  if(allDone) {
    refrenceToDataObject.doneInserting = true;
    onComplete();
  }
}

generateRecords(1);

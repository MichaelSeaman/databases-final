const mysql = require('mysql');

/*var pool = mysql.createPool({
  host  : 'us-cdbr-azure-west-b.cleardb.com',
  user  : 'be234364e375d8',
  password  : 'e60754d2',
  database  : 'acsm_676dbbe84ea3d8c',
  debug : false,
  multipleStatements : true,
  queneLimit  : 200
});*/
var pool = mysql.createPool({
  host  : 'us-cdbr-azure-west-b.cleardb.com',
  user  : 'be234364e375d8',
  password  : 'e60754d2',
  database  : 'acsm_676dbbe84ea3d8c',
  debug : false,
  multipleStatements : true,
  queneLimit  : 200,
  connectionLimit : 2
});

function endPool() {
  pool.end();
}

function executeQuery(queryString, callback) {
  outStream = callback || console.log;
  var output = {};

  pool.getConnection(function (err, connection) {
    if(err) {
      outStream(output, err);
      throw err;
    }
    console.log(queryString + " has connected with ID: " + connection.threadId);

    connection.query(queryString, function (err, rows) {
      connection.release();
      if(err) {
        outStream(output, err);
        throw err;
      }
      output = rows;
      outStream(output);
    });

  });

}

function insertValuesToTable(values, colNames, tableName, callback) {
  //Inserts values into the columns of the table provided, and
  //sends the data to the callback
  var updateString = "INSERT INTO ??(??";
  for (var i = 0; i < colNames.length - 1; i++) {
    updateString += ", ??";
  }
  updateString += ") VALUES (?";
  for (var i = 0; i < values.length - 1; i++) {
    updateString += ", ?";
  }
  updateString += ");";

  updateString = mysql.format(updateString, tableName);
  updateString = mysql.format(updateString, colNames);
  updateString = mysql.format(updateString, values);

  executeQuery(updateString, callback);

}

function updateRowWithID(id, idColName, values, colNames, tableName, callback) {
  //Updates the row in tableName where the id in
  //idColName = id and sets colNames to values, sending the result to callback
  //expects values and colNames as an array object

  var updateString = "UPDATE ?? SET ??=?";
  for (var i = 0; i < colNames.length - 1; i++) {
    updateString += ", ??=?";
  }
  updateString += " WHERE ??=?;"

  updateString = mysql.format(updateString, tableName);
  for (var i = 0; i < colNames.length; i++) {
    updateString = mysql.format(updateString, [colNames[i], values[i]] );
  }
  updateString = mysql.format(updateString, [idColName, id]);

  executeQuery(updateString, callback);
}

function selectStar(tableName, callback) {
  var queryString = "SELECT * FROM ??;";
  var inserts = [tableName];
  queryString = mysql.format(queryString, inserts);
  executeQuery(queryString, callback);
}

function displayTable(tableName, callback) {
  var queryString = "SELECT * FROM ?? WHERE deleted = 'false';";
  var inserts = [tableName];
  queryString = mysql.format(queryString, inserts);
  executeQuery(queryString, callback);
}

function searchTableByColumn(tableName, columnName, value, callback) {
  var queryString = "SELECT * FROM ?? WHERE ?? = ? AND deleted = 'false';";
  var inserts = [tableName, columnName, value];
  queryString = mysql.format(queryString, inserts);
  executeQuery(queryString, callback);
}

module.exports.insertValuesToTable = insertValuesToTable;
module.exports.searchTableByColumn = searchTableByColumn;
module.exports.updateRowWithID = updateRowWithID;
module.exports.selectStar = selectStar;
module.exports.displayTable = displayTable;
module.exports.executeQuery = executeQuery;
module.exports.endPool = endPool;

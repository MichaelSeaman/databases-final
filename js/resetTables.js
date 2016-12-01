const mysql = require('mysql');
const fs = require('fs');

console.log("Reset Tables has been loaded.");

global.pool = mysql.createPool({
  connectionLimit : 4,
  host  : 'us-cdbr-azure-west-b.cleardb.com',
  user  : 'be234364e375d8',
  password  : 'e60754d2',
  database  : 'acsm_676dbbe84ea3d8c',
  debug : false,
  multipleStatements : true
});

function executeUpdate(updates) {
  pool.getConnection(function (err, connection) {
    if(err) {
      console.log("Error in database connection attempt.");
      console.error(err);
      return;
    }

    console.log(`Connected as ID: ${connection.threadId}`);
    updates(connection);
    connection.on('error', function(err) {
      console.log("Error during database connection.");
    });
  });
}

function createAllTables(connection) {
  console.log("Creating Tables");
  fs.readFile("sql/createTables.sql", "utf-8", function(err, statements) {
    if(!err) {
      connection.query(statements, function (err, results) {
        console.log(results);
      });
    }
    else {
      console.error('Error reading file.');
      console.error(err);
    }
    connection.release();
  });
}

function getSchema(connection) {
  var schemaQuery = 'SELECT * FROM information_schema.tables;';
  connection.query(schemaQuery, function (err, results) {
    console.log(results);
    connection.release();
  });
}

function getTableNames(connection) {
  console.log("Getting table names");
  var schemaQuery = 'SELECT * FROM information_schema.tables;';
  connection.query(schemaQuery, function (err, results) {
    var tableList = [];
    for (var i = 0; i < results.length; i++) {
      tableList.push(results[i]['TABLE_NAME']);
    }
    console.log(tableList);
    connection.release();
  });
}

function dropAllTables(connection) {
  console.log("Dropping All Tables");
  fs.readFile("sql/dropTables.sql", "utf-8", function(err, statements) {
    if(!err) {
      connection.query(statements, function (err, results) {
        console.log(results);
      });
    }
    else {
      console.error('Error reading file.');
      console.error(err);
    }
    connection.release();
  });
}

function closeConnectionPool() {
  pool.end(function (err) {
    console.error("Error closing connection pool");
    console.error(err);
  })
}

module.exports.getTableNames = getTableNames;
module.exports.executeUpdate = executeUpdate;
module.exports.createAllTables = createAllTables;
module.exports.dropAllTables = dropAllTables;
module.exports.closeConnectionPool = closeConnectionPool;

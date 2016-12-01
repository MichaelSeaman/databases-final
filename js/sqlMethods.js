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

function executeUpdate(updateString, callback) {
  outStream = callback || console.log;
  var affectedRows = -1;

  pool.getConnection(function (err, connection) {
    if(err) throw err;
    console.log(updateString + " has connected with ID: " + connection.threadId);

    connection.query(updateString, function (err, result) {
      connection.release();
      if(err) throw err;
      affectedRows = result.affectedRows;
      outStream(affectedRows);
    });
  })
}

function executeQuery(queryString, callback) {
  outStream = callback || console.log;
  var output = {};

  pool.getConnection(function (err, connection) {
    if(err) throw err;
    console.log(queryString + " has connected with ID: " + connection.threadId);

    connection.query(queryString, function (err, rows, fields) {
      connection.release();
      if(err) throw err;
      output = rows;
      rows.fields = fields;
      outStream(output);
    });

  });

}

/*
function executeQuery(query, callback) {
  output = {};

  connection.connect();
  connection.on("err", function (err) {
    console.error("Error occured while opening connection.");
    console.error();
    return output;
  });
  console.log(query.toString() + " has connected with ID: " + connection.threadId);

  var queryObject = connection.query(query);
  queryObject.on("err", function (err) {
    console.error("Error in update");
    console.error(err);
    return output;
  });

  queryObject.on("rows", function (rows) {
    output.rows = rows;
    console.log("Rows recieved: " + rows);
  });

  queryObject.on("fields", function (fields) {
    output.fields = fields;
    console.log("Fields recieved: " + fields);

  });

  connection.end(function (err) {
    if(err) {
      console.error("Error occured while closing connection.");
      console.error(err);
    }
  });

  return output;
}



*/

//executeUpdate("INSERT INTO region VALUES(51316, 'Bob')");
//executeQuery("SELECT * FROM information_schema.tables;");

module.exports.executeUpdate = executeUpdate;
module.exports.executeQuery = executeQuery;
module.exports.endPool = endPool;

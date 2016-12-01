const mysql = require('mysql');
const fs = require('fs');

var pool = mysql.createPool({
  connectionLimit : 4,
  host  : 'us-cdbr-azure-west-b.cleardb.com',
  user  : 'be234364e375d8',
  password  : 'e60754d2',
  database  : 'acsm_676dbbe84ea3d8c',
  debug : false,
  multipleStatements : true
});

function executeUpdate(updateString, callback) {
  outStream = callback || console.log;
  var affectedRows = -1;

  pool.getConnection(function (err, connection) {
    if(err) throw err;
    console.log(updateString + " has connected with ID: " + connection.threadId);

    connection.query(updateString, function (err, result) {
      if(err) throw err;
      affectedRows = result.affectedRows;
      outStream(affectedRows);
      connection.release();
    });
  })
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
module.exports.poolEnd = pool.end;

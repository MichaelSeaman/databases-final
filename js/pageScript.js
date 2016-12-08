const sqlMethods = require('./js/sqlMethods.js');
const fs = require('fs');
var sqlTableData = JSON.parse(fs.readFileSync('tableData.json', 'utf-8')).tables;
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

  bindSearchButtons();
  bindDisplayButtons();

}

function bindDisplayButtons() {
  /*Uses the following attributes from sqlTableData:
  {"identifier":  "Items",
  "label":  "Items",
  "tableName":  "amazon_items"}
  */

  sqlTableData.forEach(function (tableData) {
    var buttonID = `#display${tableData.identifier}Button`;
    var label = tableData.label
    var tableName = tableData.sql_table_name
    $(buttonID).bind("click", function () {
      console.log(buttonID + " clicked");
      sqlMethods.displayTable(tableName, populateOutputTable);
      updateTaskLabel(label);
    });
  });

  /*for (var i = 0; i < sqlTableData.length; i++) {
    var buttonID = `#display${sqlTableData[i].identifier}Button`;
    var label = sqlTableData[i].label
    var tableName = sqlTableData[i].sql_table_name
    $(buttonID).bind("click", function () {
      console.log(buttonID + " clicked");
      sqlMethods.displayTable(tableName, populateOutputTable);
      updateTaskLabel(label);
    });
  }*/
}


function bindSearchButtons() {
  /*Uses the following attributes from sqlTableData:
  {"identifier":  "Items",
  "label":  "Items",
  "tableName":  "amazon_warehouses"}
  "sql_cols" : [
    {
      "col_name" : "customer_id",
      "type" : "Int",
      "label" : "ID:"
    }
  */

  sqlTableData.forEach(function (tableData) {
    tableData.sql_cols.forEach(function (colData) {
      var label = tableData.label;
      var tableName = tableData.sql_table_name;
      var tableIdentifier = tableData.identifier;
      var submitButtonID = `#search${tableIdentifier}${colData.name}Submit`;
      var inputID = `#search${tableIdentifier}${colData.name}Input`;
      var colName = colData.col_name;
      var type = colData.type;
      $(submitButtonID).bind("click", function () {
        console.log(submitButtonID + " clicked");
        var input = $(inputID).val();
        console.log(`${inputID}Input: ${input}`);

        if(type == "Int") {
          input = parseInt(input);
        }
        else if(type == "Float") {
          input = parseFloat(input);
        }
        sqlMethods.searchTableByColumn(tableName, colName, input, populateOutputTable);
        updateTaskLabel("Searching " + label);
      });
    });
  });

  /*for (var i = 0; i < sqlTableData.length; i++) {
    for (var j = 0; j < sqlTableData[i].sql_cols.length; j++) {
      var submitButtonID = `#Search${sqlTableData[i].identifier}${sqlTableData[i].sql_cols[j].name}Submit`;
      var inputID = `#Search${sqlTableData[i].identifier}${sqlTableData[i].sql_cols[j].name}Input`;
      var label = sqlTableData[i].label;
      var tableName = sqlTableData[i].sql_table_name;
      var colName = sqlTableData[i].sql_cols[j].col_name;
      var type = sqlTableData[i].sql_cols[j].type;
      $(submitButtonID).bind("click", function () {
        console.log(submitButtonID + " clicked");
        var input = $(inputID).val();
        console.log(`${inputID}Input: ${input}`);

        if(type == "Int") {
          input = parseInt(input);
        }
        else if(type == "Float") {
          input = parseFloat(input);
        }
        sqlMethods.searchTableByColumn(tableName, colName, input, populateOutputTable);
        updateTaskLabel("Searching " + label);
      });
    }
  }*/
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


function identity(x) {
  return x;
}

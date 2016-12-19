//const sqlMethods = require('./js/sqlMethods.js');
//const csvExport = require('./js/writeToCSV.js');

$(function () {
  bindButtons();
});

function bindButtons() {
  /*$("#forceCloseButton").bind("click", function () {
    console.log("forceCloseButton Clicked");
    sqlMethods.endPool();
    updateTaskLabel("Closed Down");
  });*/

  $("#testingButton").bind("click", function () {
    console.log("testingButton Clicked");
    //$.post("/");
  });

  bindSearchButtons();
  bindDisplayButtons();
  bindCreateButtons();
  bindUpdateButtons();
  bindDeleteButtons();
  bindReportButtons();

}

function bindDisplayButtons() {

  sqlTableData.forEach(function (tableData) {
    var buttonID = `#display${tableData.identifier}Button`;
    var label = tableData.label
    var tableName = tableData.tableView
    $(buttonID).bind("click", function () {
      console.log(buttonID + " clicked");
      $.post("/display", {"tableName": tableName}, function (res) {
        populateOutputTable(res);
        updateTaskLabel(label);
      });
    });
  });

}


function bindSearchButtons() {

  sqlTableData.forEach(function (tableData) {
    tableData.view_cols.forEach(function (colData) {
      var label = tableData.label;
      var tableName = tableData.tableView;
      var tableIdentifier = tableData.identifier;
      var submitButtonID = `#search${tableIdentifier}${colData.name}Submit`;
      var inputID = `#search${tableIdentifier}${colData.name}Input`;
      var colName = colData.col_name;
      var type = colData.type;
      $(submitButtonID).bind("click", function () {
        console.log(submitButtonID + " clicked");
        var input = $(inputID).val();
        if(type == "Int") {
          input = parseInt(input);
        }
        else if(type == "Float") {
          input = parseFloat(input);
        }
        else if (type == "String") {
          input = "%" + input + "%";
        }
        $.post("/search", {
          "tableName": tableName,
          "colName": colName,
          "input": input
        }, function (res) {
          populateOutputTable(res);
          updateTaskLabel(label);
        });
      });
    });
  });

}

function bindCreateButtons() {
  sqlTableData.forEach(function (tableData) {

    var validInsertColumns = tableData.sql_cols.filter(function (column) {
      //Only returns columns that aren't autoincrement
      return !(column.auto);
    });

    //Binding IDs to HTML
    var submitButtonID = `#create${tableData.singular}Submit`;
    for (var i = 0; i < validInsertColumns.length; i++) {
      validInsertColumns[i].inputID = `#create${tableData.singular}${validInsertColumns[i].name}Input`;
    }

    /*
    the validInsertColumns object should look like the example below

    {
      "col_name" : "name",
      "type" : "String",
      "label" : "Item Name",
      "name" : "Name",
      "auto" : false,
      "inputID" : "#createItemNameInput"
    },*/


    //SQL Data
    var tableName = tableData.sql_table_name;
    var validInsertColumnNames = validInsertColumns.map(function (column) {
      return column.col_name;
    });

    $(submitButtonID).bind("click", function () {
      console.log(submitButtonID + " clicked");
      //Retrieving Inputs
      var userInputs = validInsertColumns.map(function (column) {
        var columnForm = $(column.inputID);
        return columnForm.val();
      });

      //Type casting
      for (var i = 0; i < userInputs.length; i++) {
        var input = userInputs[i];
        var type = validInsertColumns[i].type;
        if(type == "Int") {
          userInputs[i] = parseInt(input);
        }
        else if(type == "Float") {
          userInputs[i] = parseFloat(input);
        }
      }

      $.post("/create", {
        "tableName": tableName,
        "userInputs": userInputs,
        "validInsertColumnNames": validInsertColumnNames
      }, displayUpdateFeedback);
    });


  });
}

function bindUpdateButtons() {
  //First for the modals that update All fields
  sqlTableData.forEach(function (tableData) {
    var singular = tableData.singular;

    //Binding IDs to HTML
    var submitAllButtonID = `#update${singular}AllSubmit`;
    for (var i = 0; i < tableData.sql_cols.length; i++) {
      var colName = tableData.sql_cols[i].name;
      tableData.sql_cols[i].allInputID = `#update${singular}All${colName}Input`;
    }

    $(submitAllButtonID).bind("click", function () {
      console.log(submitAllButtonID + " clicked");
      //Retrieving Inputs
      var userInputs = tableData.sql_cols.map(function (column) {
        console.log(column.allInputID);
        var columnForm = $(column.allInputID);
        console.log(columnForm.val());
        return columnForm.val();
      });

      //Type casting
      for (var i = 0; i < userInputs.length; i++) {
        var type = tableData.sql_cols[i].type;
        if(type == "Int") {
          userInputs[i] = parseInt(userInputs[i]);
        }
        else if(type == "Float") {
          userInputs[i] = parseFloat(userInputs[i]);
        }
      }

      //SQL Data
      var tableName = tableData.sql_table_name;
      var colNames = tableData.sql_cols.map(function (column) {
        return column.col_name;
      });

      //This might be lazy, but I'm retrieving the id by assuming it's
      //The second input by the user
      var id = userInputs.shift();
      var idColName = colNames.shift();

      $.post("/update", {
        "id": id,
        "idColName": idColName,
        "userInputs": userInputs,
        "colNames" : colNames,
        "tableName" : tableName
      }, displayUpdateFeedback);

    });
  });

  //Now for individual update fields
  sqlTableData.forEach(function (tableData) {
    tableData.sql_cols.forEach(function (column) {

      //We don't want bindings for ID fields
      if(column.auto) {
        return;
      }

      var singular = tableData.singular;
      var colName = column.name;

      //Binding IDs to HTML
      var submitButtonID = `#update${singular}${colName}Submit`;
      $(submitButtonID).bind("click", function () {
        console.log(submitButtonID + " clicked");

        //Retrieving Inputs
        //Again, assuming that the first column is the ID
        var idColIdentifier = tableData.sql_cols[0].name;
        var idInputID = `#update${singular}${colName}${idColIdentifier}Input`;
        var fieldInputID = `#update${singular}${colName}Input`;
        var userIDInput = $(idInputID).val();
        var userFieldInput = $(fieldInputID).val();

        //Type casting
        var type = column.type;
        if(type == "Int") {
          userFieldInput = parseInt(userFieldInput);
        }
        else if(type == "Float") {
          userFieldInput = parseFloat(userFieldInput);
        }
        var id = parseInt(userIDInput);

        //SQL Data
        var tableName = tableData.sql_table_name;
        var sqlColName = column.col_name;
        var idColName = tableData.sql_cols[0].col_name;
        var colNames = [sqlColName];
        var userInputs = [userFieldInput];

        $.post("/update", {
          "id": id,
          "idColName": idColName,
          "userInputs": userInputs,
          "colNames" : colNames,
          "tableName" : tableName
        }, displayUpdateFeedback);

      });

    });

  });

}

function bindDeleteButtons() {
  sqlTableData.forEach(function (tableData) {
    //Binding IDs to HTML
    var singular = tableData.singular;
    var submitButtonID = `#delete${singular}Submit`;
    $(submitButtonID).bind("click", function () {
      //Retrieving input
      var inputID = `#delete${singular}Input`;
      var userIDInput = $(inputID).val();
      var id = parseInt(userIDInput);

      //SQL Data
      var tableName = tableData.sql_table_name;
      var idColName = tableData.sql_cols[0].col_name;

      $.post("/delete", {
        "id": id,
        "idColName": idColName,
        "tableName" : tableName
      }, displayUpdateFeedback);

    });
  });

}

function bindReportButtons() {
    var bestSellingItemsButtonId = "#bestSellingItemsButton";
    var worstSellingItemsButtonId = "#worstSellingItemsButton";
    var bestSellingItemsStateButtonId = "#bestSellingItemsStateButton";
    var bestGrossingItemsButtonId = "#bestGrossingItemsButton";
    var worstGrossingItemsButtonId = "#worstGrossingItemsButton";
    var biggestSpendersButtonId = "#biggestSpendersButton";

    $(bestSellingItemsButtonId).bind("click", function (e) {
      e.preventDefault();  //stop the browser from following
      window.location.href = 'downloads/bestSellers.csv';
    });

    $(worstSellingItemsButtonId).bind("click", function (e) {
      e.preventDefault();
      window.location.href = 'downloads/worstSellers.csv';
    });

    $(bestSellingItemsStateButtonId).bind("click", function (e) {
      e.preventDefault();
      window.location.href = 'downloads/bestSellersByState.csv';
    });

    $(bestGrossingItemsButtonId).bind("click", function (e) {
      e.preventDefault();
      window.location.href = 'downloads/bestGrossers.csv';
    });

    $(worstGrossingItemsButtonId).bind("click", function (e) {
      e.preventDefault();
      window.location.href = 'downloads/worstGrossers.csv';
    });

    $(biggestSpendersButtonId).bind("click", function (e) {
      e.preventDefault();
      window.location.href = 'downloads/biggestSpenders.csv';
    });
}


function updateTaskLabel(str) {
  //Takes a string object and puts it in the h2 tag
  //At the top of the page
  var label = $("#taskLabel");
  label.text(str);
}

function exportReturnToCSV(data, extraData, err, fileName) {
  if(err) {
    throw err
  }
  csvExport.writeObjectToCsvFile(data[0], fileName);
}


function populateOutputTable(res) {
  //Takes a data object from MYSQL which is expected as
  //an array of of objects and populates #outputTable
  var temp = JSON.parse(res);
  var data = temp[0];
  var extraData = temp[1];
  var err = temp[2];

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
      console.error(err);
      data = [{
        "Error" : "Unable to query Database."
      }];
    }
  }
  else {
    if(data.constructor.name == "OkPacket") {
      console.log("Recieved OkPacket when RowData was expected.");
      data = [{
        "Error" : "Database communication error."
      }];
    }
    else if(data.length == 0) {
      console.log("Recieved data object with 0 rows.");
      data = [{
        "Uh-oh" : "Your query returned no records."
      }];
    }
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
  var table = $("#outputTable");
  table.empty();

  table.append(tableContents);

}

function displayUpdateFeedback(res) {
  //Takes an OKPacket or an error from mysql
  //and displays it to the user in a modal
  //Then displays the table that was inserted into

  var temp = JSON.parse(res);
  var data = temp[0];
  var extraData = temp[1];
  var err = temp[2];


  var modalHeader = "";
  var modalBody = "";

  if(err) {
    modalHeader = "Error";
    if(err.code == "ER_USER_LIMIT_REACHED") {
      modalBody = "Max user limit reached. Try waiting a few minutes and restarting.";
    }
    else if (err.code === "ER_BAD_FIELD_ERROR") {
      modalBody = "One or more of the fields provided was entered incorrectly.";
    }
    else if (err.code == "ER_NO_REFERENCED_ROW_2") {
      modalBody = "Error referencing foriegn key. Try again.";
    }
    else {
      modalBody = "Database Error.";
    }
  }
  else {
    if(data.hasOwnProperty('affectedRows')) {

      if(data.affectedRows == 0) {
        modalHeader = "Uh-oh";
        modalBody = "Your update was not successful.";
      }
      else {
        modalHeader = "Success";
        if(data.affectedRows == 1) {
          modalBody = `Your update affected ${data.affectedRows} row.`;
        }
        else {
          modalBody = `Your update affected ${data.affectedRows} rows.`;
        }
      }
    }
    else {
      modalHeader = "Error";
      modalBody = "Database communication error";
    }
  }


  showFeedbackModal(modalHeader, modalBody);
}

function showFeedbackModal(modalHeader, modalBody) {
  modal = $("#feedbackModal");
  modalH = $("#feedbackModalHeader");
  modalB = $("#feedbackModalBody");

  modalH.text(modalHeader);
  modalB.text(modalBody);

  modal.modal("show");
}

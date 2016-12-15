const sqlMethods = require('./js/sqlMethods.js');
const fs = require('fs');
var sqlTableData = JSON.parse(fs.readFileSync('tableData.json', 'utf-8')).tables;
console.log("pageScript Loaded.");

$(function () {
  generateModals();
  bindButtons();
});

function generateModals() {

  generateCreateModals();
  generateSearchModals();
  generateUpdateModals();
  generateDeleteModals();
}

function generateCreateModals() {
  //Modals for Create menu
  var menuDiv = $("#menuDiv");
  var createModalsString = "";

  for (var i = 0; i < sqlTableData.length; i++) {
    var singular = sqlTableData[i].singular;
    var modalID = `create${singular}Modal`;
    var modalTitle = `Record New ${singular}`;
    var modalContent = `<form method="post" onsubmit="return false;">
      <div class="form-group text-center">`;

    for(var j = 0; j < sqlTableData[i].sql_cols.length; j++) {
      if(sqlTableData[i].sql_cols[j].auto) {
        continue;
        //We don't want to display the autoincrement columns
        //to the user on the create menu
      }
      var colName = sqlTableData[i].sql_cols[j].name;
      var label = sqlTableData[i].sql_cols[j].label;
      modalContent += `<div class="col-xs-4">
        <label for="create${singular}${colName}Input">${label}:</label>
        <input type="text" id="create${singular}${colName}Input" class="form-control">
      </div>`
    }
    modalContent += `<div class="col-xs-4"><br><button type="submit" class="btn btn-info" id="create${singular}Submit" data-dismiss="modal">Submit</button></div>
  </div>
</form>`
    createModalsString += modalTemplate(modalID, modalTitle, modalContent);

  }
  menuDiv.append(createModalsString);
}

function generateSearchModals() {
  //Modals for Search Menu
  var menuDiv = $("#menuDiv");
  var searchModalsString = "";


  for (var i = 0; i < sqlTableData.length; i++) {
    var identifier = sqlTableData[i].identifier;

    for (var j = 0; j < sqlTableData[i].sql_cols.length; j++) {
      var name = sqlTableData[i].sql_cols[j].name;
      var label = sqlTableData[i].sql_cols[j].label;

      var modalID = `search${identifier}${name}Modal`;
      var modalTitle = `Search ${identifier}`;
      var content = `<form method="post" onsubmit="return false;">
        <div class="form-group text-center">
          <label for="search${identifier}${name}Input">${label}:</label>
          <input type="text" id="search${identifier}${name}Input">
          <button type="submit" class="btn btn-info" id="search${identifier}${name}Submit" data-dismiss="modal">Submit</button>
        </div>
      </form>`;

      searchModalsString += modalTemplate(modalID, modalTitle, content);
    }
  }

  menuDiv.append(searchModalsString);
}

function generateUpdateModals() {
  //Modals for the Update menu
  var menuDiv = $("#menuDiv");
  var updateModalsString = "";

  //First, the modals that update all fields
  for(var i = 0; i < sqlTableData.length; ++i) {
    var singular = sqlTableData[i].singular;
    var modalID = `update${singular}AllModal`;
    var modalTitle = `Update ${singular}`;

    var modalContent = `<form method="post" onsubmit="return false;">
      <div class="form-group text-center">`;

    for(var j = 0; j < sqlTableData[i].sql_cols.length; ++j) {
      var isIdColumn = sqlTableData[i].sql_cols[j].auto;
      var colName = sqlTableData[i].sql_cols[j].name;
      var colLabel = sqlTableData[i].sql_cols[j].label;
      var inputID = `update${singular}All${colName}Input`;
      var label = isIdColumn ? `${colName}:` : `New ${colLabel}:`;
      var input = `<div class="col-xs-4"><label for="${inputID}">${label}</label><input type="text" id=${inputID}></div>`
      modalContent += input;
    }

    modalContent += `<div class="col-xs-4"><br><button type="submit" class="btn btn-info" id="update${singular}AllSubmit" data-dismiss="modal">Submit</button></div>
  </div>
</form>`;
    updateModalsString += modalTemplate(modalID, modalTitle, modalContent);
  }

  //Now, the modals that only update one field at a time
  for(var i = 0; i < sqlTableData.length; ++i) {
    var singular = sqlTableData[i].singular;

    //Assuming that the id column is the first listed
    var nameOfIdColumn = sqlTableData[i].sql_cols[0].name;
    var labelOfIdColumn = sqlTableData[i].sql_cols[0].label;


    for(var j = 0; j < sqlTableData[i].sql_cols.length; ++j) {
      var colName = sqlTableData[i].sql_cols[j].name;
      var colLabel = sqlTableData[i].sql_cols[j].label;
      var isIdColumn = sqlTableData[i].sql_cols[j].auto;
      if(isIdColumn) {
        continue;
        //We don't want to allow users to update IDs
      }

      var modalContent = `<form method="post" onsubmit="return false;">
        <div class="form-group text-center">`;

      var modalID = `update${singular}${colName}Modal`;
      var modalTitle = `Update ${singular} ${colLabel}`;
      //We have 2 input fields one for ID and one for whatever column we're looping
      //through. Each input has an ID and a label
      var fieldInputID = `update${singular}${colName}Input`;
      var fieldInputLabel = `New ${colLabel}:`;
      var idInputID = `update${singular}${colName}${nameOfIdColumn}Input`;
      var idInputLabel = `${labelOfIdColumn}:`;
      modalContent += `<div class="col-xs-4"><label for="${idInputID}">${idInputLabel}</label><input type="text" id="${idInputID}"></div>`
      modalContent += `<div class="col-xs-4"><label for="${fieldInputID}">${fieldInputLabel}</label><input type="text" id="${fieldInputID}"></div>`;


      modalContent += `<div class="col-xs-4"><br><button type="submit" class="btn btn-info" id="update${singular}${colName}Submit" data-dismiss="modal">Submit</button></div>
    </div>
  </form>`;
      updateModalsString += modalTemplate(modalID, modalTitle, modalContent);
    }
  }

  menuDiv.append(updateModalsString);
}

function generateDeleteModals() {
  //Modals for the Delete menu
  var menuDiv = $("#menuDiv");
  var deleteModalsString = "";

  for(var i = 0; i < sqlTableData.length; ++i) {
    var singular = sqlTableData[i].singular;
    var modalTitle = `Delete ${singular}`;
    var modalID = `delete${singular}Modal`;

    var labelOfIdColumn = "";

    //Retrieving the label of the ID column
    for(var j = 0; j < sqlTableData[i].sql_cols.length; ++j) {
      var isIdColumn = sqlTableData[i].sql_cols[j].auto;
      if(isIdColumn) {
        labelOfIdColumn = sqlTableData[i].sql_cols[j].label;
        break;
      }
    }
    //Remember that the id's for delete are as follows
    // #deleteItemInput <- for ItemID
    // #deleteItemSubmit <- Submit button

    var idInputID = `delete${singular}Input`;
    var idInputLabel = `${labelOfIdColumn}:`;
    var modalContent = `<form method="post" onsubmit="return false;">
      <div class="form-group text-center">`;
    modalContent += `<div class="col-xs-6"><label for="${idInputID}">${idInputLabel}</label><input type="text" id="${idInputID}"></div>`
    modalContent += `<div class="col-xs-6"><button type="submit" class="btn btn-info" id="delete${singular}Submit" data-dismiss="modal">Submit</button></div>
  </div>
</form>`;

    deleteModalsString += modalTemplate(modalID, modalTitle, modalContent);
  }

  menuDiv.append(deleteModalsString);
}

function modalTemplate(modalID, modalTitle, content) {
  modal = `  <div id="${modalID}" class="modal fade" role="dialog">
       <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header">
             <a class="close" data-dismiss="modal">&times;</a>
             <h4 class="modal-title">${modalTitle}</h4>
           </div>
           <div class="modal-body">
            ${content}
            </div>
          </div>
        </div>
      </div>`;
  return modal;
}

function bindButtons() {
  $("#forceCloseButton").bind("click", function () {
    console.log("forceCloseButton Clicked");
    sqlMethods.endPool();
    updateTaskLabel("Closed Down");
  });

  bindSearchButtons();
  bindDisplayButtons();
  bindCreateButtons();
  bindUpdateButtons();
  bindDeleteButtons();

}

function bindDisplayButtons() {

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

}


function bindSearchButtons() {

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

      sqlMethods.insertValuesToTable(userInputs, validInsertColumnNames, tableName, displayUpdateFeedback);
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

      sqlMethods.updateRowWithID(id, idColName, userInputs, colNames, tableName, displayUpdateFeedback);
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

        sqlMethods.updateRowWithID(id, idColName, [userFieldInput], [sqlColName], tableName, displayUpdateFeedback);

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
      var value = 1;
      var colName = "deleted";

      sqlMethods.updateRowWithID(id, idColName, [value], [colName], tableName, displayUpdateFeedback);

    });
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

function displayUpdateFeedback(data, err) {
  //Takes an OKPacket or an error from mysql
  //and displays it to the user in a modal
  //Then displays the table that was inserted into
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
    if(data.constructor.name == "OkPacket") {

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



function identity(x) {
  return x;
}

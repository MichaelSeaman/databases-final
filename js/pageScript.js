const sqlMethods = require('./js/sqlMethods.js');
const fs = require('fs');
var sqlTableData = JSON.parse(fs.readFileSync('tableData.json', 'utf-8')).tables;
console.log("pageScript Loaded.");

$(function () {
  generateModals();
  bindButtons();
});

function generateModals() {

  var menuDiv = $("#menuDiv");

  //Modals for Create menu
  var createModalsString = "";

  for (var i = 0; i < sqlTableData.length; i++) {
    var singular = sqlTableData[i].singular;
    createModalsString += `  <div id="create${singular}Modal" class="modal fade" role="dialog">
         <div class="modal-dialog">
           <div class="modal-content">
             <div class="modal-header">
               <a class="close" data-dismiss="modal">&times;</a>
               <h4 class="modal-title">Record New ${singular}</h4>
             </div>
             <div class="modal-body">
               <form method="post" onsubmit="return false;">
                 <div class="form-group text-center">`;
      for (var j = 0; j < sqlTableData[i].sql_cols.length; j++) {
        if(sqlTableData[i].sql_cols[j].auto) {
          continue;
          //We don't want to display the autoincrement columns
          //to the user on create
        }
        var colName = sqlTableData[i].sql_cols[j].name;
        var label = sqlTableData[i].sql_cols[j].label;
        createModalsString += `<div class="col-xs-4">
          <label for="create${singular}${colName}Input">${label}:</label>
          <input type="text" id="create${singular}${colName}Input" class="form-control">
        </div>`
      }
      createModalsString += `<div class="col-xs-4"><br><button type="submit" class="btn btn-info" id="create${singular}Submit" data-dismiss="modal">Submit</button></div>
    </div>
  </form>
</div>
</div>
</div>
</div>
`;
  }
  menuDiv.append(createModalsString);

  //Modals for Search Menu
  var searchModalsString = "";

  for (var i = 0; i < sqlTableData.length; i++) {
    var identifier = sqlTableData[i].identifier;
    for (var j = 0; j < sqlTableData[i].sql_cols.length; j++) {
      var name = sqlTableData[i].sql_cols[j].name;
      var label = sqlTableData[i].sql_cols[j].label;
      searchModalsString += `<div id="search${identifier}${name}Modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <a class="close" data-dismiss="modal">&times;</a>
              <h4 class="modal-title">Search ${identifier}</h4>
            </div>
            <div class="modal-body">
              <form method="post" onsubmit="return false;">
                <div class="form-group text-center">
                  <label for="search${identifier}${name}Input">${label}:</label>
                  <input type="text" id="search${identifier}${name}Input">
                  <button type="submit" class="btn btn-info" id="search${identifier}${name}Submit" data-dismiss="modal">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      `;
    }
  }

  menuDiv.append(searchModalsString);
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

      console.log(data);

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

  //expecting a String modalHeader
  //and String modalBody

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

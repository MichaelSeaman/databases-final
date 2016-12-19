//The script used to generate index.html initially. At some point
//I was using this to auto generate everytime that index.html was
//requested, but I figured just using this script to append to
//the index.html file would speed things up

//AKA this file is not touched by the server


const $ = require('jQuery');
const fs = require('fs');

var sqlTableData = JSON.parse(fs.readFileSync('tableData.json', 'utf-8')).tables;

$(function () {
  generateModals();
});

function generateModals() {

  generateSearchModals();
  generateCreateModals();
  generateUpdateModals();
  generateDeleteModals();


}

function generateSearchModals() {
  //Modals for Search Menu
  var menuDiv = $("#menuDiv");
  var searchModalsString = "";


  for (var i = 0; i < sqlTableData.length; i++) {
    var identifier = sqlTableData[i].identifier;

    for (var j = 0; j < sqlTableData[i].view_cols.length; j++) {
      var name = sqlTableData[i].view_cols[j].name;
      var label = sqlTableData[i].view_cols[j].label;

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

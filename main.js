var data = [
    {name: 'name1', value: 'value1'},
    {name: 'name2', value: 'value2'}
];

var table = document.querySelector('.table-data');
var plusRow = document.querySelector('.plus-row');
var textarea = document.querySelector('textarea');
var btnExportJson = document.querySelector('.btn-export-json');
var btnImportJson = document.querySelector('.btn-import-json');
var btnDownloadJson = document.querySelector('.btn-download-json');
var btnUploadJson = document.querySelector('.upload-json-file');
var btnCsv = document.querySelector('.btn-csv');
var columns = [];

function fillColumns() {
    columns = [];
    data.forEach(function(element) {
        var keys = Object.getOwnPropertyNames(element);
        keys.forEach(function (item) {
    
            var find = columns.find(function(column) {
                if (item == column) {
                    return true;
                }
            })
    
            if (find == undefined) {
                columns.push(item);
            }
        })
    })
}
fillColumns();

function fillHeader(columns) {
    var table = document.querySelector('.table-data');
    var row = table.insertRow();

    columns.forEach(function(element) {
        var cell = row.insertCell();
        cell.innerHTML = element;
    })
}
fillHeader(columns);

function fillTable(data) {
    data.forEach(function(item) {
        addItemToTable(item);
    })
}
fillTable(data);

function plusRowIventHandler() {
    data.push({});
    addItemToTable({});
}

function addItemToTable(item) {
    var row = table.insertRow();

    columns.forEach(function(columnName) {
        var cell = row.insertCell();
            cell.innerHTML = '<input type="text" value="' + (item[columnName] != undefined ? item[columnName] : '' ) + '" placeholder="' + columnName + '" onchange="updateCell(this)">';
    })

    var delButtonCell = row.insertCell();
    delButtonCell.innerHTML = '<button class="del-row btn btn-outline-danger" onclick="deleteRow(this)"><i class="fas fa-minus-circle"></i></button>';
}

function deleteRow(button) {
    var cell = button.parentNode;
    var row = cell.parentNode;
    var rowIndex = row.rowIndex;
    table.deleteRow(rowIndex);
    data.splice(rowIndex-1, 1);

}
plusRow.addEventListener('click', plusRowIventHandler);

function updateCell(input) {
    var cell = input.parentNode;
    var row = cell.parentNode;
    var rowIndex = row.rowIndex;    
    var dataIndex = data[rowIndex-1];
    var cellIndex = cell.cellIndex;
    var keyName = columns[cellIndex];
    dataIndex[keyName] = input.value;
}

function exportJson() {
    var myJSON = JSON.stringify(data);
    textarea.value = myJSON;    
}
btnExportJson.addEventListener('click', exportJson);

function importJson(jsonString) {
    data = JSON.parse(jsonString);

    var rows = table.querySelectorAll('tr').length;
    for (var i = 0; rows > i; i++) {
        var delRow = table.deleteRow(-1);
    }
    fillColumns();
    fillHeader(columns);
    fillTable(data);
}
btnImportJson.addEventListener('click', btnImportJsonHandler);

function btnImportJsonHandler() {
    importJson(textarea.value);
}

function downloadAsJson () {
    var fileJson = JSON.stringify(data);
    var blob = new Blob([fileJson], {type: 'application/json'});
    var url = window.URL.createObjectURL(blob);
    downloadUrl(url, 'file');
}

function downloadUrl(url, fileName) {
    var link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}
btnDownloadJson.addEventListener('click', downloadAsJson);

function uploadJsonFile(file) {
    var fileData = file.srcElement.files[0];
    var fr = new FileReader();
    fr.onloadend = function(evt) {
        var parsedfileText = evt.srcElement.result;
        importJson(parsedfileText);
    }

    var text = fr.readAsText(fileData);
}
btnUploadJson.addEventListener('change', uploadJsonFile);

function downloadToCsv () {
    var rowValues = [];
    for (var row of data) {
        var colValues = [];
        for (var col of columns) {
            colValues.push(row[col]);
        }
        rowValues.push(colValues.join(','));
    }
    var resultCsv = rowValues.join('\r\n');
    var blob = new Blob([resultCsv], {type: 'text/csv'});
    var url = window.URL.createObjectURL(blob);
    downloadUrl(url, 'file.csv');
}
btnCsv.addEventListener('click', downloadToCsv);
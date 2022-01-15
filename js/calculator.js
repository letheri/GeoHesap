const PARAMETER = calculations[currentCalculator];
// Calculation Function Import
function addScript(src) {
  var s = document.createElement("script");
  s.setAttribute("src", src);
  document.body.appendChild(s);
}
if (PARAMETER) {
  addScript("./js/functions/" + PARAMETER.functionFileName);
} else {
  window.location.href = "error.html";
}

// Common Function Import
if (PARAMETER.needsCommonFunctions) {
  addScript("./js/common.js");
}

// Title Construction
const title = document.getElementById("titleEl");
title.innerHTML = PARAMETER.fullname;
if (PARAMETER.canReverseCalculate) {
  title.innerHTML += `<a class="bi bi-arrow-left-right p-1 mx-2 px-2" href="calculator.html?c=${PARAMETER.reverseCalculationName}" id="functionSwitch"></a>`;
}

// Ellipsoid Field Elements
if (PARAMETER.ellipsoidUsage) {
  document.getElementById("ellipsoid_btn").classList.toggle("visually-hidden");
  const ellipsoidBtns = document
    .getElementById("ellipsoid_btn")
    .getElementsByTagName("button");
  for (const i of ellipsoidBtns) {
    if (i.id == 'custom_ell') {
      document.getElementById('custom_ell_btn').addEventListener("click", ()=>{
        const parameterA = $('#param_a')[0].value
        const parameterB = $('#param_b')[0].value
        if (parameterA && parameterB && !i.className.includes("btn-secondary")) {
          console.log(i)
          ellipsoids.custom = [parseFloat(parameterA),parseFloat(parameterB)];
          const oldSelection = document.getElementsByClassName("btn-secondary");
          oldSelection[0].classList.toggle("text-white");
          oldSelection[0].classList.toggle("btn-secondary");
          i.classList.toggle("text-white");
          i.classList.toggle("btn-secondary");
          currentEllipsoid = i.id;
        }
      })
    } else if (i.id != 'custom_ell_btn') {
      i.addEventListener("click", () => {
        if (!i.className.includes("btn-secondary")) {
          const oldSelection = document.getElementsByClassName("btn-secondary");
          oldSelection[0].classList.toggle("text-white");
          oldSelection[0].classList.toggle("btn-secondary");
          i.classList.toggle("text-white");
          i.classList.toggle("btn-secondary");
          currentEllipsoid = i.id;
        }
        console.log(currentEllipsoid);
      });
    }
  }
}

// Input Field Elements
const inputFields = document.getElementById("inputFields");
// Output Field Elements
const enteredValues = document.getElementById("printedEnteredValues");
const resultingValues = document.getElementById("resultingValues");
//enteredValues.innerHTML = `<ol class="col" id ='entry${i}'></ol>`
let fileUploaded = false;
const inputElements = document.getElementsByClassName("calc-inputs");
const calculationResultElement = document.getElementById("results_text");
let coordinateList = []; // all coordinate inputs
let converterRan = false;
let currentFileType = 'csv';
let parsedFileData;

//
const resultSet = [];

// Dynamic Input and Output Generation
for (const i of PARAMETER.fieldNames) {
  if (i == 'N/S') {
    inputFields.innerHTML +=`<div class="input-group col mx-0">
    <span class="input-group-text" id="inputtext_${i}">${i}</span>
    <select class="" id="nsSelector">
      <option value="true">N</option>
      <option value="false">S</option>
    </select>
     </div>
     <input type="text" id="input${i}" class="d-none calc-inputs" >`
  } else if (i == 'UTM/TM') {
    inputFields.innerHTML +=`<div class="input-group col mx-0">
    <span class="input-group-text" id="inputtext_${i}">${i}</span>
    <select class="" id="utmSelector">
      <option value="6">UTM</option>
      <option value="3">TM</option>
    </select>
     </div>
     <input type="number" id="input${i}" class="d-none calc-inputs" >`
  } else {
    inputFields.innerHTML += `<div class="input-group col mx-0">
     <span class="input-group-text" id="inputtext_${i}">${i}</span>
     <input type="number" id="input${i}" class="form-control calc-inputs" placeholder="" aria-label="" aria-describedby="inputtext_${i}">
      </div>`;
  }
  enteredValues.innerHTML += `<ol class="col" id ='entry${i}'><p>${i}</p></ol>`;
}
for (const i of PARAMETER.outputNames) {
  resultingValues.firstElementChild.innerHTML += `<ol class="col" id ='result${i}'><p>${i}</p></ol>`;
}

// File Upload Element
if (PARAMETER.canFileUpload) {
  document.getElementById("fileUpload").classList.toggle("visually-hidden");
}

function checkFilledInputs() {
  // Checks if any input field is empty
  let check = true;

  for (const i of inputElements) {
    if (!i.value) {
      if(!fileUploaded && !coordinateList.length){
        i.style.border = "1px solid red";
        alert('Please fill all the fields!')
      }
      check = false;
    }
  }
  return check;
}

function readFields() {
  const inputData = {};
  // create fields
  if (checkFilledInputs()) {
    for (const i of inputElements) {
      const fieldElementName = i.id.replace("input", "");
      inputData[fieldElementName] = i.value;
      i.value = "";
    }
    // console.log(coordinateList[0]["X"]);
    coordinateList.push(inputData);
    console.log('New Input:',inputData);
  }
}

function processData(rawData) {
  const preprocessed = [];
  const inputOutput = {};
  for (const i of PARAMETER.fieldNames) {
    preprocessed.push(rawData[i]); // put preprocessed data in the right order
  }
  const output = window[PARAMETER.functionName](...preprocessed) //window["functionName"](), calls function named functionName()
  inputOutput['input'] = preprocessed;
  inputOutput['output'] = output;
  resultSet.push(inputOutput);
  return output; 
}

function printEnteredValues(upload = {}) {
  clearPrintedCoordinates();
  if (enteredValues.parentElement.classList.contains('visually-hidden')){
    enteredValues.parentElement.classList.toggle('visually-hidden')
  }
  if (Object.keys(upload).length) {
    coordinateList = upload;
  }
  for (const i of coordinateList) {
    for (const j of PARAMETER.fieldNames) {
      const entryItem = document.createElement("li");
      entryItem.appendChild(document.createTextNode(i[j]));
      document.getElementById("entry" + j).appendChild(entryItem);
    }
  }
  
}

function printResultValues() {
  if (!converterRan) {
    resultingValues.classList.toggle("visually-hidden");
  }
  //resultingValues.innerHTML += '<li></li>';
  //for (const colName of PARAMETER.outputNames) {}
  for (const i of coordinateList) {
    const currentResult = processData(i);
    console.log(currentResult);
    for (let r = 0; r < currentResult.length; r++) {
      //resultingValues.lastElementChild.innerHTML += `${PARAMETER.outputNames[r]}: ${currentResult[r]}\n`;
      const resultItem = document.createElement("li");
      resultItem.appendChild(
        document.createTextNode(currentResult[r].toFixed(4))
      );
      document
        .getElementById("result" + PARAMETER.outputNames[r])
        .appendChild(resultItem);
    }
  }
  while (coordinateList.length > 1) {
    coordinateList.pop();
  }
  //calculationResultElement.innerHTML = "<ol class='row'>" + resultText + "</ol>";
  converterRan = true;
}

function clearPrintedCoordinates(){
  for (const e of PARAMETER.fieldNames) {
    document.getElementById("entry" + e).innerHTML = `<p>${e}</p>`;
  }
  for (const r of PARAMETER.outputNames) {
    document.getElementById("result" + r).innerHTML = `<p>${r}</p>`;
  }
}

function reset_calculator(softReset = false) {
  coordinateList = [];
  fileUploaded = false;
  clearPrintedCoordinates();
  if (!enteredValues.parentElement.classList.contains('visually-hidden')){
    enteredValues.parentElement.classList.toggle('visually-hidden')
  }
  if (converterRan) {
    resultingValues.classList.toggle("visually-hidden");
    downloadBtn.classList.toggle("visually-hidden");
  }
  converterRan = false;
  tableElement.innerHTML = tableElement.firstElementChild;
  if (softReset) {
    return;
  }
  for (const i of inputElements) {
    i.value = "";
  }
  while (resultSet.length > 1) {
    resultSet.pop();
  }
}

function convertBtnHandler(){
  if (checkFilledInputs()) {
    readFields();
    printEnteredValues();
  }
  if (coordinateList.length) {
    // converterRan = true;
    printResultValues();
    //resultTextBox.innerHTML = "<ol class='row'>" + resultText + "</ol>";
    downloadBtn.classList.toggle('visually-hidden')
  }
}



// Add new coordinate button
const addCoordsBtn = document.getElementById("addCoords");
addCoordsBtn.addEventListener("click", () => {
  if (converterRan) {
    reset_calculator(true);
  }
  readFields();
  printEnteredValues();
});

// Convert button
const convertBtn = document.getElementById("convertBtn");
convertBtn.addEventListener("click", () => {
  convertBtnHandler();
});
let fileList;
// FILE HANDLER - BROKEN ??
function handleFiles() {
  fileUploaded = true;
  let fileType = '';
  fileList = this.files; /* now you can work with the file list */
  console.log(fileList[0].name);
  var reader = new FileReader();
  reader.readAsText(fileList[0]);
  reader.onload = function (event) {
    var fileContent = event.target.result;
    var data;
    if (fileList[0].name.includes(".csv")) {
      data = $.csv.toObjects(fileContent);
      fileType = 'csv';
      console.log(data)
    } else if (
      fileList[0].name.includes(".geojson") &&
      PARAMETER.canParseGeojson
    ) {
      fileType = 'geojson';
      json_data = JSON.parse(fileContent);
      data = geojson_parse(json_data);
    } else {
      alert("Invalid File!");
    }
    console.log(data);
    document.getElementById('fileUploadStatus').innerText = `${data.length} coordinates were uploaded!`;
    parsedFileData = data;
    
    
    // for(const i of data) {
    //   printEnteredValues(i)
    // }
  };
}

function checkDataValidity(parsedJson) {
  //console.log(parsedJson);
  if (!parsedJson[0]) {
    alert("Can't read the file!");
    return false;
  }
  for (const line of parsedJson) {
    for (const input of PARAMETER.fieldNames) {
      console.log(line[input]);
      if (!line[input] && line[input] !== 0) {
        alert("File has invalid coordinate data!")
        return false;
      }
    }
  }
  return true;
}

function geojson_parse(json) {
  const coordinates = [];
  json_features = turf.explode(json);
  //console.log(json_features)
  if (json.type == "FeatureCollection") {
    //geojson_find_datum(json_features.crs)
    for (const i of json_features.features) {
      let c = 0;
      const coord = new Object();
      Object.assign(coord, PARAMETER.geojsonTemplate);
      for (const j of i.geometry.coordinates) {
        //console.log(i, j,c)
        coord[PARAMETER.fieldNames[c]] = j;
        c += 1;
      }

      coordinates.push(coord);
    }
  }
  return coordinates;
}

function geojson_find_datum(object) {
  if (!object.hasOwnProperty("crs")) {
    currentEllipsoid = "wgs84";
    return;
  }
  // PARTIALLY CORRECT - FIX
  datum = crs.properties.name;
  if (datum.includes("4326") || datum.includes("crs84")) {
    currentEllipsoid = "wgs84";
  }
}

const uploadElement = document.getElementById("file_upload");
uploadElement.addEventListener("change", handleFiles, false);

document.getElementById("resetBtn").addEventListener("click", () => {
  reset_calculator();
});


if (PARAMETER.fieldNames.includes('N/S')) {
  const el = document.getElementById('nsSelector')
  el.addEventListener('click', ()=>{
    console.log(el.value)
    if ( el.value == '3'){
      document.getElementById('inputN/S').value = 3;
    } else {
      document.getElementById('inputN/S').value = 6;
    }
  })
} else if (PARAMETER.fieldNames.includes('UTM/TM')) {
  const el = document.getElementById('utmSelector')
  el.addEventListener('click', ()=>{
    console.log(el.value)
    if ( el.value == 'true'){
      document.getElementById('inputN/S').value = true;
    } else {
      document.getElementById('inputN/S').value = false;
    }
  })
}

const btnArea = document.getElementById('dataTypeBtns')
for (const btn of PARAMETER.dataTypes) {
  btnArea.innerHTML += `
<button class="btn btn-outline-dark data-type-btn" id="${btn}Btn">${btn}</button>`
}
const dataTypeBtns = document.getElementsByClassName('data-type-btn');
dataTypeBtns[0].classList.toggle('btn-secondary')
for (const btn of dataTypeBtns) {
  btn.addEventListener('click', ()=>{
    const currentlySelectedBtn = btnArea.getElementsByClassName('btn-secondary')[0]
    if (btn.id == currentlySelectedBtn.id){
      return
    }
    currentlySelectedBtn.classList.toggle('btn-secondary');
    btn.classList.toggle('btn-secondary');
    currentFileType = btn.id.replace('Btn', '')
    uploadSetter(currentFileType);

  })
}

function uploadSetter(currentFileType){
  switch (currentFileType){
    case 'csv':
      uploadElement.accept = '.csv';
      break;
    case 'GeoJson':
      uploadElement.accept = '.json, .geojson';
      break;
    case 'Excel':
      uploadElement.accept = '.xls, .xlsx';
      break

  }
    
}


// table generation for excel export
const tableElement = document.getElementById('excel_table').getElementsByTagName('tbody')[0];
tableElement.innerHTML = `<tr data-height="25">
<td class="" colspan='${PARAMETER.inputFields}' data-f-sz="20" data-f-color="ED6363" data-a-h="center" data-a-v="middle">Input Coordinates</td>
<td class="" colspan='${PARAMETER.outputFields}' data-f-sz="20" data-f-color="003545" data-a-h="center" data-a-v="middle">Output Results</td>
</tr>`;
const columnsTableElement = document.createElement('tr')
columnsTableElement.id='table_headers'
for (const i of PARAMETER.fieldNames){
  //const row = tableElement.getElementById('table_headers');
  columnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="16" data-f-color="ED6363" data-a-h="center" data-a-v="middle">${i}</td>`
}
for (const i of PARAMETER.outputNames){
  //const row = tableElement.getElementById('table_headers');
  columnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="16" data-f-color="00454A" data-a-h="center" data-a-v="middle">${i}</td>`
}
tableElement.appendChild(columnsTableElement);

function convertExcel() {
  for (const j of resultSet) {
    const newColumnsTableElement = document.createElement('tr')
    for (const i of j.input){
      //const row = tableElement.getElementById('table_headers');
      newColumnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="12" data-f-color="ED6363" data-a-h="center" data-a-v="middle">${i}</td>`
    }
    for (const i of j.output){
      //const row = tableElement.getElementById('table_headers');
      newColumnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="12" data-f-color="3C6562" data-a-h="center" data-a-v="middle">${i}</td>`
    }
    tableElement.appendChild(newColumnsTableElement)
  }

}

const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', ()=>{
  convertExcel();
  TableToExcel.convert(tableElement.parentElement)
})

document.getElementById('importModalBtn').addEventListener('click', ()=>{
  coordinateList = coordinateList.concat(parsedFileData);      
  if (checkDataValidity(parsedFileData)) {
      printEnteredValues(parsedFileData);
    } else {
      reset_calculator(true);
    }
})


function alert(text) {
  if (document.getElementsByClassName('alert').length) {
    return
  }
  document.getElementById('alert_box').innerHTML = `<div class='alert alert-danger alert-dismissible show fade' role='alert' ><strong>
  ${text}</strong>
  <button type='button' class='btn-close' data-bs-dismiss='alert' data-bs-f aria-label='Close'></button>
  </div>` 
}


let text = `<strong>For CSV:</strong> File has to start with column names of ${PARAMETER.fieldNames[0]}`
for (const j of PARAMETER.fieldNames.slice(1,PARAMETER.inputFields)) {
  text += ` ,${j}` 
}
text += `. Seperated by commas.<br>Each row has have exactly ${PARAMETER.inputFields} columns of coordinates.`
if (PARAMETER.canParseGeojson){
  text += '<br><strong>For GeoJson:</strong> Calculator assumes the Datum as WGS84.'
}
PARAMETER.uploadDescription = text;
document.getElementById('uploaderDesc').innerHTML = text;

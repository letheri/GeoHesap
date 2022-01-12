const PARAMETER = calculations[currentCalculator];
// Calculation Function Import
function addScript(src) {
  var s = document.createElement("script");
  s.setAttribute("src", src);
  document.body.appendChild(s);
}
if (PARAMETER) {
  addScript("/js/" + PARAMETER.functionFileName);
} else {
  window.location.href = "error.html";
}

// Common Function Import
if (PARAMETER.needsCommonFunctions) {
  addScript("/js/common.js");
}

// Title Construction
const title = document.getElementById("titleEl");
title.innerHTML = PARAMETER.fullname;
if (PARAMETER.canReverseCalculate) {
  title.innerHTML += `<a class="bi bi-arrow-left-right p-1 px-2" href="calculator.html?c=${PARAMETER.reverseCalculationName}" id="functionSwitch"></a>`;
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
const enteredValues = document.getElementById("enteredValues");
const resultingValues = document.getElementById("resultingValues");
//enteredValues.innerHTML = `<ol class="col" id ='entry${i}'></ol>`
let fileUploaded = false;

// Dynamic Input and Output Generation
for (const i of PARAMETER.fieldNames) {
  inputFields.innerHTML += `<div class="input-group col mx-0">
   <span class="input-group-text" id="inputtext_${i}">${i}</span>
   <input type="number" id="input${i}" class="form-control calc-inputs" placeholder="" aria-label="" aria-describedby="inputtext_${i}">
    </div>`;
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
  let check = true;
  if (fileUploaded) {
    return check;
  }
  for (const i of inputList) {
    if (!i.value) {
      i.style.border = "1px solid red";
      calculationResultElement.firstElementChild.innerHTML =
        "<li>Please fill the fields!</li>";
      check = false;
    }
  }
  return check;
}

function readFields() {
  //clear input elements
  //for (var member in fields) delete fields[member];
  const fields = {};
  // create fields
  if (checkFilledInputs()) {
    for (const i of inputList) {
      const fieldElementName = i.id.replace("input", "");
      fields[fieldElementName] = i.value;
      i.value = "";
    }
    // console.log(coordinateList[0]["X"]);
    coordinateList.push(fields);
    console.log(coordinateList);
  }
}

function processData(rawData) {
  const preprocessed = [];
  for (const i of PARAMETER.fieldNames) {
    preprocessed.push(rawData[i]); // put preprocessed data in the right order
  }
  return window[PARAMETER.functionName](...preprocessed); //window["functionName"](), calls function named functionName()
}

function printEnteredValues(upload = {}) {
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
  while (coordinateList.length > 1) {
    coordinateList.pop();
  }
}

function printResultValues() {
  resultingValues.classList.toggle("visually-hidden");
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
  //calculationResultElement.innerHTML = "<ol class='row'>" + resultText + "</ol>";
  converterRan = true;
}

function reset_calculator(softReset = false) {
  coordinateList = [];
  fileUploaded = false;
  for (const e of PARAMETER.fieldNames) {
    document.getElementById("entry" + e).innerHTML = `<p>${e}</p>`;
  }
  for (const r of PARAMETER.outputNames) {
    document.getElementById("result" + r).innerHTML = `<p>${r}</p>`;
  }
  if (converterRan) {
    resultingValues.classList.toggle("visually-hidden");
  }
  converterRan = false;
  if (softReset) {
    return;
  }
  for (const i of inputList) {
    i.value = "";
  }
}

const inputList = document.getElementsByClassName("calc-inputs");
const calculationResultElement = document.getElementById("results_text");
let coordinateList = []; // all coordinate inputs
let converterRan = false;

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
  if (checkFilledInputs()) {
    readFields();
    printEnteredValues();
  }
  if (coordinateList.length) {
    // converterRan = true;
    printResultValues();
    //resultTextBox.innerHTML = "<ol class='row'>" + resultText + "</ol>";
  } else {
    readFields();
  }
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
    if (checkDataValidity(data)) {
      printEnteredValues(data);
    } else {
      alert("Can't read the file!");
    }
    // for(const i of data) {
    //   printEnteredValues(i)
    // }
  };
}

function checkDataValidity(parsedJson) {
  //console.log(parsedJson);
  if (!parsedJson) {
    return false;
  }
  for (const line of parsedJson) {
    for (const input of PARAMETER.fieldNames) {
      console.log(line[input]);
      if (!line[input] && line[input] !== 0) {
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
  console.log(coordinates);
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

const inputElement = document.getElementById("file_upload");
inputElement.addEventListener("change", handleFiles, false);

document.getElementById("resetBtn").addEventListener("click", () => {
  reset_calculator();
});

// Output Field Element
const resultingValues = document.getElementById("resultingValues");

// Initial Parameters
let fileUploaded = false;
const inputElements = document.getElementsByClassName("calc-inputs");
const calculationResultElement = document.getElementById("results_text");
let coordinateList = []; // all coordinate inputs
let converterRan = false;
let currentFileType = "csv";
let parsedFileData;
const resultSet = [];

function checkFilledInputs() {
  // Checks if any input field is empty
  let check = true;

  for (const i of inputElements) {
    if (!i.value) {
      if (!fileUploaded && !coordinateList.length) {
        i.style.border = "1px solid red";
        alert("Please fill all the fields!");
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
    coordinateList.push(inputData);
    console.log("New Input:", inputData);
  }
}

function processData(rawData) {
  const preprocessed = [];
  const inputOutput = {};
  for (const i of PARAMETER.fieldNames) {
    preprocessed.push(rawData[i]); // put preprocessed data in the right order
  }
  const output = window[PARAMETER.functionName](...preprocessed); //window["functionName"](), calls function named functionName()
  inputOutput["input"] = preprocessed;
  inputOutput["output"] = output;
  resultSet.push(inputOutput);
  return output;
}

function printEnteredValues(upload = {}) {
  clearPrintedCoordinates();
  if (ENTERED_VALUES.parentElement.classList.contains("visually-hidden")) {
    ENTERED_VALUES.parentElement.classList.toggle("visually-hidden");
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
  for (const i of coordinateList) {
    const currentResult = processData(i);
    console.log(currentResult);
    for (let r = 0; r < currentResult.length; r++) {
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
  converterRan = true;
}

function clearPrintedCoordinates() {
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
  if (!ENTERED_VALUES.parentElement.classList.contains("visually-hidden")) {
    ENTERED_VALUES.parentElement.classList.toggle("visually-hidden");
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

function convertBtnHandler() {
  if (checkFilledInputs()) {
    readFields();
    printEnteredValues();
  }
  if (coordinateList.length) {
    printResultValues();
    downloadBtn.classList.toggle("visually-hidden");
  }
}

// 'Add new coordinate' button
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

// Reset button
document.getElementById("resetBtn").addEventListener("click", () => {
  reset_calculator();
});

function alert(text) {
  if (document.getElementsByClassName("alert").length) {
    return;
  }
  document.getElementById(
    "alert_box"
  ).innerHTML = `<div class='alert alert-danger alert-dismissible show fade' role='alert' ><strong>
  ${text}</strong>
  <button type='button' class='btn-close' data-bs-dismiss='alert' data-bs-f aria-label='Close'></button>
  </div>`;
}

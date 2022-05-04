const PARAMETER = calculations[CURRENT_CALCULATOR];
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
    if (i.id == "custom_ell") {
      document
        .getElementById("custom_ell_btn")
        .addEventListener("click", () => {
          const parameterA = $("#param_a")[0].value;
          const parameterB = $("#param_b")[0].value;
          if (
            parameterA &&
            parameterB &&
            !i.className.includes("btn-secondary")
          ) {
            console.log(i);
            ellipsoids.custom = [
              parseFloat(parameterA),
              parseFloat(parameterB),
            ];
            const oldSelection =
              document.getElementsByClassName("btn-secondary");
            oldSelection[0].classList.toggle("text-white");
            oldSelection[0].classList.toggle("btn-secondary");
            i.classList.toggle("text-white");
            i.classList.toggle("btn-secondary");
            currentEllipsoid = i.id;
          }
        });
    } else if (i.id != "custom_ell_btn") {
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

// Description Field
document.getElementById("calculationInfo").innerHTML = PARAMETER.description;


// Input Field Elements
const inputFields = document.getElementById("inputFields");
// Output Field Element
const ENTERED_VALUES = document.getElementById("printedEnteredValues");
// Dynamic Input and Output Generation
for (const i of PARAMETER.fieldNames) {
  if (i == "N/S") {
    inputFields.innerHTML += `<div class="input-group col mx-0">
    <span class="input-group-text" id="inputtext_${i}">${i}</span>
    <select class="" id="nsSelector">
      <option value="true">N</option>
      <option value="false">S</option>
    </select>
     </div>
     <input type="text" id="input${i}" value="true" class="d-none calc-inputs" >`;
  } else if (i == "UTM/TM") {
    inputFields.innerHTML += `<div class="input-group col mx-0">
    <span class="input-group-text" id="inputtext_${i}">${i}</span>
    <select class="" id="utmSelector">
      <option value="6">UTM</option>
      <option value="3">TM</option>
    </select>
     </div>
     <input type="number" value="6" id="input${i}" class="d-none calc-inputs" >`;
  } else {
    inputFields.innerHTML += `<div class="input-group col mx-0">
     <span class="input-group-text" id="inputtext_${i}">${i}</span>
     <input type="number" id="input${i}" class="form-control calc-inputs" placeholder="" aria-label="" aria-describedby="inputtext_${i}">
      </div>`;
  }
  ENTERED_VALUES.innerHTML += `<ol class="col" id ='entry${i}'><p>${i}</p></ol>`;
}
for (const i of PARAMETER.outputNames) {
  resultingValues.firstElementChild.innerHTML += `<ol class="col" id ='result${i}'><p>${i}</p></ol>`;
}

// File Upload Element
if (PARAMETER.canFileUpload) {
  addScript("./js/upload.js");
  document.getElementById("fileUpload").classList.toggle("visually-hidden");
}

if (PARAMETER.fieldNames.includes("N/S")) {
  const el = document.getElementById("nsSelector");
  el.addEventListener("click", () => {
    console.log(el.value);
    if (el.value == "3") {
      document.getElementById("inputN/S").value = 3;
    } else {
      document.getElementById("inputN/S").value = 6;
    }
  });
} 
if (PARAMETER.fieldNames.includes("UTM/TM")) {
  const el = document.getElementById("utmSelector");
  el.addEventListener("click", () => {
    console.log(el.value);
    if (el.value == "true") {
      document.getElementById("inputN/S").value = true;
    } else {
      document.getElementById("inputN/S").value = false;
    }
  });
}

//
const btnArea = document.getElementById("dataTypeBtns");
for (const btn of PARAMETER.dataTypes) {
  btnArea.innerHTML += `
<button class="btn btn-outline-dark data-type-btn" id="${btn}Btn">${btn}</button>`;
}

// Uploader modal - upload warnings!
let text = `<strong>For CSV:</strong> File has to start with column names of ${PARAMETER.fieldNames[0]}`;
for (const j of PARAMETER.fieldNames.slice(1, PARAMETER.inputFields)) {
  text += ` ,${j}`;
}
text += `. Seperated by commas.<br>Each row has have exactly ${PARAMETER.inputFields} columns of coordinates.`;
if (PARAMETER.canParseGeojson) {
  text +=
    "<br><strong>For GeoJson:</strong> Calculator assumes the Datum as WGS84.";
}
PARAMETER.uploadDescription = text;
document.getElementById("uploaderDesc").innerHTML = text;

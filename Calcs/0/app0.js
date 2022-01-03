
// Ellipsoid buttons 
const ellipsoidBtns = document
  .getElementById("ellipsoid_btn")
  .getElementsByTagName("button");
let currentEllipsoid = "wgs84";
for (const i of ellipsoidBtns) {
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

function readFields() {
  const inputList = document.getElementsByClassName("calc-inputs");
  let err = false;
  const coords = { X: "", Y: "", Z: "" };
  for (const i of inputList) {
    if (!i.value) {
      i.style.border = "1px solid red";
      resultTextBox.innerHTML = "<ol><li>Please fill the coordinates!</li></ol>";
      err = true;
    } else {
      const coordinateType = i.id.replace("input", "");
      coords[coordinateType] = i.value;
    }
  }
  if (!err) {
    for (const i of inputList) {
      i.value = "";
    }
    return coords;
  }
}

function printCoordinateList() {
  
  resultTextBox.innerHTML = '<ol class="row"></ol>';
  
  resultTextBox.innerHTML = "<ol class='row'>"+resultText+"</ol>";

}

const resultTextBox = document.getElementById("results_text");
const coordinateList = []; // all coordinate inputs

// Add coordinate button
const addCoordsBtn = document.getElementById("addCoords");
addCoordsBtn.addEventListener("click", () => {
  coordinateList.push(readFields());
  printCoordinateList(coordinateList);
});

// Convert button
const convertBtn = document.getElementById("convertBtn");
convertBtn.addEventListener("click", () => {
  let resultText = `<li>Latitude\tLongitude\tHeight</li>`;
  if (coordinateList.length) {
    for (const i of coordinateList) {
      const result = xyz2ell(i.X, i.Y, i.Z);
      resultText += `<li>${result[0]},${result[1]},${result[2]}</li>`;
      
    }
  } else {
    readFields();
  }
});

const inputElement = document.getElementById("file_upload");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */
  console.log(fileList[0]);
}

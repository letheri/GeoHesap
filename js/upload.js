
function checkFileValidity(fileList){
  if (fileList[0].name.includes(".csv")) {
    fileType = "csv";
    return fileType;
  } else if (
    fileList[0].name.includes(".geojson") &&
    PARAMETER.canParseGeojson
  ) {
    fileType = "geojson";
    return fileType;
  } else {
    alert("Invalid File!");
    return '';
  }
}

let fileList;

// Upload File Handler
function handleFiles() {
  fileUploaded = true;
  let fileType = "";
  fileList = this.files; /* now you can work with the file list */
  var reader = new FileReader();
  reader.readAsText(fileList[0]);
  reader.onload = function (event) {
    var fileContent = event.target.result;
    var data;
    fileType = checkFileValidity(fileList);
    switch (fileType) {
      case "csv":
        data = $.csv.toObjects(fileContent);
        break;
      case "geojson":
        json_data = JSON.parse(fileContent);
        data = geojson_parse(json_data);
        break;
    }
    
    // User information
    document.getElementById(
      "fileUploadStatus"
    ).innerText = `${data.length} coordinates were uploaded!`;

    // Data kept in global variable!
    parsedFileData = data;

  };
}

function checkParsedDataValidity(parsedJson) {
  if (!parsedJson[0]) {
    alert("Can't read the file!");
    return false;
  }
  for (const line of parsedJson) {
    for (const input of PARAMETER.fieldNames) {
      console.log(line[input]);
      if (!line[input] && line[input] !== 0) {
        alert("File has invalid coordinate data!");
        return false;
      }
    }
  }
  return true;
}

function geojson_parse(json) {
  const coordinates = [];
  json_features = turf.explode(json);
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

function uploadSetter(currentFileType) {
  // File upload element setting
  // Opened file selection screen has the below file extension selected.
  switch (currentFileType) {
    case "csv":
      uploadElement.accept = ".csv";
      break;
    case "GeoJson":
      uploadElement.accept = ".json, .geojson";
      break;
    case "Excel":
      uploadElement.accept = ".xls, .xlsx";
      break;
  }
}


const uploadElement = document.getElementById("file_upload");
uploadElement.addEventListener("change", handleFiles, false);


// Upload file button selection and functionality
const dataTypeBtns = document.getElementsByClassName("data-type-btn");
dataTypeBtns[0].classList.toggle("btn-secondary");
for (const btn of dataTypeBtns) {
  btn.addEventListener("click", () => {
    const currentlySelectedBtn =
    btn.parentElement.getElementsByClassName("btn-secondary")[0];
    if (btn.id == currentlySelectedBtn.id) {
      return;
    }
    currentlySelectedBtn.classList.toggle("btn-secondary");
    btn.classList.toggle("btn-secondary");
    currentFileType = btn.id.replace("Btn", "");
    uploadSetter(currentFileType);
  });
}


document.getElementById("importModalBtn").addEventListener("click", () => {
  coordinateList = coordinateList.concat(parsedFileData);
  if (checkParsedDataValidity(parsedFileData)) {
    printEnteredValues(parsedFileData);
  } else {
    reset_calculator(true);
  }
});
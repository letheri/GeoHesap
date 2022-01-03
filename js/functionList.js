let currentCalculator = window.location.href.split("?c=")[1] || "";
if (!window.location.href.includes("index") && currentCalculator == "") {
  window.location.href = "error.html";
}
const calculations = {
  xyz2geo: {
    fullname: "XYZ to Geographic",
    functionFileName: "Cart2Geog.js",
    functionName: "xyz2ell",
    ellipsoidUsage: true,
    inputFields: 3,
    fieldNames: ["X", "Y", "Z"], // Order is important
    //fieldUnits: ["meters","meters","meters"],
    outputNames: ["Latitude", "Longitude", "Height"],
    canReverseCalculate: true,
    reverseCalculationName: "geo2xyz",
    needsCommonFunctions: true,
    hasImage: true,
    imagePath: "/img/0.gif",
    canFileUpload: true,
    canParseGeojson: false
  },

  geo2xyz: {
    fullname: "Geographic to XYZ",
    functionFileName: "Cart2Geog.js",
    functionName: "ell2xyz",
    ellipsoidUsage: true,
    inputFields: 3,
    fieldNames: ["Latitude", "Longitude", "Height"],
    outputNames: ["X", "Y", "Z"], // Order is important
    canReverseCalculate: true,
    reverseCalculationName: "xyz2geo",
    needsCommonFunctions: true,
    hasImage: true,
    imagePath: "/img/0.gif",
    canFileUpload: true,
    canParseGeojson: true,
    geojsonTemplate: {"Latitude":0.0, "Longitude":0.0, "Height":0.0}
  },

  proj2geo: {
    fullname: "Projected to Geographic",
  },

  directInverse: {
    fullname: "Direct & Inverse",
  },

  geodesic: {
    fullname: "Geodesic",
  },

  datumTrans: {
    fullname: "Datum Transformtions",
    functionFileName: "Cart2Geog.js",
    functionName: "xyz2ell",
    ellipsoidUsage: true,
    inputFields: 3,
    fieldNames: ["X", "Y", "Z"], // Order is important
    //fieldUnits: ["meters","meters","meters"],
    outputNames: ["Latitude", "Longitude", "height"],
    canReverseCalculate: true,
    reverseCalculationName: "geo2xyz",
    needsCommonFunctions: true,
    hasImage: true,
    imagePath: "/img/0.gif",
    canFileUpload: true,
  },

  julian: {
    fullname: "Julian Date",
    functionFileName: "Julian.js",
    functionName: "JulianDate",
    ellipsoidUsage: false,
    inputFields: 6,
    fieldNames: ["Year", "Month", "Day", "Hour", "Minute", "Second"],
    outputNames: ["Julian Date"],
    canReverseCalculate: false,
    reverseCalculationName: "",
    needsCommonFunctions: false,
    hasImage: false,
    imagePath: "",
    canFileUpload: false,
  },
};

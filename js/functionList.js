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

  geodesicDirect: {
    fullname: "Direct Geodesic",
    functionFileName: "fundamental.js",
    functionName: "firstFund",
    ellipsoidUsage: true,
    inputFields: 4,
    fieldNames: ["Latitude", "Longitude","Distance", "Azimuth"], // Order is important
    //fieldUnits: ["meters","meters","meters"],
    outputNames: ["Latitude", "Longitude", "Azimuth"],
    canReverseCalculate: true,
    reverseCalculationName: "geodesicInverse",
    needsCommonFunctions: true,
    //hasImage: true,
    //imagePath: "/img/0.gif",
    canFileUpload: true,
    canParseGeojson: false
  },

  geodesicInverse: {
    fullname: "Inverse Geodesic",
    functionFileName: "fundamental.js",
    functionName: "secFund",
    ellipsoidUsage: true,
    inputFields: 4,
    fieldNames: ["Latitude1", "Longitude1","Latitude2", "Longitude2"], // Order is important
    //fieldUnits: ["meters","meters","meters"],
    outputNames: ["Azimuth1", "Azimuth2", "Distance"],
    canReverseCalculate: true,
    reverseCalculationName: "geodesicDirect",
    needsCommonFunctions: true,
    //hasImage: true,
    //imagePath: "/img/0.gif",
    canFileUpload: true,
    canParseGeojson: false
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
    canFileUpload: true,
    canParseGeojson: false
  },
};

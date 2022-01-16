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
    outputFields:3,
    fieldNames: ["X", "Y", "Z"], // Order is important
    outputNames: ["Latitude", "Longitude", "Height"],
    canReverseCalculate: true,
    reverseCalculationName: "geo2xyz",
    needsCommonFunctions: true,
    description: "Convert Cartesian coordinates to Geographic coordinates.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: false,
    dataTypes: ['csv','Excel']
  },

  geo2xyz: {
    fullname: "Geographic to XYZ",
    functionFileName: "Cart2Geog.js",
    functionName: "ell2xyz",
    ellipsoidUsage: true,
    inputFields: 3,
    outputFields:3,
    fieldNames: ["Latitude", "Longitude", "Height"],
    outputNames: ["X", "Y", "Z"], // Order is important
    canReverseCalculate: true,
    reverseCalculationName: "xyz2geo",
    needsCommonFunctions: true,
    description: "Convert Geographic coordinates to Cartesian coordinates.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: true,
    geojsonTemplate: {"Latitude":0.0, "Longitude":0.0, "Height":0.0},
    dataTypes: ['csv','Excel','GeoJson']
  }
,
  proj2geo: {
    fullname: "Projected to Geographic",
    functionFileName: "projected_ellipsoidal.js",
    functionName: "sagYukari_to_cog",
    ellipsoidUsage: true,
    inputFields: 3,
    outputFields:2,
    fieldNames: ["Easting", "Northing", "UTM/TM"],
    outputNames: ["Latitude", "Longitude"], // Order is important
    canReverseCalculate: true,
    reverseCalculationName: "geo2proj",
    needsCommonFunctions: true,
    description: "Convert Projected Map coordinates to Geographic coordinates.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: false,
    dataTypes: ['csv','Excel']
  },
  geo2proj: {
    fullname: "Geographic to Projected",
    functionFileName: "projected_ellipsoidal.js",
    functionName: "to_SagYukari",
    ellipsoidUsage: true,
    inputFields: 5,
    outputFields:2,
    fieldNames: ["Latitude", "Longitude", "Meridian", "UTM/TM", 'N/S'],
    outputNames: ["Easting", "Northing"], // Order is important
    canReverseCalculate: true,
    reverseCalculationName: "proj2geo",
    needsCommonFunctions: true,
    description: "Convert Geographic coordinates to Projected Map coordinates.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: false,
    dataTypes: ['csv','Excel']
  },

  geodesicDirect: {
    fullname: "Fundamental Problem (Direct)",
    functionFileName: "fundamental.js",
    functionName: "firstFund",
    ellipsoidUsage: true,
    inputFields: 4,
    outputFields:3,
    fieldNames: ["Latitude", "Longitude","Distance", "Azimuth"], // Order is important
    outputNames: ["Latitude", "Longitude", "Azimuth"],
    canReverseCalculate: true,
    reverseCalculationName: "geodesicInverse",
    needsCommonFunctions: true,
    description: "Calculate coordinates of a point with azimuth and geodesic distance.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: false,
    dataTypes: ['csv','Excel']
  },

  geodesicInverse: {
    fullname: "Fundamental Problem (Inverse)",
    functionFileName: "fundamental.js",
    functionName: "secFund",
    ellipsoidUsage: true,
    inputFields: 4,
    outputFields:3,
    fieldNames: ["Latitude1", "Longitude1","Latitude2", "Longitude2"], // Order is important
    outputNames: ["Azimuth1", "Azimuth2", "Distance"],
    canReverseCalculate: true,
    reverseCalculationName: "geodesicDirect",
    needsCommonFunctions: true,
    description: "Calculate azimuth between two points and their geodesic distance.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: false,
    dataTypes: ['csv','Excel']
  },

  julian: {
    fullname: "Julian Date",
    functionFileName: "Julian.js",
    functionName: "JulianDate",
    ellipsoidUsage: false,
    inputFields: 6,
    outputFields:1,
    fieldNames: ["Year", "Month", "Day", "Hour", "Minute", "Second"],
    outputNames: ["Julian Date"],
    canReverseCalculate: false,
    reverseCalculationName: "",
    needsCommonFunctions: false,
    description: "Calculate azimuth between two points and their geodesic distance.",
    uploadDescription: '',
    canFileUpload: true,
    canParseGeojson: false,
    dataTypes: ['csv','Excel']
  }
};



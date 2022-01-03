function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180/pi);
}

function degree_to_radians(degree) {
  var pi = Math.PI;
  return degree * (pi/180);
}

const ellipsoids = {
  // ellispoid major and minor axis'
  wgs84: [6378137, 6356752.314245],
  grs80: [6378137, 6356752.31414],
  hayford: [6378388, 6356911.9461],
  krass40: [6378245, 6356863.019],
  custom: []
};
let currentEllipsoid = "wgs84";

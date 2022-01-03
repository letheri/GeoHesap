function xyz2ell(x, y, z) {
  // ellipsoidal parameters from the selected button
  const a = ellipsoids[currentEllipsoid][0];
  const b = ellipsoids[currentEllipsoid][1];
  const e = ((a ** 2 - b ** 2) / a ** 2) ** 0.5; // square root of first eccentricity

  // latitude and longitude are in degrees, ellipsoidal height is in meters
  const lon = Math.atan(y / x); // ellipsoidal longitude
  const eN = 1e-4; // precision of curveture
  const eh = 1e-4; // precision of ellipsoidal height
  const elat = 1e-8; // precision of ellipsoidal latitude
  let N0 = a; // initial value of curveture
  let h0 = (x ** 2 + y ** 2 + z ** 2) ** 0.5 - (a * b) ** 0.5; // initial value of ellipsoidal height
  const p = (x ** 2 + y ** 2) ** 0.5; // magnitude of position vector
  let lat0 = Math.atan(z / (p * (1 - (e ** 2 * N0) / (N0 + h0)))); // initial value of ellipsoidal latitude
  let Ni;
  let hi;
  let lati;
  while (true) {
    Ni = a / (1 - e ** 2 * Math.sin(lat0) ** 2) ** 0.5;
    hi = p / Math.cos(lat0) - Ni;
    lati = Math.atan(z / (p * (1 - (e ** 2 * Ni) / (Ni + hi))));
    if (Math.abs(Ni - N0) <= eN && Math.abs(hi - h0) <= eh && Math.abs(lati - lat0) <= elat) {
      break;
    } else {
      N0 = Ni;
      h0 = hi;
      lat0 = lati;
    }
  }
  const latitude = radians_to_degrees(lati);
  const longitude = radians_to_degrees(lon);
  const height = hi;
  return [latitude, longitude, height];
}

function ell2xyz(fi, lam, h){
  //
  // ellipsoidal parameters
  const a = ellipsoids[currentEllipsoid][0];
  const b = ellipsoids[currentEllipsoid][1];
  const c = a**2 / b;
  const e2 = Math.sqrt((a**2 - b**2) / b**2)
  fi = degree_to_radians(fi);
  lam = degree_to_radians(lam);
  const N = c / Math.sqrt(1 + e2**2 * Math.cos(fi)**2);
  const X = (N + h) * Math.cos(fi) * Math.cos(lam);
  const Y = (N + h) * Math.cos(fi) * Math.sin(lam);
  const Z = (b**2 * N / a**2 + h) * Math.sin(fi);
  return [X, Y, Z]
}

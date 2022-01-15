function firstFund(fi, lam, dist, az) {
  // fi1: float - Latitude of Point
  // lam1: float - Longitude of Point
  // dist: float - Geodesic Distance from Point
  // az1: float - Azimuth from Point
  const fi1 = degree_to_radians(fi);
  const lam1 = degree_to_radians(lam);
  const az1 = degree_to_radians(az);
  const a = ellipsoids[currentEllipsoid][0];
  const b = ellipsoids[currentEllipsoid][1];
  const e2 = ((a ** 2 - b ** 2) / b ** 2) ** 0.5;
  const f = (a - b) / a;
  const beta1 = Math.atan(Math.tan(fi1) / Math.sqrt(1 + e2 ** 2));
  const sigma1 = Math.atan(Math.tan(beta1) / Math.cos(az1));
  const azEk = Math.asin(Math.cos(beta1) * Math.sin(az1));

  const u = e2 ** 2 * Math.cos(azEk) ** 2;

  const A = 1 + (u * (4096 + u * (-768 + u * (320 - 175 * u)))) / 16384;
  const B = (u * (256 + u * (-128 + u * (74 - u * 47)))) / 1024;

  let i = 0;
  let sigma = dist / (b * A);
  let DsigmaLast = 0;
  let iki_sigmaM;
  while (true) {
    iki_sigmaM = 2 * sigma1 + sigma;
    const Dsigma =
      B *
      Math.sin(sigma) *
      (Math.cos(iki_sigmaM) +
        (B / 4) *
          (Math.cos(sigma) * (-1 + 2 * Math.cos(iki_sigmaM) ** 2) -
            (B / 6) *
              Math.cos(iki_sigmaM) *
              (-3 + 4 * Math.sin(sigma) ** 2) *
              (-3 + 4 * Math.cos(iki_sigmaM) ** 2)));
    sigma = dist / (b * A) + Dsigma;

    if (Math.abs(Dsigma - DsigmaLast) < 10 ** -14 || i > 20) {
      break;
    } else {
      DsigmaLast = Dsigma;
      i += 1;
    }
  }

  const fi2 = Math.atan(
    (Math.sin(beta1) * Math.cos(sigma) +
      Math.cos(beta1) * Math.sin(sigma) * Math.cos(az1)) /
      ((1 - f) *
        Math.sqrt(
          Math.sin(azEk) ** 2 +
            (Math.sin(beta1) * Math.sin(sigma) -
              Math.cos(beta1) * Math.cos(sigma) * Math.cos(az1)) **
              2
        ))
  );

  const Dw = Math.atan(
    (Math.sin(sigma) * Math.sin(az1)) /
      (Math.cos(beta1) * Math.cos(sigma) -
        Math.sin(beta1) * Math.sin(sigma) * Math.cos(az1))
  );

  const C =
    (f / 16) * Math.cos(azEk) ** 2 * (4 + f * (4 - 3 * Math.cos(azEk) ** 2));
  const Dlam =
    Dw -
    (1 - C) *
      f *
      Math.sin(azEk) *
      (sigma +
        C *
          Math.sin(sigma) *
          (Math.cos(iki_sigmaM) +
            C * Math.cos(sigma) * (-1 + 2 * Math.cos(iki_sigmaM) ** 2)));

  const lam2 = lam1 + Dlam;

  let az2 =
    Math.atan(
      Math.sin(azEk) /
        (-Math.sin(beta1) * Math.sin(sigma) +
          Math.cos(beta1) * Math.cos(sigma) * Math.cos(az1))
    ) + Math.PI;
  if (az2 > 2 * Math.PI) {
    az2 = az2 - 2 * Math.PI;
  } else if (az2 < 0) {
    az2 = az2 + 2 * Math.PI;
  } else {
    az2 = az2;
  }
  console.log(
    radians_to_degrees(fi2),
    radians_to_degrees(lam2),
    radians_to_degrees(az2)
  );
  return [
    radians_to_degrees(fi2),
    radians_to_degrees(lam2),
    radians_to_degrees(az2),
  ];
}
function secFund(fi_1, lam_1, fi_2, lam_2) {
  // fi1: float - Latitude of First Point
  // lam1: float - Longitude of First Point
  // fi2: float - Latitude of Second Point
  // lam2: float - Longitude of Second Point
  const fi1 = degree_to_radians(fi_1);
  const lam1 = degree_to_radians(lam_1);
  const fi2 = degree_to_radians(fi_2);
  const lam2 = degree_to_radians(lam_2);

  const a = ellipsoids[currentEllipsoid][0];
  const b = ellipsoids[currentEllipsoid][1];
  const e2 = ((a ** 2 - b ** 2) / b ** 2) ** 0.5;
  const f = (a - b) / a;
  const beta1 = Math.atan(Math.tan(fi1) / Math.sqrt(1 + e2 ** 2));
  const beta2 = Math.atan(Math.tan(fi2) / Math.sqrt(1 + e2 ** 2));
  if (lam2 < 0) {
    Dl = lam1 - lam2;
  } else {
    Dl = lam2 - lam1;
  }

  if (Dl < 0) {
    Dl = -Dl;
  }

  let Dw = Dl;
  let DwLast = 0;
  let i = 0;
  let azEk;
  let sig;
  let cos2sig;
  while (true) {
    const sinSigkare =
      (Math.cos(beta2) * Math.sin(Dw)) ** 2 +
      (Math.cos(beta1) * Math.sin(beta2) -
        Math.sin(beta1) * Math.cos(beta2) * Math.cos(Dw)) **
        2;
    const cosSig =
      Math.sin(beta1) * Math.sin(beta2) +
      Math.cos(beta1) * Math.cos(beta2) * Math.cos(Dw);
    sig = Math.atan2(Math.sqrt(sinSigkare), cosSig);
    azEk = Math.asin(
      (Math.cos(beta1) * Math.cos(beta2) * Math.sin(Dw)) / Math.sin(sig)
    );
    cos2sig =
      Math.cos(sig) -
      (2 * Math.sin(beta1) * Math.sin(beta2)) / Math.cos(azEk) ** 2;
    const C =
      (f / 16) * Math.cos(azEk) ** 2 * (4 + f * (4 - 3 * Math.cos(azEk) ** 2));
    Dw =
      Dl +
      (1 - C) *
        f *
        Math.sin(azEk) *
        (sig +
          C *
            Math.sin(sig) *
            (cos2sig + C * Math.cos(sig) * (-1 + 2 * cos2sig ** 2)));
    if (Math.abs(DwLast - Dw) < 10 ** -14 || i > 20) {
      break;
    } else {
      DwLast = Dw;
      i += 1;
    }
  }
  const u = e2 ** 2 * Math.cos(azEk) ** 2;
  const A = 1 + (u * (4096 + u * (-768 + u * (320 - 175 * u)))) / 16384;
  const B = (u * (256 + u * (-128 + u * (74 - u * 47)))) / 1024;

  const Dsigma =
    B *
    Math.sin(sig) *
    (cos2sig +
      (B / 4) *
        (Math.cos(sig) * (-1 + 2 * cos2sig ** 2) -
          (B / 6) *
            cos2sig *
            (-3 + 4 * Math.sin(sig) ** 2) *
            (-3 + 4 * cos2sig ** 2)));
  const dist = b * A * (sig - Dsigma);
  let az1 =
    2 * Math.PI -
    Math.atan2(
      Math.cos(beta2) * Math.sin(Dw),
      Math.cos(beta1) * Math.sin(beta2) -
        Math.sin(beta1) * Math.cos(beta2) * Math.cos(Dw)
    );
  let az2 =
    2 * Math.PI -
    Math.atan2(
      Math.cos(beta1) * Math.sin(Dw),
      -Math.cos(beta2) * Math.sin(beta1) +
        Math.sin(beta2) * Math.cos(beta1) * Math.cos(Dw)
    ) -
    Math.PI;

  if (az1 < 0) {
    az1 += 2 * Math.PI;
  }
  if (az2 > 2 * Math.PI) {
    az2 = az2 - 2 * Math.PI;
  } else if (az2 < 0) {
    az2 = az2 + 2 * Math.PI;
  } else {
    az2 = az2;
  }
  return [radians_to_degrees(az1), radians_to_degrees(az2), dist];
}

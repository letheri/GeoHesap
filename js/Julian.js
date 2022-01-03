function JulianDate(y2, m2, d2, hour, minute, second) {
  var y = parseInt(y2); // year of the date
  console.log("eren");
  const m = parseInt(m2); // month of the date
  const d = parseInt(d2);
  let y1;
  let m1;
  if (m <= 2) {
    y1 = y - 1;
    m1 = m + 12;
  } else {
    y1 = y;
    m1 = m;
  }
  const UT1h = parseInt(hour); // hour of the date
  const UT1m = parseInt(minute); // minute of the date
  const UT1s = parseInt(second); // second of the date
  const UT1 = UT1h + UT1m / 60 + UT1s / 3600;
  return [
    parseInt(365.25 * y1) +
      parseInt(30.6001 * (m1 + 1)) +
      d +
      UT1 / 24 +
      1720981.5,
  ];
}

//const Modified_julian_date = JulianDate(1950, 1, 1, 1, 1, 1) - 2400000.5;

//console.log(JulianDate(1950, 1, 1, 1, 1, 1));
//console.log(Modified_julian_date);

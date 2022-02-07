function to_SagYukari(fi_,lam_, type){
    // fi_: float - Latitude of Point
  // lam_: float - Longitude of Point
  // type: int - Central Meridian Type in Degrees (UTM, TM)
  if (typeof type === 'string' || type instanceof String) {
    type_ = parseInt(type)
  } else {
    type_ = type
  }
  if (type_!= 6 && type_ != 3 ) {
    reset_calculator(false);
    console.error('Invalid values entered. Type:',type);
    return
  }
  let centralMeridian;
  if (type_ == 3) {
    centralMeridian = (parseInt((lam_+1.5)/3))*3;
  } else {
    centralMeridian = (parseInt(lam_/6))*6 +3
  }
  const fi = degree_to_radians(fi_);
  let lam = degree_to_radians(lam_);
  const der = degree_to_radians(centralMeridian);
  
  const a = ellipsoids[currentEllipsoid][0];
  const b = ellipsoids[currentEllipsoid][1];
  const c = a**2 / b
  const e1 = ((a ** 2 - b ** 2) / a ** 2) ** 0.5;
  const e2 = ((a ** 2 - b ** 2) / b ** 2) ** 0.5;

   const N = c / Math.sqrt(1 + e2**2 * Math.cos(fi)**2)
    
   const A0 = 1- e1**2 /4 - 3*e1**4 /64 -5*e1**6 /256 -175*e1**8 /16384
    
   const A2 = 3/8 *(e1**2 +e1**4 /4+ 15*e1**6 /128- 455*e1**8 /4096)
    
   const A4 = 15/256*(e1**4 +3*e1**6 /4 - 77*e1**8/128)
    
   const A6 = 35/3072*(e1**6 -41*e1**8 /32)
    
   const A8 = (-315)/131072 *e1**8
    
   const Sfi = a*(A0*fi-A2*Math.sin(2*fi) + A4* Math.sin(4*fi) - A6 *Math.sin(6*fi) + A8 *Math.sin(8*fi))
    
    lam = lam - der
    const u = lam*Math.cos(fi)
    
    t = Math.tan(fi)
    
    const  n_squared = (e2**2)*Math.cos(fi)**2;
    
    let x = N*(u+u**3 /6*(1-t**2 +n_squared)+ u**5 /120 *(5- 18*t**2 + t**4 +14*n_squared - 58*t**2 
           * n_squared+ 13*n_squared**2 +4 *n_squared**3 -64 *n_squared**2 *t**2 -24*n_squared**3 
           *t**2)+ u**7 /5040 *(61- 479*t**2 +179*t**4 -t**6))
    let y = N*(Sfi/N+lam**2 *Math.sin(fi)* Math.cos(fi)/ 2+ lam**4 *Math.sin(fi)* Math.cos(fi)**3 / 24 *
           (5-t**2 +9*n_squared +4*n_squared**2)+lam**6 *Math.sin(fi)* Math.cos(fi)**5 /720 *(61- 
           58 *t**2 +t**4 +270*n_squared +445*n_squared**2 +324*n_squared**3- 680*n_squared**2 * 
           t**2 +88*n_squared**4 -600*n_squared**4 -600*n_squared**3 *t**2 -192*n_squared**4 *t**2)+ 
           lam**8 *Math.sin(fi)* Math.cos(fi)**7 /40320 *(1385- 311*t**2 +543*t**4 -t**6))
    
    
    const conv = lam*Math.sin(fi)*(1+ lam**2 *Math.cos(fi)**2 /3 *(1+3*n_squared+2*n_squared**2)+lam**4 * Math.cos(fi)**4 /15* (2-t**2))
    if (fi_ <0) {
        return [x+500000,+ 10000000]
    } else {
        return [x+500000,y]
    }
}
function sagYukari_to_cog(x_,y_,centralMeridian, type, isNorth = true) {
    // x_: float - Easting
  // y_: float - Northing
  // centralMeridian: int - Geodesic Distance from Point
  // type: int - Central Meridian Type in Degrees (UTM, TM)
  let type_;
  let CM;
  let north;
  if (typeof type === 'string' || type instanceof String) {
    type_ = parseInt(type)
  } else {
    type_ = type
  }
  if (typeof centralMeridian === 'string' || centralMeridian instanceof String) {
    CM = parseInt(centralMeridian)
  } else {
    type_ = type
  }
  if (isNorth == 'true') {
    north = true;
  } else if (isNorth== 'false') {
    north = false;
  } else {
    north = isNorth;
  }
  let x;
  let y;
  if (!north) {
     x = degree_to_radians(parseFloat(x_)- 500000);
     y = degree_to_radians(parseFloat(y_) - 10000000);
  } else {
     x = degree_to_radians(parseFloat(x_)- 500000);
     y = degree_to_radians(parseFloat(y_));
  }
  const der = degree_to_radians(CM);

  // if ((type_== 6 && CM%6 == 0 )||( type_ == 3 && CM%3 == 0 ) ) {
  //   reset_calculator(false);
  //   console.error('Invalid values entered. Type:',type_,'DOM:',CM);
  //   return
  // }
  const a = ellipsoids[currentEllipsoid][0];
  const b = ellipsoids[currentEllipsoid][1];
  const c = a**2 / b
  const e1 = ((a ** 2 - b ** 2) / a ** 2) ** 0.5;
  const e2 = ((a ** 2 - b ** 2) / b ** 2) ** 0.5;
  const f = (a-b)/a
    const n = f /(2-f)
    const Asig = (y/(a/(1+n)*(1+n*n/4+n**4 /64)))
    
    const F2 = (3/2*n-27/32*n**3)
    
    const F4 = 21/16*n**2 -55/32*n**4
    
    const F6 = 151/96*n**3
    
    const F8 = 1097/512*n**4

    let fi = Asig +F2*Math.sin(2*Asig)+F4*Math.sin(4*Asig)+F6*Math.sin(6*Asig)+F8*Math.sin(8*Asig)

    const N = c / Math.sqrt(1 + e2**2 * Math.cos(fi)**2)
    
    const M = a * (1- e1**2) / (1-e1**2 *Math.sin(fi)**2)**(3/2)
    
    const t = Math.tan(fi)

    const n_squared = (e2**2)*Math.cos(fi)**2

    const b01 = 180/Math.PI /N/Math.cos(fi)*3600

    const b02 = t*180/Math.PI/2/N**2 *(-1-n_squared)*3600
    
    const  b03 = -(180/Math.PI/6/N**3 /Math.cos(fi)*(1+2*t**2+n_squared))*3600
    
    const b04 = t*180/Math.PI/24/N**4 *(5+3*t**2+ 6*n_squared -6*n_squared *t**2)*3600
    
    const b05 = 180/Math.PI/120/N**5 /Math.cos(fi) *(5+ 28*t**2 +24*t**4)*3600
    
    const dfi = b02*x**2 + b04*x**4

    const dlam = b01*x +b03*x**3 +b05*x**5

    fi = fi + (dfi/3600*Math.PI/180)
    let lam = der *Math.PI/180 + dlam /3600 *Math.PI/180

    const conv = t*180/Math.PI*x/N-t*180/Math.PI/3/N**3 *(1+t**2 -n_squared)*x**3
    return [fi,lam]
}
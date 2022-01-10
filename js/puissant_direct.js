function puissant_direct (long1, lat1, S12, azi12) {
    lat1 = degree_to_radians(lat1);
    long1 = degree_to_radians(long1);
    azi12 = degree_to_radians(azi12);
	const parameter = ellipsoidal_paramaters(lat1)
    const a = parameter.a
    const b = parameter.b
    const e = parameter.e
    const N1 = parameter.N
    const M1 = parameter.M
    console.log(parameter.M,' ',parameter.N)
    
    const  dlat_approximate1 = S12 * Math.cos(azi12) / N1;
    const dlat_approximate2 = -1*S12 ** 2 * Math.tan(lat1) * Math.sin(azi12) ** 2 / (2 * N1**2) ;
    const dlat_approximate3 = -1*S12 ** 3 * Math.cos(azi12) * Math.sin(azi12) ** 2 * (1 + 3* Math.tan(lat1)**2) / (6 * N1**3);
    const dlat_approximate = dlat_approximate1 + dlat_approximate2+ dlat_approximate3
    console.log(dlat_approximate1 + dlat_approximate2+ dlat_approximate3);

    const dlat = (dlat_approximate1 * N1 / M1 + dlat_approximate2 * N1 / M1 + dlat_approximate3 * N1 / M1) * (1 - (3 * e**2 * Math.sin(lat1) * Math.cos(lat1) / (2 * (1 - e**2 * (Math.sin(lat1))**2)))* dlat_approximate) 
}
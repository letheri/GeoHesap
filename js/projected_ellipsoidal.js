function to_SagYukarı(a,b,c,fi,lam,der,e1,e2){

    N = c / Math.sqrt(1 + e2**2 * Math.cos(fi)**2)
    
    A0 = 1- e1**2 /4 - 3*e1**4 /64 -5*e1**6 /256 -175*e1**8 /16384
    
    A2 = 3/8 *(e1**2 +e1**4 /4+ 15*e1**6 /128- 455*e1**8 /4096)
    
    A4 = 15/256*(e1**4 +3*e1**6 /4 - 77*e1**8/128)
    
    A6 = 35/3072*(e1**6 -41*e1**8 /32)
    
    A8 = (-315)/131072 *e1**8
    
    Sfi = a*(A0*fi-A2*Math.sin(2*fi) + A4* Math.sin(4*fi) - A6 *Math.sin(6*fi) + A8 *Math.sin(8*fi))
    
    lam = lam - der
    u = lam*Math.cos(fi)
    
    t = Math.tan(fi)
    
    n_squared = (e2**2)*Math.cos(fi)**2
    
    x = N*(u+u**3 /6*(1-t**2 +n_squared)+ u**5 /120 *(5- 18*t**2 + t**4 +14*n_squared - 58*t**2 
           * n_squared+ 13*n_squared**2 +4 *n_squared**3 -64 *n_squared**2 *t**2 -24*n_squared**3 
           *t**2)+ u**7 /5040 *(61- 479*t**2 +179*t**4 -t**6))
    y = N*(Sfi/N+lam**2 *Math.sin(fi)* Math.cos(fi)/ 2+ lam**4 *Math.sin(fi)* Math.cos(fi)**3 / 24 *
           (5-t**2 +9*n_squared +4*n_squared**2)+lam**6 *Math.sin(fi)* Math.cos(fi)**5 /720 *(61- 
           58 *t**2 +t**4 +270*n_squared +445*n_squared**2 +324*n_squared**3- 680*n_squared**2 * 
           t**2 +88*n_squared**4 -600*n_squared**4 -600*n_squared**3 *t**2 -192*n_squared**4 *t**2)+ 
           lam**8 *Math.sin(fi)* Math.cos(fi)**7 /40320 *(1385- 311*t**2 +543*t**4 -t**6))
    
    
    conv = lam*Math.sin(fi)*(1+ lam**2 *Math.cos(fi)**2 /3 *(1+3*n_squared+2*n_squared**2)+lam**4 * Math.cos(fi)**4 /15* (2-t**2))

    return x,y
}
function sagYukari_to_cog(a,b,c,x,y,der,e1,e2) {
    f = (a-b)/a
    n = f /(2-f)
    Asig = (y/(a/(1+n)*(1+n*n/4+n**4 /64)))
    
    F2 = (3/2*n-27/32*n**3)
    
    F4 = 21/16*n**2 -55/32*n**4
    
    F6 = 151/96*n**3
    
    F8 = 1097/512*n**4
    
    fi = Asig +F2*Math.sin(2*Asig)+F4*Math.sin(4*Asig)+F6*Math.sin(6*Asig)+F8*Math.sin(8*Asig)

    N = c / Math.sqrt(1 + e2**2 * Math.cos(fi)**2)
    
    M = a * (1- e1**2) / (1-e1**2 *Math.sin(fi)**2)**(3/2)
    
    t = Math.tan(fi)
    
    n_squared = (e2**2)*Math.cos(fi)**2
    
    b01 = 180/Math.pi /N/Math.cos(fi)*3600
    
    b02 = t*180/Math.pi/2/N**2 *(-1-n_squared)*3600
    
    b03 = -(180/Math.pi/6/N**3 /Math.cos(fi)*(1+2*t**2+n_squared))*3600
    
    b04 = t*180/Math.pi/24/N**4 *(5+3*t**2+ 6*n_squared -6*n_squared *t**2)*3600
    
    b05 = 180/Math.pi/120/N**5 /Math.cos(fi) *(5+ 28*t**2 +24*t**4)*3600
    
    dfi = b02*x**2 + b04*x**4

    dlam = b01*x +b03*x**3 +b05*x**5

    fi = fi + (dfi/3600*Math.pi/180)
    lam = der *Math.pi/180 + dlam /3600 *Math.pi/180


    conv = t*180/Math.pi*x/N-t*180/Math.pi/3/N**3 *(1+t**2 -n_squared)*x**3
    return fi,lam
}
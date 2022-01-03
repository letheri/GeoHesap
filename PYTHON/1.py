# 010140620
# Deniz Topçu

import math

a = 6378137.0000  # semi-major axis in meters
b = 6356752.3141  # semi-minor axis in meters
e = ((a**2 - b**2) / a**2)**0.5  # square root of first eccentricity

  

def ell2xyz(latitude, longitude, ellHeight):
# latitude and longitude are in degrees, ellipsoidal height is in meters
    lat = (latitude * math.pi) / 180  # converting degree to radian
    lon = (longitude * math.pi) / 180
    h = ellHeight
    N = a / (1 - e**2 * (math.sin(lat))**2 )**0.5  #  radius of curvature
    x = (N + h) * math.cos(lat) * math.cos(lon)
    y = (N + h) * math.cos(lat) * math.sin(lon)
    z = ((1 - e**2) * N + h) * math.sin(lat)
    return x, y, z



def xyz2ell(x, y, z):
# latitude and longitude are in degrees, ellipsoidal height is in meters 
    lon = math.atan(y / x)  # ellipsoidal longitude
    eN = 1e-4  # precision of curveture 
    eh = 1e-4  # precision of ellipsoidal height
    elat = 1e-8  # precision of ellipsoidal latitude
    N0 = a  # initial value of curveture
    h0 = (x**2 + y**2 + z**2)**0.5 - (a * b)**0.5 # initial value of ellipsoidal height
    p = (x**2 + y**2)**0.5  # magnitude of position vector
    lat0 = math.atan(z / (p * (1 - (e**2 * N0) / (N0 + h0))))  # initial value of ellipsoidal latitude
    while True:
        Ni = a / (1 - e**2 * (math.sin(lat0))**2)**0.5
        hi = (p / math.cos(lat0)) - Ni
        lati = math.atan(z / (p * (1 - (e**2 * Ni) / (Ni + hi))))
        if abs(Ni - N0) <= eN and abs(hi - h0) <= eh and abs(lati - lat0) <= elat:
            break
        else:
            N0 = Ni
            h0 = hi
            lat0 = lati

    latitude = math.degrees(lati)
    longitude = math.degrees(lon)
    height = hi
    return latitude, longitude, height



def degree2dms(decimal, decimal_621):
    degree = int(decimal)
    minute = int((decimal - degree) * 60)
    second =(((decimal - degree) * 60) - minute) * 60
    dms = str(degree)+" "+str(abs(minute))+" "+str(abs(second))
    degree_621 = int(decimal_621)
    minute_621 = int((decimal_621 - degree_621) * 60)
    second_621 =(((decimal_621 - degree_621) * 60) - minute_621) * 60
    dms_621 = str(degree_621)+" "+str(abs(minute_621))+" "+str(abs(second_621))
    return dms, dms_621

def dms2degree(dlat, mlat, slat, dlon, mlon, slon):
    declat = dlat + mlat/60 + slat/3600
    declon = dlon + mlon/60 + slon/3600
    return declat, declon
    


    
print(xyz2ell(4208830.02200000,2334850.56600000,4171267.38400000))
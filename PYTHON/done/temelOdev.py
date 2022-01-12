import numpy as np
#____Vincenty yöntemi_____
class Ellipsoid:
	def __init__(self, a, b):
		self.a = a
		self.b = b
		self.c = self.a**2 / self.b
	def flattening(self):
		f = (self.a - self.b) / self.a
		return f
	def eccentricity(self):
		e1 = np.sqrt((self.a**2 - self.b**2) / self.a**2)
		e2 = np.sqrt((self.a**2 - self.b**2) / self.b**2) 
		return e1, e2

def to_dec(deg,minu,sec):
    if deg>0:
        dec = deg+(minu + sec / 60)/60
    else:
        dec = deg-(minu + sec / 60)/60
    return dec
def to_deg(dec):
    deg = int(dec)
    minu = int((dec-deg)*60)
    sec = round(float((((dec-deg)*60)-minu)*60),8)
    if sec == 60:
        sec = 0.000000
        minu += 1
    return deg, minu, sec

def firstFund(a,b,f,e2,fi1,lam1,dist,az1):
    
    beta1 = np.arctan(np.tan(fi1) / np.sqrt(1+e2**2))
    sigma1 = np.arctan(np.tan(beta1)/np.cos(az1))
    azEk = np.arcsin(np.cos(beta1)*np.sin(az1))
    
    u = (e2**2)*np.cos(azEk)**2
    
    A = 1 + u * (4096+u*(-768+u*(320 - 175 * u))) / 16384
    B = u * (256 + u * (-128+u *(74-u * 47))) / 1024
    
    i = 0
    sigma = dist/(b * A)
    DsigmaLast = 0
    while (True):
        
        iki_sigmaM = 2*sigma1 + sigma
        Dsigma= B * np.sin(sigma)*(np.cos(iki_sigmaM) + (B/4)*(np.cos(sigma)*(-1 + 2*np.cos(iki_sigmaM)**2)-B/6 * np.cos(iki_sigmaM)*(-3 + 4*np.sin(sigma)**2)*(-3 + 4* np.cos(iki_sigmaM)**2)))
        sigma = dist/(b * A) + Dsigma
        
        if (abs(Dsigma - DsigmaLast) < (10**(-14))):
            break
        else:
            DsigmaLast = Dsigma
            i += 1
    
    
    fi2 = np.arctan(  (np.sin(beta1)*np.cos(sigma) + np.cos(beta1)*np.sin(sigma)*np.cos(az1)) /
                    ((1-f) * np.sqrt(np.sin(azEk)**2 +(np.sin(beta1)*np.sin(sigma)
                    - np.cos(beta1)*np.cos(sigma)*np.cos(az1))**2 )) )
  
    Dw = np.arctan((np.sin(sigma)*np.sin(az1))/(np.cos(beta1)*np.cos(sigma)-np.sin(beta1)*np.sin(sigma)*np.cos(az1)))
    
    C = f/16 * np.cos(azEk)**2 * (4+ f*(4 - 3*np.cos(azEk)**2))
    Dlam = Dw - (1-C)*f*np.sin(azEk)*(sigma + C*np.sin(sigma)*(np.cos(iki_sigmaM)+ C*np.cos(sigma)*(-1 + 2*np.cos(iki_sigmaM)**2)))
    
    lam2 = lam1+Dlam
    
    az2 = np.arctan(np.sin(azEk) / (-np.sin(beta1)*np.sin(sigma) + np.cos(beta1)*np.cos(sigma)*np.cos(az1))) + np.pi
    if az2 > 2*np.pi:
        az2 = az2- 2 *np.pi
    elif az2 < 0:
        az2 = az2 + 2*np.pi
    else:
        az2 = az2
    return fi2,lam2,az2

def secFund(a,b,f,e2,fi1,lam1,fi2,lam2):
    beta1 = np.arctan(np.tan(fi1) / np.sqrt(1+e2**2))
    beta2 = np.arctan(np.tan(fi2) / np.sqrt(1+e2**2))
    if lam2 < 0 :
        Dl = lam1 -lam2
    else:
        Dl = lam2 - lam1
        
    if Dl<0:
        Dl = -Dl
        
    Dw = Dl
    DwLast = 0
    i=0
    while (True):
        sinSigkare = (np.cos(beta2)*np.sin(Dw))**2 +(np.cos(beta1)*np.sin(beta2) - np.sin(beta1)*np.cos(beta2)*np.cos(Dw))**2
        cosSig = np.sin(beta1)*np.sin(beta2) + np.cos(beta1)*np.cos(beta2)*np.cos(Dw)
        sig = np.arctan2(np.sqrt(sinSigkare) , cosSig)
        azEk = np.arcsin(np.cos(beta1)*np.cos(beta2)*np.sin(Dw) / np.sin(sig))
        cos2sig = np.cos(sig) - 2* np.sin(beta1)*np.sin(beta2) / np.cos(azEk)**2
        C = f / 16 * np.cos(azEk)**2 * (4 +f * (4- 3 * np.cos(azEk)**2))
        Dw = Dl + (1- C)*f * np.sin(azEk)*(sig+C*np.sin(sig)*(cos2sig+C * np.cos(sig)*(-1 + 2* cos2sig**2)))   
        if abs(DwLast-Dw)<10**(-14):
            break
        else:
            DwLast = Dw
            i+=1
    
    u = e2**2 * (np.cos(azEk))**2
    A = 1 + u * (4096+u*(-768+u*(320 - 175 * u))) / 16384
    B = u * (256 + u * (-128+u *(74-u * 47))) / 1024
    
    Dsigma= B * np.sin(sig)*(cos2sig + (B/4)*(np.cos(sig)*(-1 + 2*cos2sig**2) - B/6 * cos2sig*(-3 + 4*np.sin(sig)**2)*(-3 + 4* cos2sig**2)))
    dist = b* A * (sig - Dsigma)
    az1 = 2*np.pi - np.arctan2( np.cos(beta2)*np.sin(Dw) , (np.cos(beta1)*np.sin(beta2) - np.sin(beta1)*np.cos(beta2)*np.cos(Dw)) )
    az2 = 2*np.pi - np.arctan2( np.cos(beta1)*np.sin(Dw) , ((-np.cos(beta2))*np.sin(beta1) + np.sin(beta2)*np.cos(beta1)*np.cos(Dw))) - np.pi

    if az1 < 0:
        az1 += 2* np.pi
    if az2 > 2*np.pi:
        az2 = az2- 2 *np.pi
    elif az2 < 0:
        az2 = az2 + 2*np.pi
    else:
        az2 = az2
    return az1, az2,dist
    
print("Jeodezik hesaplamalar\n1)\t1. Temel Ödev\n2)\t2. Temel Ödev\n")
while (True):
    try :
        my_list=[1,2]
        i = int(input("(1/2) ??:\t"))
        if i<0:
            i=0
            print("negatif sayi girilmez")
        1/i
        my_list[i-1]
        break
    except ZeroDivisionError:
        print("sinir aşimi")
    except IndexError as e:
        e = "sinir aşimi"
        print(e)
    except ValueError:
        print("hatali giriş")

print ("choose ellipsoid \n1)\tGRS80\n2)\tHayford(Int. 1924)\n3)\tWGS84\n4)\tKrassovsky 1940\n5)\tKullanici tanimli Ellipsoid")

while (True):
    try :
        my_list=[1,2,3,4,5]
        x = int(input("(1/2/3/4/5) ??:\t"))
        if x<0:
            x=0
            print("negatif sayi girilmez")
        1/x
        my_list[x-1]
        break
    except ZeroDivisionError:
        print("sinir aşimi")
    except IndexError as e:
        e = "sinir aşimi"
        print(e)
    except ValueError:
        print("hatali giriş")

if (x==1) :
    grs80 = Ellipsoid(a=6378137.000, b=6356752.3141)
    a = grs80.a
    b = grs80.b
    c = grs80.c
    f = grs80.flattening()
    (e1, e2) = grs80.eccentricity()
elif(x==2) :   
    hayford = Ellipsoid(a = 6378388.000,b = 6356911.946128)
    a = hayford.a
    b = hayford.b
    c = hayford.c
    f = hayford.flattening()
    (e1,e2) = hayford.eccentricity()
elif (x==3):
    wgs84 = Ellipsoid(a=6378137.000, b=6356752.3142)
    a = wgs84.a
    b = wgs84.b
    c = wgs84.c
    f = wgs84.flattening()
    (e1,e2) = wgs84.eccentricity()
elif (x==4):
    krasovsky = Ellipsoid(a = 6378245.000,b = 6356863.018773)
    a = krasovsky.a
    b = krasovsky.b
    c = krasovsky.c
    f = krasovsky.flattening()
    (e1,e2)= krasovsky.eccentricity()
elif (x == 5):
    a = float(input("a ekseni gir:\t"))
    b = float(input("b ekseni gir:\t"))
    kullanici = Ellipsoid(a,b)
    c = kullanici.c
    f = kullanici.flattening()
    (e1,e2)= kullanici.eccentricity()


if i ==1:
    fi1 = to_dec(int(input("Enlem Derece\t:")),int(input("Enlem Dakika\t:")),float(input("Enlem Saniye\t:")))
    lam1 = to_dec(int(input("Boylam Derece\t:")),int(input("Boylam Dakika\t:")),float(input("Boylam Saniye\t:")))
    az1 = to_dec(int(input("Azimuth Derece\t:")),int(input("Azimuth Dakika\t:")),float(input("Azimuth Saniye\t:")))
    dist = float(input("Mesafe(S metre)\t:"))
    (fi2,lam2,az2) = firstFund(a,b,f,e2,fi1/ 180 * np.pi,lam1/ 180 * np.pi, dist, az1/ 180 * np.pi)
    print(to_deg(fi2*180/np.pi))
    print(to_deg(lam2*180/np.pi))
    print(to_deg(az2*180/np.pi))
elif i==2:
    fi1 = to_dec(int(input("1. noktanin\nEnlem Derece\t:")),int(input("Enlem Dakika\t:")),float(input("Enlem Saniye\t:")))
    lam1 = to_dec(int(input("1. noktanin\nBoylam Derece\t:")),int(input("Boylam Dakika\t:")),float(input("Boylam Saniye\t:")))
    fi2 = to_dec(int(input("2. noktanin\nEnlem Derece\t:")),int(input("Enlem Dakika\t:")),float(input("Enlem Saniye\t:")))
    lam2 = to_dec(int(input("2. noktanin\nBoylam Derece\t:")),int(input("Boylam Dakika\t:")),float(input("Boylam Saniye\t:")))
    (az1,az2,dist) = secFund(a,b,f,e2,fi1/ 180 * np.pi,lam1/ 180 * np.pi,fi2/ 180 * np.pi,lam2/ 180 * np.pi)
    print(to_deg(az1*180/np.pi))
    print(to_deg(az2*180/np.pi))
    print(dist)
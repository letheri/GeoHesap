import numpy as np
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

def to_SagYukarı(a,b,c,fi,lam,der,e1,e2):
    N = c / np.sqrt(1 + e2**2 * np.cos(fi)**2)
    print("N:",N)
    A0 = 1- e1**2 /4 - 3*e1**4 /64 -5*e1**6 /256 -175*e1**8 /16384
    print("\nA0:",A0)
    A2 = 3/8 *(e1**2 +e1**4 /4+ 15*e1**6 /128- 455*e1**8 /4096)
    print("\nA2:",A2)
    A4 = 15/256*(e1**4 +3*e1**6 /4 - 77*e1**8/128)
    print("\nA4:",A4)
    A6 = 35/3072*(e1**6 -41*e1**8 /32)
    print("\nA6:",A6)
    A8 = (-315)/131072 *e1**8
    print("\nA8:",A8)
    Sfi = a*(A0*fi-A2*np.sin(2*fi) + A4* np.sin(4*fi) - A6 *np.sin(6*fi) + A8 *np.sin(8*fi))
    print("Sfi:",Sfi)
    lam = lam - der
    u = lam*np.cos(fi)
    print("\nu:",u)
    t = np.tan(fi)
    print("\nt:",t)
    n_squared = (e2**2)*np.cos(fi)**2
    print("\nnü:",n_squared)
    x = N*(u+u**3 /6*(1-t**2 +n_squared)+ u**5 /120 *(5- 18*t**2 + t**4 +14*n_squared - 58*t**2 
           * n_squared+ 13*n_squared**2 +4 *n_squared**3 -64 *n_squared**2 *t**2 -24*n_squared**3 
           *t**2)+ u**7 /5040 *(61- 479*t**2 +179*t**4 -t**6))
    y = N*(Sfi/N+lam**2 *np.sin(fi)* np.cos(fi)/ 2+ lam**4 *np.sin(fi)* np.cos(fi)**3 / 24 *
           (5-t**2 +9*n_squared +4*n_squared**2)+lam**6 *np.sin(fi)* np.cos(fi)**5 /720 *(61- 
           58 *t**2 +t**4 +270*n_squared +445*n_squared**2 +324*n_squared**3- 680*n_squared**2 * 
           t**2 +88*n_squared**4 -600*n_squared**4 -600*n_squared**3 *t**2 -192*n_squared**4 *t**2)+ 
           lam**8 *np.sin(fi)* np.cos(fi)**7 /40320 *(1385- 311*t**2 +543*t**4 -t**6))
    print("x:",x)
    print("y:",y)
    conv = lam*np.sin(fi)*(1+ lam**2 *np.cos(fi)**2 /3 *(1+3*n_squared+2*n_squared**2)+lam**4 * np.cos(fi)**4 /15* (2-t**2))
    print("meridyen yakınsama: ",conv*180/np.pi)
    return x,y

def sagYukari_to_cog(a,b,c,x,y,der,e1,e2):
    f = (a-b)/a
    n = f /(2-f)
    Asig = (y/(a/(1+n)*(1+n*n/4+n**4 /64)))
    print("\nalfasigma:",Asig)
    F2 = (3/2*n-27/32*n**3)
    print("\nF2:",F2)
    F4 = 21/16*n**2 -55/32*n**4
    print("\nF4:",F4)
    F6 = 151/96*n**3
    print("\nF6:",F6)
    F8 = 1097/512*n**4
    print("\nF8:",F8)
    fi = Asig +F2*np.sin(2*Asig)+F4*np.sin(4*Asig)+F6*np.sin(6*Asig)+F8*np.sin(8*Asig)
    print(fi*180/np.pi)
    N = c / np.sqrt(1 + e2**2 * np.cos(fi)**2)
    print("\nN:",N)
    M = a * (1- e1**2) / (1-e1**2 *np.sin(fi)**2)**(3/2)
    print("\nM:",M)
    t = np.tan(fi)
    print("\nt:",t)
    n_squared = (e2**2)*np.cos(fi)**2
    print("\nnü:",n_squared)
    b01 = 180/np.pi /N/np.cos(fi)*3600
    print("b01:",b01)
    b02 = t*180/np.pi/2/N**2 *(-1-n_squared)*3600
    print("b02:",b02)
    b03 = -(180/np.pi/6/N**3 /np.cos(fi)*(1+2*t**2+n_squared))*3600
    print("b03:",b03)
    b04 = t*180/np.pi/24/N**4 *(5+3*t**2+ 6*n_squared -6*n_squared *t**2)*3600
    print("b04:",b04)
    b05 = 180/np.pi/120/N**5 /np.cos(fi) *(5+ 28*t**2 +24*t**4)*3600
    print("b05:",b05)
    dfi = b02*x**2 + b04*x**4
    print("enlem farkı saniye:",dfi)
    dlam = b01*x +b03*x**3 +b05*x**5
    print("boylam fark : ",dlam)
    fi = fi + (dfi/3600*np.pi/180)
    lam = der *np.pi/180 + dlam /3600 *np.pi/180
    print(lam)

    conv = t*180/np.pi*x/N-t*180/np.pi/3/N**3 *(1+t**2 -n_squared)*x**3
    print("meridyen yakınsama: ",conv)
    return fi,lam

print("Jeodezik hesaplamalar\n1)\tCoğrafiden Sağ Yukarıya\n2)\tSağa Yukarıdan Coğrafiye\n")
while (True):
    try :
        my_list=[1,2,3,4,5,6,7]
        i = int(input("(1/2/3/4/5/6/7) ??:\t"))
        if i<0:
            i=0
            print("negatif sayı girilmez")
        1/i
        my_list[i-1]
        break
    except ZeroDivisionError:
        print("sınır aşımı")
    except IndexError as e:
        e = "sınır aşımı"
        print(e)
    except ValueError:
        print("hatalı giriş")
        
print ("choose ellipsoid \n1)\tGRS80\n2)\tHayford(Int. 1924)\n3)\tWGS84\n4)\tKrassovsky 1940\n5)\tKullanıcı tanımlı Ellipsoid")

while (True):
    try :
        my_list=[1,2,3,4,5]
        x = int(input("(1/2/3/4/5) ??:\t"))
        if x<0:
            x=0
            print("negatif sayı girilmez")
        1/x
        my_list[x-1]
        break
    except ZeroDivisionError:
        print("sınır aşımı")
    except IndexError as e:
        e = "sınır aşımı"
        print(e)
    except ValueError:
        print("hatalı giriş")


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

if i==1:
    i = int(input("nokta kuzey yarım kürede mi güneyde mi??\n1) Kuzey\t2) Güney\n(1/2)??\t: "))
    j = int(input("1)\t6 derece (UTM)\n2)\t3 derece (TM)\n(1/2)??\t: "))
    fi = to_dec(int(input("noktanın\nEnlem Derece\t: ")),int(input("Enlem Dakika\t: ")),float(input("Enlem Saniye\t: ")))
    lam = to_dec(int(input("noktanın\nBoylam Derece\t: ")),int(input("Boylam Dakika\t: ")),float(input("Boylam Saniye\t: ")))
    der = int(input("Orta Meridyen\t: "))
    (x,y) = to_SagYukarı(a,b,c,fi* np.pi/180,lam* np.pi/180,der* np.pi/180,e1,e2)
    if j==1:
        dilim_no = int(der/6 +31) 
        print("Dilim no\t: ", dilim_no)
        tm = 6
        x = x* 0.9996
        y = y* 0.9996
    elif j==2:
        tm = 3
    
    if i==2:
        yukari = y + 10000000
        saga = x +500000
    elif i==1:
        yukari = y
        saga = x +500000
        
    print("Projeksiyon '",tm,"' derece Gauss Kruger")
    print("Sağa değer\t: ",saga)
    print("Yukarı değer\t: ",yukari)
elif i==2:
    i = int(input("nokta kuzey yarım kürede mi güneyde mi??\n1) Kuzey\t2) Güney\n(1/2)??\t: "))
    j = int(input("1)\t6 derece (UTM)\n2)\t3 derece (TM)\n(1/2)??\t: "))
    saga = float(input("Sağa değeri girin\t: "))
    yukari = float(input("Yukarı değeri girin\t: "))
    der = int(input("Orta Meridyen\t: "))
    if i==1:
        y = yukari
        x = saga -500000
    elif i==2:
        y = yukari - 10000000
        x = saga - 500000
    if j==1:
        x = x / 0.9996
        y = y / 0.9996     
    (fi,lam) = sagYukari_to_cog(a,b,c,x,y,der,e1,e2)
    print("Enlem\t: ",to_deg(fi*180/np.pi))
    print("Boylam\t: ",to_deg(lam*180/np.pi))

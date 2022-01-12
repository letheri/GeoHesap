import numpy as np
import Ellipsoids
import DegreeCalculations
import Transformations
    
print("Geodetic Transformations")
print("1)\tCartesian to polar")
print("2)\tPolar to cartesian")

transformation_index = int(input("1/2 :"))

print("Select an Ellipsoid")
print("1)\tGRS80")
print("2)\tHayford")
print("3)\tWGS84")
print("4)\tKrasovsky")
print("5)\tCustom Ellipsoid")

ellipsoid_index = int(input("1/2 :"))

if ellipsoid_index == 1:
    ellipsoid = Ellipsoids.GRS80()
    
if ellipsoid_index == 2:
    ellipsoid = Ellipsoids.Hayford()
    
if ellipsoid_index == 3:
    ellipsoid = Ellipsoids.WGS84()
    
if ellipsoid_index == 4:
    ellipsoid = Ellipsoids.Krasovsky()

if ellipsoid_index == 5:
    a = float(input("Enter parameter a:"))
    b = float(input("Enter parameter b:"))
    
    ellipsoid = Ellipsoids.Ellipsoid(a, b)
    
if transformation_index == 1:
    X = float(input("X:"))
    Y = float(input("Y:"))
    Z = float(input("Z:"))
    fi, lam, h = Transformations.to_polar(ellipsoid,X,Y,Z)
    
    print(DegreeCalculations.deg_to_dms(fi * 180 / np.pi))
    print(DegreeCalculations.deg_to_dms(lam * 180 / np.pi))
    print(h)
    
elif transformation_index == 2:
    fi = DegreeCalculations.dms_to_deg(float(input("deg:")), float(input("min:")), float(input("sec:")))
    lam = DegreeCalculations.dms_to_deg(float(input("deg:")), float(input("min:")), float(input("sec:")))
    h = float(input("h:"))
    X, Y, Z = Transformations.to_cartesian(ellipsoid, fi, lam, h)
    
    print(X, Y, Z)

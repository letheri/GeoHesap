# -*- coding: utf-8 -*-

import numpy as np

class Ellipsoid:
    def __init__(self, a, b):
        self.a = a
        self.b = b
        self.Calculate()
        
    def calculate(self):
        self.c = self.a**2 / self.b
        self.e1 = np.sqrt((self.a**2 - self.b**2) / self.a**2)
        self.e2 = np.sqrt((self.a**2 - self.b**2) / self.b**2)

class GRS80(Ellipsoid):
    def __init__(self):
        self.a = 6378137.000
        self.b = 6356752.3141
        self.calculate()
    
class Hayford(Ellipsoid):
    def __init__(self):
        self.a = 6378388.000
        self.b = 6356911.946128
        self.calculate()
        
class WGS84(Ellipsoid):
    def __init__(self):
        self.a = 6378137.000
        self.b = 6356752.3142
        self.calculate()
        
class Krasovsky(Ellipsoid):
    def __init__(self):
        self.a = 6378245.000
        self.b = 6356863.018773
        self.calculate()
        
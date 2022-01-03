# -*- coding: utf-8 -*-

import numpy as np

def to_cartesian(ellipsoid, fi, lam, h):
    fi = fi * np.pi / 180
    lam = lam * np.pi / 180
    N = ellipsoid.c / np.sqrt(1 + ellipsoid.e2**2 * np.cos(fi)**2)
    X = (N + h) * np.cos(fi) * np.cos(lam)
    Y = (N + h) * np.cos(fi) * np.sin(lam)
    Z = (ellipsoid.b**2 * N / ellipsoid.a**2 + h) * np.sin(fi)
    return X, Y, Z

def to_polar(ellipsoid, X, Y, Z):
    p = np.sqrt(X**2 + Y**2)
    lam = np.arctan(Y / X)
    beta = np.arctan(ellipsoid.a * Z / (ellipsoid.b * p))
    fi = np.arctan((Z + ellipsoid.e2**2 * ellipsoid.b * np.sin(beta)**3) / (p-ellipsoid.e1**2 * ellipsoid.a * np.cos(beta)**3))
    N = ellipsoid.c / np.sqrt(1 + ellipsoid.e2**2 * np.cos(fi)**2)
    h = p / np.cos(fi) - N
    return fi, lam, h
# -*- coding: utf-8 -*-

def dms_to_deg(deg, min_, sec):
    deg = deg + ((min_ + (sec / 60)) / 60)
    return deg

def deg_to_dms(dec):

    deg = int(dec)
    min_ = int((dec-deg )* 60)
    sec = round(float((((dec-deg) * 60) - min_) * 60), 8)
    return deg, min_, sec

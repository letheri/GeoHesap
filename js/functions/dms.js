function to_dec(deg_,minu_,sec_){
    const deg = parseInt(deg_);
    const minu = parseInt(minu_);
    const sec = parseFloat(sec_);
    if (deg>0){
        dec = deg+(minu + sec / 60)/60}
    else{
        dec = deg-(minu + sec / 60)/60}
    return [dec]
}
function to_deg(dec_){
  const dec = parseFloat(dec_);
    let deg = parseInt(dec)
    let minu = parseInt((dec-deg)*60)
    let sec = Math.round(((((dec-deg)*60)-minu)*60),8)
    if (sec== 60){
        sec = 0.000000
        minu += 1}
    return [deg, minu, sec]
}
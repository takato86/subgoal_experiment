function subVecs(a, b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] - b[i]);
    }
    return result;
}
function dot(a,b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = 0;
    for(let i = 0; i < a.length; i++){
        result += a[i] * b[i];
    }
    return result;
}
function divVecs(a,b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] / b[i]);
    }
    return result;
}
function addVecs(a, b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] + b[i]);
    }
    return result;
}
function mulVecs(a, b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] * b[i]);
    }
    return result;
}

//import dxftojson from 'https://cdn.jsdelivr.net/npm/dxf2json@1.0.3/+esm'
 
var mapjson = dxf2json('./JFK-HH-LV1-arc-zones-1.dxf' , 'out.json')
.then(result=>{
    return result;  
});
debugger
var x = 10;
var req = new XMLHttpRequest();
var url = '/maps.json';

req.open('GET',url,true);
req.addEventListener('load',onLoad);

req.send();

function onLoad() {
   var response = this.responseText;
   var mapData = JSON.parse(response);
    const mapSelect = document.getElementById("map");
    for(var i = 0; i < mapData.maps.length; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.text = mapData.maps[i].name;
        mapSelect.appendChild(opt);
    }
}
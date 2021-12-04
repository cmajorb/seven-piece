var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');

var bgImage = new Image();
bgImage.src = "static/images/background.jpeg";

bgImage.onload = function(){
    context.drawImage(bgImage, 0, 10, width, height);
};
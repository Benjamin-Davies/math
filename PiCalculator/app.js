var span1 = document.getElementById("pi-actual");
var span2 = document.getElementById("pi-coprime");
span1.innerText = Math.PI;

var interval = setInterval(50, function() {
  span2.innerText = performance.now();
});

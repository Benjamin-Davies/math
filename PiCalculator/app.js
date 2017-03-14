var span1 = document.getElementById("pi-actual");
var span2 = document.getElementById("pi-coprime"), total = 0, totalCp = 0;
var span3 = document.getElementById("pi-insum"), piInsum = 0;
var span4 = document.getElementById("pi-archimedes");
var iterationsPerCycle = 10;
span1.innerText = Math.PI;

var interval = setInterval(function() {
  for (var i = 0; i < iterationsPerCycle; i++) {
    var n1 = Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER);
    var n2 = Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER);
    var n3 = gcd(n1, n2);
    if (n3 == 1) totalCp++;

    piInsum += Math.pow(-1, total) * 4 / (2 * total + 1);

    total++;
  }

  var x = totalCp / total;
  var cp = Math.sqrt(6 / x);
  span2.innerText = cp.toFixed(15);
  span3.innerText = piInsum.toFixed(15);
  span4.innerText = (total * Math.sin(Math.PI / total)).toFixed(15); // Math.PI here is only used to convert to radians
}, 100);

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) { var temp = a; a = b; b = temp; }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

function foundFraction(a, b, c, d) {
  document.getElementById("mainTable").innerHTML += `<tr>
    <td>${a}</td>
    <td>${b}</td>
    <td>${c}</td>
    <td>${d}</td>
  <tr>`;
}

// algorithm function with callback
function findFractions(a) {
  var closest = 1;
  var actualValue = Math.sqrt(a);

  for (var i = 1; i <= 100; i++) {
    for (var j = 1; j <= 100; j++) {
      var n = i / j;
      var error = Math.abs(actualValue - n);

      if (error < closest) {
        foundFraction(i + "/" + j, n, n * n > a, error);
        closest = error;
      }
    }
  }
}

findFractions(2);

var osc;
var a = 1, b = 1;
var notes, scl = 'maj', scllen;
var SEMITONE;

function preload() {
  notes = loadJSON('../assets/notes.json');
}

function setup() {
  noCanvas();
  frameRate(3);

  SEMITONE = pow(2, 1 / 12);

  var params = getURLParams();
  if (notes[params.scl])
    scl = params.scl;
  scllen = notes[scl].length;

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(220);
  osc.amp(0.5);
  osc.start();
}

function draw() {
  var temp = a + b;
  a = b;
  b = temp;

  osc.freq(pow(SEMITONE, notes[scl][a % scllen]) * 220);
}

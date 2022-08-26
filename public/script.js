let side_length = 1000;
let num_of_iteration = 10000;

const side_length_dom = document.getElementById("side_length");
const side_length_range = document.getElementById("side_length_range");

const iteration_dom = document.getElementById("iteration");
const iteration_range = document.getElementById("iteration_range");

function updateSideLength() {
  side_length_dom.innerText = side_length_range.value;
  side_length_range.addEventListener("input", (e) => {
    side_length_dom.innerText = side_length_range.value;
    side_length = parseInt(side_length_range.value)
  });
}

function updateIteration() {
  iteration_dom.innerText = iteration_range.value;
  iteration_range.addEventListener("input", (e) => {
    iteration_dom.innerText = iteration_range.value;
    num_of_iteration = parseInt(iteration_range.value)
  });
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 500;

canvas.clientWidth = width;
canvas.clientHeight = width;

window.addEventListener("resize", () => {
  canvas.clientWidth = 500;
  canvas.clientHeight = 500;
});

ctx.strokeStyle = "white";
ctx.lineWidth = 2;

ctx.beginPath();
ctx.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2);
ctx.stroke();

function approx(side_length, number_of_guess) {
  let inside = 0;
  let outside = 0;

  for (let i = 0; i < number_of_guess; i++) {
    x_cor = Math.random() * side_length
    y_cor = Math.random() * side_length;

    square_sum = x_cor ** 2 + y_cor ** 2;
    let coords = transformCoordinate(x_cor, y_cor, side_length);

    if (square_sum <= side_length ** 2) {
      inside += 1;
      drawPoint(coords[0], coords[1], "cyan");
    } else {
      outside += 1;
      drawPoint(coords[0], coords[1], "red");
    }
  }

  let pi = 4 * (inside / (inside + outside));
  return pi;
}

function transformCoordinate(x, y, side_length) {
  x_cartesian = (width / side_length) * x;
  y_cartesian = width - (width / side_length) * y;
  return [x_cartesian, y_cartesian];
}

function drawPoint(x, y, color, size = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function runSimulation() {
  ctx.clearRect(0, 0, width, width);

  console.log(side_length, num_of_iteration)
  approx(side_length, num_of_iteration);

  ctx.beginPath();
  ctx.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2);
  ctx.stroke();
}

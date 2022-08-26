let side_length = 10;
let num_of_guess = 1000;
let num_of_iteration = 100;

let x_prev = 0
let y_prev = 0

const inside_color = "red";
const outside_color = "green";

const iteration_dom = document.getElementById("iteration");
const iteration_range = document.getElementById("iteration_range");
const pi_dom = document.getElementById("decimal");

iteration_dom.innerText = iteration_range.value;
iteration_range.addEventListener("input", (e) => {
  iteration_dom.innerText = iteration_range.value;
  num_of_guess = parseInt(iteration_range.value);
});

const canvas = document.getElementById("canvas");
const graph = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const graph_ctx = graph.getContext("2d");

const width = 500;
const graph_width = 800;

canvas.clientWidth = width;
canvas.clientHeight = width;
graph.clientWidth = graph_width;
graph.clientHeight = width;

window.addEventListener("resize", () => {
  canvas.clientWidth = width;
  canvas.clientHeight = width;
  graph.clientWidth = graph_width;
  graph.clientHeight = width;
});

ctx.strokeStyle = "white";
ctx.lineWidth = 2;

graph_ctx.strokeStyle = "white";
graph_ctx.lineWidth = 2;

ctx.beginPath();
ctx.arc(0, width, width, 0, Math.PI * 2);
ctx.stroke();

function approx(side_length, number_of_guess) {
  let inside = 0;
  let outside = 0;

  for (let i = 0; i < number_of_guess; i++) {
    x_cor = Math.random() * side_length;
    y_cor = Math.random() * side_length;

    square_sum = x_cor ** 2 + y_cor ** 2;
    let coords = transformCoordinate(x_cor, y_cor, side_length);

    if (square_sum <= side_length ** 2) {
      inside += 1;
      drawPoint(coords[0], coords[1], inside_color, ctx);
    } else {
      outside += 1;
      drawPoint(coords[0], coords[1], outside_color, ctx);
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

function drawPoint(x, y, color, context, size = 2) {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
}

function runSimulationOnce(n) {
  ctx.clearRect(0, 0, width, width);

  let pi = approx(side_length, num_of_guess);
  pi_dom.innerText = pi.toString().slice(2);

  drawGraphPoints(pi, n)

  ctx.beginPath();
  ctx.arc(0, width, width, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCoordinate() {
  graph_ctx.beginPath();
  graph_ctx.moveTo(0, width/2);
  graph_ctx.lineTo(graph_width, width/2);
  graph_ctx.stroke();

  graph_ctx.font = "15px Arial"
  graph_ctx.fillStyle = "aquamarine"
  graph_ctx.textAlign = "center"
  graph_ctx.fillText(Math.PI, 70, width/2 + 18)

  graph_ctx.font = "20px Arial"
  graph_ctx.fillStyle = "white"
  graph_ctx.fillText("Graph", graph_width/2, 25)

}

drawCoordinate();

function drawGraphPoints(val, n) {
  let delta = Math.PI - val
  y_cor = delta * 1000 + width / 2
  x_cor = n * (graph_width/num_of_iteration)

  graph_ctx.strokeStyle = "deepskyblue"
  graph_ctx.lineWidth = 1
  graph_ctx.beginPath()
  graph_ctx.moveTo(x_prev, y_prev)
  graph_ctx.lineTo(x_cor, y_cor)
  graph_ctx.stroke()

  drawPoint(x_cor, y_cor, "green", graph_ctx, 0)
  x_prev = x_cor
  y_prev = y_cor
}

function runSimulation() {
  graph_ctx.clearRect(0, 0, graph_width, width)
  x_prev = 0
  y_prev = 0
  drawCoordinate()

  for (let i = 0; i < num_of_iteration; i++){
    runSimulationOnce(i)
  }
}
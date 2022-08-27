// initiating canvas and context variables
let pi_canvas
let graph_canvas
let pi_ctx
let graph_ctx

// canvas scaling factor
let pi_canvas_scale
let graph_canvas_scale

// animation variables
let graphAnimation
let piAnimation

// speed
let speed = 1

// scaling factor logic
if (window.innerWidth > 750) {
    pi_canvas_scale = 0.3
    graph_canvas_scale = 0.5
} else {
    pi_canvas_scale = 0.5
    graph_canvas_scale = 0.7
}

// variables for algorithm
let guessRange = 10
let numberOfGuess = 10
let iterVal = 0
let pi = 3
let x_prev = 0
let y_prev = (window.innerWidth * graph_canvas_scale) / 2

// window onload trigger
window.onload = () => {
    pi_canvas = document.getElementById('canvas')
    graph_canvas = document.getElementById('graph')

    pi_ctx = pi_canvas.getContext('2d')
    graph_ctx = graph_canvas.getContext('2d')

    pi_canvas.width = window.innerWidth * pi_canvas_scale
    pi_canvas.height = window.innerWidth * pi_canvas_scale

    graph_canvas.width = window.innerWidth * graph_canvas_scale
    graph_canvas.height = window.innerWidth * pi_canvas_scale

    let graphPlot = new GraphPlot(graph_ctx, graph_canvas.width, graph_canvas.height)
    let piPlot = new PiPlot(pi_ctx, pi_canvas.width, pi_canvas.height)
}

// resize event listener
window.addEventListener('resize', ()=> {
    pi_canvas.width = window.innerWidth * pi_canvas_scale
    pi_canvas.height = window.innerWidth * pi_canvas_scale

    graph_canvas.width = window.innerWidth * graph_canvas_scale
    graph_canvas.height = window.innerWidth * pi_canvas_scale
})


class GraphPlot {
    #ctx
    #width
    #height
    #pointColor = 'red'
    #pointSize = 1
    #lineColor = 'red'
    #axisColor = 'aquamarine'

    constructor(ctx, width, height) {
        this.#ctx = ctx
        this.#width = width
        this.#height = height
        this.#drawAxis()
    }

    #drawLine(x_prev, y_prev, x, y){
        this.#ctx.strokeStyle = this.#lineColor
        this.#ctx.beginPath()
        this.#ctx.moveTo(x_prev, y_prev)
        this.#ctx.lineTo(x, y)
        this.#ctx.stroke()
    }

    #drawPoint(x, y){
        this.#ctx.beginPath()
        this.#ctx.fillStyle = this.#pointColor
        this.#ctx.arc(x, y, this.#pointSize, 0, Math.PI * 2)
        this.#ctx.closePath()
        this.#ctx.fill()
    }

    #drawAxis(){
        this.#ctx.strokeStyle = this.#axisColor
        this.#ctx.beginPath()
        this.#ctx.moveTo(0, this.#height/2)
        this.#ctx.lineTo(this.#width, this.#height/2)
        this.#ctx.stroke()

        this.#ctx.font = '15px Arial'
        this.#ctx.fillStyle = this.#axisColor
        this.#ctx.textAlign = 'center'
        this.#ctx.fillText(Math.PI, 70, this.#height/2 + 18)

        this.#ctx.font = '20px Arial'
        this.#ctx.fillStyle = 'magenta'
        this.#ctx.fillText("Graph", this.#width/2, 25)
    }

    animate(){
        let deltaPi = Math.PI - pi
        let y_cor = deltaPi * 100 + this.#height / 2
        let x_cor = iterVal * (this.#width / numberOfGuess)

        this.#drawPoint(x_cor, y_cor)
        this.#drawLine(x_prev, y_prev, x_cor, y_cor)
        x_prev = x_cor
        y_prev = y_cor

        if (iterVal >= numberOfGuess) return

        graphAnimation = requestAnimationFrame(this.animate.bind(this))
    }
}

class PiPlot {
    #ctx
    #width
    #height
    #pointInsideColor = 'rgba(82,187,217,255)'
    #pointOutsideColor = 'rgba(203, 43, 183, 1)'
    #pointSize = 2
    #arcColor = 'white'
    #lineWidth = 2
    inside = 0
    outside = 0

    constructor(ctx, width, height){
        this.#ctx = ctx
        this.#width = width
        this.#height = height
        this.#drawArc()
    }

    #drawPoint(x, y, color){
        this.#ctx.beginPath()
        this.#ctx.fillStyle = color
        this.#ctx.arc(x, y, this.#pointSize, 0, Math.PI * 2)
        this.#ctx.closePath()
        this.#ctx.fill()
    }

    #drawArc(){
        this.#ctx.strokeStyle = this.#arcColor
        this.#ctx.lineWidth = this.#lineWidth

        this.#ctx.beginPath()
        this.#ctx.arc(0, this.#height, this.#width, 0, Math.PI*2)
        this.#ctx.stroke()
    }

    #transformCoordinate(x, y){
        let x_cartesian = (this.#width / guessRange) * x
        let y_cartesian = this.#height - (this.#height / guessRange) * y
        return {
            x: x_cartesian,
            y: y_cartesian
        }
    }

    approx(){
        let x_cor = Math.random() * guessRange;
        let y_cor = Math.random() * guessRange;

        let squareNum = x_cor ** 2 + y_cor ** 2
        let coords = this.#transformCoordinate(x_cor, y_cor)

        if (squareNum <= guessRange ** 2){
            this.inside += 1
            this.#drawPoint(coords.x, coords.y, this.#pointInsideColor)
        } else{
            this.#drawPoint(coords.x, coords.y, this.#pointOutsideColor)
            this.outside += 1
        } 
        pi = 4 * (this.inside / (this.inside + this.outside))

    }

    animate(){
        for (let i = 0; i < speed; i++){
            if (iterVal < numberOfGuess) this.approx()
            iterVal++
        }
        pi_dom.innerText = pi.toString().slice(2)

        if (iterVal >= numberOfGuess){
            return
        }
        piAnimation = requestAnimationFrame(this.animate.bind(this))
    }
}

// dom element
const iteration_dom = document.getElementById("iteration");
const iteration_range = document.getElementById("iteration_range");
const pi_dom = document.getElementById("decimal");

iteration_dom.innerText = iteration_range.value;
iteration_range.addEventListener("input", (e) => {
  iteration_dom.innerText = iteration_range.value;
  numberOfGuess = parseInt(iteration_range.value);
});

function runSimulation(){
    cancelAnimationFrame(piAnimation)
    cancelAnimationFrame(graphAnimation)

    pi_ctx.clearRect(0, 0, pi_canvas.width, pi_canvas.height)
    graph_ctx.clearRect(0, 0, graph_canvas.width, graph_canvas.height)

    iterVal = 0
    x_prev = 0
    y_prev = 0

    let graphPlot = new GraphPlot(graph_ctx, graph_canvas.width, graph_canvas.height)
    let piPlot = new PiPlot(pi_ctx, pi_canvas.width, pi_canvas.height)

    piPlot.animate(0)
    graphPlot.animate(0)
}

function stopSimulation(){
    cancelAnimationFrame(piAnimation)
    cancelAnimationFrame(graphAnimation)
}
let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

window.onload = function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext('2d');
    resizeCanvas();
    flowField = new FlowfieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate();
}

window.addEventListener('resize', function() {
    cancelAnimationFrame(flowFieldAnimation);
    resizeCanvas();
    flowField = new FlowfieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate();
})

const mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
})

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class FlowfieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#ctx.lineWidth = 1;
        this.#height = height;
        this.#width = width;
        this.lastTime = 0;
        this.interval = 1000 / 60;
        this.timer = 0;
        // cellcise larger to lessen load on machine.
        this.cellSize = 15;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 1;
        // transition speed
        this.vr = 0.15;
    }
    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0,0, this.#width, this.#height);
        this.gradient.addColorStop("0.1","#ff5c33");
        this.gradient.addColorStop("0.2","#ff66b3");
        this.gradient.addColorStop("0.4","#ccccff");
        this.gradient.addColorStop("0.6","#b3ffff");
        this.gradient.addColorStop("0.8","#80ff80");
        this.gradient.addColorStop("0.9","#ffff33");
    }
    #drawLine(angle, x, y){
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;
        if (distance > 700000) distance = 700000;
        else if (distance < 50000) distance = 50000;
        let length = distance / 9000;

        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        this.#ctx.stroke();
    }
    animate(timeStamp) {
        if (!timeStamp) timeStamp = 0;
        if (!this.lastTime) this.lastTime = 0;
        
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        this.timer += deltaTime;
                
        if (this.timer >= this.interval) {
            this.#ctx.clearRect(0,0,this.#width,this.#height);
            this.radius += this.vr;
            if (this.radius > 10 || this.radius < -10) this.vr *= -1;

            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
                    this.#drawLine(angle, x, y);
                }
            }
            
            this.timer = 0;
       }

       flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }    
    
}
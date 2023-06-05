/*
Indoor scenes: Main color - Light beige (#F5F5DC), Accent color - Soft gray (#D3D3D3)

Supernatural or dream-like scenes: Main color - Deep purple (#800080), Accent color - Muted lavender (#E6E6FA)

Action or intense moments: Main color - Dark red (#8B0000), Accent color - Fiery orange (#FF4500)

Outdoor scenes: Main color - Sky blue (#87CEEB), Accent color - Fresh green (#00FF00)

Nighttime scenes: Main color - Midnight blue (#191970), Accent color - Warm yellow (#FFD700)

Surreal or abstract sequences: Main color - Vibrant magenta (#FF00FF), Accent color - Electric blue (#00FFFF)
*/

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
let hue = 0;
//let circleX = canvas.width/2;
//let circleY = canvas.height/2;
//const circleRadius = 300;
//const rotationSpeed = 0.01;
//const bg = ['#800080','#8B0000','#87CEEB','#191970','#FF00FF'];
const accent = ['#F5F5DC','#E6E6FA','#FF4500','#00FF00','#FFD700','#00FFFF'];
let color = 0;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    circleX = canvas.width/2;
    circleY = canvas.width/2;
});

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 4; i++) {
        particlesArray.push(new Particle());
    }
});

canvas.addEventListener('click', function() {
    color++;
    if (color > 4) color = 0;
    for (let i = 0; i < 3; i++) particlesArray.push(new Particle());
});

/*
function moveInCircle() {
    let angle = 0.0;
    return function() {
        const x = circleX + circleRadius * Math.cos(angle);
        const y = circleY + circleRadius * Math.sin(angle);
        angle += rotationSpeed;
        return { x, y };
    };
}            */                    


// call class to make one new object.
class Particle {
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        //const position = circle();
        //this.x = position.x;
        //this.y = position.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        //this.color = 'hsl(' + hue + ',100%, 50%)';
        this.color = accent[color];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

//const circle = moveInCircle();

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt((dx * dx) + (dy * dy));
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particlesArray[i].color;
                ctx.lineWidth = 0.2;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        if (particlesArray[i].size <= 0.3) {
            particlesArray.splice(i, 1);
            i --;
        }
    }
}

function animate() {
    ctx.fillStyle = '#808080 ';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    //hue+=0.5;

     /* Add new particles to the particlesArray
     const numOfParticles = 5;
     for (let i = 0; i < numOfParticles; i++) {
         particlesArray.push(new Particle());
     }
     */

    requestAnimationFrame(animate);
}
animate();

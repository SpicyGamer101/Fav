const canvas = document.getElementById('menuCanvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight * 0.8807;
canvas.width = window.innerWidth;

const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, "rgb(255, 0, 0)");
gradient.addColorStop(1/6,"rgb(255, 255, 0)");
gradient.addColorStop(2/6,"rgb(0, 255, 0)");
gradient.addColorStop(3/6,"rgb(0, 255, 255)");
gradient.addColorStop(4/6,"rgb(0, 0, 255)");
gradient.addColorStop(5/6,"rgb(255, 0, 255)");
gradient.addColorStop(1,"rgb(255, 0, 0)");

let mouseX = 0;
let mouseY = 0;

let pages = [];
let pageCount = 5;
let v = 2;

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight * 0.8807;
    canvas.width = window.innerWidth;
});

window.addEventListener('mousedown', (e) => {
    getMousePosition(canvas, e);
    pages.forEach(page => {
        let d = Math.sqrt((mouseX - page.x)**2 + (mouseY - page.y)**2);
        if(d < page.r) {
            if(page.id === 'GOT') {
                window.location.href = "GOT.html";
            } else if (page.id === 'ST') {
                window.location.href = "ST.html";
            } else if (page.id === 'WED') {
                window.location.href = "WED.html";
            } else if (page.id === 'VIK') {
                window.location.href = "VIK.html";
            } else if (page.id === 'WITCH') {
                window.location.href = "WITCH.html";
            }
        }
    });
});

start();

function start() {
    for (i = 0; i < pageCount; i++) {
        let r = 100;
        let x = (2 * r) + (i * canvas.width/pageCount);
        let y = r + (Math.random() * (canvas.height - r*2));
        let angle = Math.random() * 2 * Math.PI;
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let id;
        if (i === 0) {
            id = "GOT";
        }
        if (i === 1) {
            id = "ST";
        }
        if (i === 2) {
            id = "VIK";
        }
        if (i === 3) {
            id = "WED";
        }
        if (i === 4) {
            id = "WITCH";
        }
        pages.forEach(page => {
            let d = Math.sqrt((x - page.x)**2 + (y - page.y)**2);
            if (d <= page.r + r) {
                x = r + (Math.random() * (canvas.width - r*2));
                y = r + (Math.random() * (canvas.height - r*2));
            }
        });
        pages.push({x, y, r, id, angle, vx, vy});
    }
    update();
}

function update() {
    pages.forEach(page => {
        page.x += page.vx;
        page.y += page.vy;
        page.r = (canvas.width * canvas.height)/15000;
        if (page.x > canvas.width - page.r) {
            page.vx *= -1;
            page.x = canvas.width - page.r;
        }
        if (page.x < page.r) {
            page.vx *= -1;
            page.x = page.r;
        }
        if (page.y > canvas.height - page.r) {
            page.vy *= -1;
            page.y = canvas.height - page.r;
        }
        if (page.y < page.r + window.innerHeight * 0.01) {
            page.vy *= -1;
            page.y = page.r + window.innerHeight * 0.01;
        }

        pages.forEach(other => {
            if(page !==  other) {
                let d = Math.sqrt((other.x - page.x)**2 + (other.y - page.y)**2);
                if (d <= page.r + other.r) {
                    collisionResolution(page, other);
                }
            }
        });

        let tv = Math.sqrt(page.vx**2 + page.vy**2);
        if (tv !== v) {
            let angle = Math.atan2(page.vy, page.vx);
            page.vx = v * Math.cos(angle);
            page.vy = v * Math.sin(angle);
        }
    })

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, window.innerHeight * 0.01);

    pages.forEach(page => {
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(page.x, page.y, page.r, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = `${(canvas.width * canvas.height)/60000}px Arial`;
        if(page.id === "GOT") {
            var textString = "Game of Thrones",
            textWidth = ctx.measureText(textString ).width;
            ctx.fillText(textString, (page.x) - (textWidth / 2), page.y); 
        }
        if (page.id === "ST") {
            var textString = "Stranger Things",
            textWidth = ctx.measureText(textString ).width;
            ctx.fillText(textString, (page.x) - (textWidth / 2), page.y); 
        }
        if (page.id === "WED") {
            var textString = "Wednesday",
            textWidth = ctx.measureText(textString ).width;
            ctx.fillText(textString, (page.x) - (textWidth / 2), page.y); 
        }
        if (page.id === "VIK") {
            var textString = "Vikings",
            textWidth = ctx.measureText(textString ).width;
            ctx.fillText(textString, (page.x) - (textWidth / 2), page.y); 
        }
        if (page.id === "WITCH") {
            var textString = "The Witcher",
            textWidth = ctx.measureText(textString ).width;
            ctx.fillText(textString, (page.x) - (textWidth / 2), page.y); 
        }
    })
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

function collisionResolution(obj1, obj2) {
    let distX = obj2.x - obj1.x
    let distY = obj2.y - obj1.y;
    let distT = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) **2);
    let nx = distX / distT;
    let ny = distY / distT;
    let vx = obj1.vx - obj2.vx;
    let vy = obj1.vy - obj2.vy;
    let speed = vx * nx + vy * ny;
    if (speed < 0){
        return;
    }
    obj1.vx -= (speed * nx);
    obj1.vy -= (speed * ny);
    obj2.vx += (speed * nx);
    obj2.vy += (speed * ny);

    let overlap = obj1.r*2 - distT;
    let dx = (obj1.x - obj2.x) / distT;
    obj1.x -= -dx * overlap / 2;
    obj2.x += -dx * overlap / 2;
    if (obj1.y < obj2.y) {
        obj1.y -= overlap / 2;
    } else {
        obj2.y -= overlap / 2;
    }
    return;
}
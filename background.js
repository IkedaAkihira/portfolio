class Eye {
  constructor(x, y, radius, pupilRadius, rotation, eyeMoveRatio, lifeTime, openingTime, eyeRatio) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.pupilRadius = pupilRadius;
    this.rotation = rotation;
    this.eyeMoveRatio = eyeMoveRatio;
    this.lifeTime = lifeTime;
    this.openingTime = openingTime;
    this.startTime = Date.now();
    this.eyeRatio = eyeRatio;
  }

  get isDestroyed() {
    return Date.now() - this.startTime > this.lifeTime;
  }

  draw(ctx, eyeImg, mousePos) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const time = Date.now() - this.startTime;
    let openingRatio = 1;
    if (time < this.openingTime) {
        openingRatio = time / this.openingTime;
    }else if (time > this.lifeTime - this.openingTime) {
        openingRatio = (this.lifeTime - time) / this.openingTime;
    }
    openingRatio = Math.min(1, Math.max(0, openingRatio));
    openingRatio = openingRatio ** 2;
    ctx.drawImage(eyeImg, -this.radius, -this.radius * openingRatio * this.eyeRatio, this.radius * 2, this.radius * 2 * openingRatio * this.eyeRatio);

    ctx.rotate(-this.rotation);

    let dx = mousePos.x - this.x;
    let dy = mousePos.y - this.y;

    dx *= this.eyeMoveRatio;
    dy *= this.eyeMoveRatio;

    if (Math.hypot(dx, dy) > this.radius - this.pupilRadius) {
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * (this.radius - this.pupilRadius);
        dy = Math.sin(angle) * (this.radius - this.pupilRadius);
    }

    ctx.beginPath();
    ctx.arc(dx, dy, this.pupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.restore();
  }
}

function getGeneratePosition(eyes, radius, tryTimes) {
    for (let i = 0; i < tryTimes; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        let isOK = true;
        for (const eye of eyes) {
            if (Math.hypot(eye.x - x, eye.y - y) < eye.radius + radius) {
                isOK = false;
                break;
            }
        }
        if (isOK) {
            return {x, y};
        }
    }
    return null;
}

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 2000;
canvas.height = 2000;

const eyeImg = document.getElementById('eye');

const eyeRadius = 100;
const pupilRadius = 40;
const eyeMoveRatio = 0.05;
const minLifeTime = 10000;
const maxLifeTime = 20000;
const openingTime = 500;
const eyeRatio = 0.388;

const minEyeScale = 1;
const maxEyeScale = 1.5;
const minPupilScale = 0.9;
const maxPupilScale = 1.1;

const minNextGenerateTime = 200;
const maxNextGenerateTime = 500;

let eyes = [];

for (let i = 0; i < 10; i++) {
    const pos = getGeneratePosition(eyes, eyeRadius, 100);
    const eyeScale = minEyeScale + Math.random() * (maxEyeScale - minEyeScale);
    const pupilScale = minPupilScale + Math.random() * (maxPupilScale - minPupilScale);
    eyes.push(new Eye(
        pos.x,
        pos.y,
        eyeRadius * eyeScale,
        pupilRadius * eyeScale * pupilScale,
        Math.random() * Math.PI * 2,
        eyeMoveRatio,
        minLifeTime + Math.random() * (maxLifeTime - minLifeTime),
        openingTime,
        eyeRatio
    ));
}

let nextGenerateTime = Date.now() + Math.random() * (maxNextGenerateTime - minNextGenerateTime) + minNextGenerateTime;

let mousePos = {x: 0, y: 0};
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Date.now() > nextGenerateTime) {
        const pos = getGeneratePosition(eyes, eyeRadius, 100);
        const eyeScale = minEyeScale + Math.random() * (maxEyeScale - minEyeScale);
        const pupilScale = minPupilScale + Math.random() * (maxPupilScale - minPupilScale);
        if (pos) {
            eyes.push(new Eye(
                pos.x,
                pos.y,
                eyeRadius * eyeScale,
                pupilRadius * eyeScale * pupilScale,
                Math.random() * Math.PI * 2,
                eyeMoveRatio,
                minLifeTime + Math.random() * (maxLifeTime - minLifeTime),
                openingTime,
                eyeRatio
            ));
        }
        nextGenerateTime = Date.now() + Math.random() * (maxNextGenerateTime - minNextGenerateTime) + minNextGenerateTime;
    }

    eyes = eyes.filter(eye => !eye.isDestroyed);

    const rect = canvas.getBoundingClientRect();
    let x = mousePos.x - rect.left;
    x = x / rect.width * canvas.width;
    let y = mousePos.y - rect.top;
    y = y / rect.height * canvas.height;

    for (const eye of eyes) {
        eye.draw(ctx, eyeImg, {x, y});
    }
}

document.body.addEventListener('mousemove', e => {
    mousePos = {x: e.clientX, y: e.clientY};
    console.log(mousePos);
});

setInterval(update, 1000 / 30);
const canvas = document.getElementById('sequence-canvas');
const context = canvas.getContext('2d');

const frameCount = 80;
const currentFrame = index => (
    `public/image sequencing/Three_t-shirts_rotate_diagonally_202607092127_000/Three_t-shirts_rotate_diagonally_202607092127_${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const imgObj = {
    frame: 0
};

// Resize Canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

// Draw Image covering the canvas (like background-size: cover)
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,
        nh = ih * r,
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

const render = () => {
    if(images[imgObj.frame]) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawImageProp(context, images[imgObj.frame], 0, 0, canvas.width, canvas.height, 0.5, 0.5);
    }
}

// Preload Images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        if(i === 0) {
            resizeCanvas();
        }
    };
    images.push(img);
}

// Scroll Handling
window.addEventListener('scroll', () => {
    // Scroll progress as a percentage
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;

    // Calculate current frame index
    const frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => {
        imgObj.frame = frameIndex;
        render();
    });
});

window.addEventListener('resize', resizeCanvas);

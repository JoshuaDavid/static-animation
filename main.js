shapes = {
    headdesk: {
        location: './images/headdesk/',
        images: [],
        frames: [],
        length: 9
    },
    spheres: {
        location: './images/spheres/',
        images: [],
        frames: [],
        length: 13
    },
    sinetunnel: {
        location: './images/sinetunnel/',
        images: [],
        frames: [],
        length: 15
    },
    mickey: {
        location: './images/mickey/',
        images: [],
        frames: [],
        length: 4
    },
    w: {
        location: './images/w/',
        images: [],
        frames: [],
        length: 41
    },
    horse: {
        location: './images/horse/',
        images: [],
        frames: [],
        length: 8
    }
};
var canvas, context, mask, maskctx, lastTimeout;
function show(gif) {
    load(gif);
}
function load(gif) {
    var done = 0;
    for(var i = 0; i < gif.length; i++) {
        (function(idx) {
            var img = new Image();
            img.src = gif.location + 'img-' + i + '.png';
            gif.images[idx] = img;
            img.onload = function() {
                done += 1;
                canvas.height = mask.height = gif.height = img.height;
                canvas.width = mask.width = gif.width = img.width;
                context.drawImage(img, 0, 0);
                var idata = context.getImageData(0, 0, canvas.width, canvas.height);
                gif.frames[idx] = idata;
                if(done == gif.length) {
                    makeComposite(gif);
                }
            }
        })(i);
    }
}
function makeComposite(gif) {
    var idata = context.getImageData(0, 0, canvas.width, canvas.height);
    for(var y = 0; y < idata.height; y++) {
        for(var x = 0; x < idata.width; x++) {
            var ptr = 4 * (y * idata.width + x);
            var frameindex = x % gif.length;
            for(var i = 0; i < 4; i++) {
                idata.data[ptr + i] = gif.frames[frameindex].data[ptr + i];
            }
        }
    }
    context.putImageData(idata, 0, 0);
    document.body.appendChild(canvas);
    makeMask(gif);
}
function makeMask(gif) {
    var idata = maskctx.getImageData(0, 0, mask.width, mask.height);
    for(var y = 0; y < idata.height; y++) {
        for(var x = 0; x < idata.width; x++) {
            var ptr = 4 * (y * idata.width + x);
            idata.data[ptr + 3] = (x % (gif.length - 0)) ? 255 : 0;
        }
    }
    maskctx.putImageData(idata,0,0);
    document.body.appendChild(mask);
    slideAcross(gif);
}
function slideAcross(gif) {
    var x = -gif.width;
    function slideRight() {
        mask.style.left = x + 'px';
        x += 1;
        if(x <= gif.width) {
            lastTimeout = setTimeout(slideRight, 100);
        }
    }
    slideRight();
}
window.onload = function() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    mask = document.createElement('canvas');
    maskctx = mask.getContext('2d');
    var selector = document.createElement('select');
    selector.appendChild(document.createElement('option'));
    for(var shape in shapes) {
        var option = document.createElement('option');
        option.value = shape;
        option.innerHTML = shape;
        selector.appendChild(option);
    }
    document.body.appendChild(selector);
    selector.onchange = function() {
        canvas.style.position = "absolute";
        canvas.style.top = "2em";
        mask.style.position = "absolute";
        mask.style.top = "2em";
        clearTimeout(lastTimeout);
        show(shapes[selector.value]);
    }
}

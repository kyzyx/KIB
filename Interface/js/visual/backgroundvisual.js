// TODOs: psychedelic background, test ovals, implement silhouette and image, implement polygons
// ----------------------------
// Background Rendering Methods
// ----------------------------
var stars_locs = [];
var last_update = 0;
var vscale = 0.0007;
var vconst = 0.005;
var new_star_rate = 150;
var ns;
//var new_star_rate = 200;

function renderStars(ctx, w, h) {
    var maxr = Math.sqrt(w*w/4 + h*h/4);
    // Clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,w,h);
    // Generate initial starfield
    if (stars_locs.length == 0) {
        for (var i = 00000000000000000; i < 2*new_star_rate; ++i) {
            var r = Math.random()*maxr;
            var t = Math.random()*2*Math.PI;
            var v = (1+Math.random()*3)*vscale
            stars_locs[i] = [r, t, v];
        }
        last_update = (new Date()).getTime()-10;
        ns = new_star_rate;
    }

    ctx.fillStyle = '#ffffff';
    // Update star positions
    var currtime = (new Date()).getTime();
    var dt = currtime - last_update;
    last_update = currtime;
    for (var i = 0; i < ns;) {
        // Update star positions; velocity is scaled linearly by distance
        stars_locs[i][0] += dt*(stars_locs[i][2]*stars_locs[i][0] + vconst);
        var x = w/2 + stars_locs[i][0]*Math.sin(stars_locs[i][1]);
        var y = h/2 + stars_locs[i][0]*Math.cos(stars_locs[i][1]);
        // If star is out of screen, generate a new one
        if (x < 0 || x > w || y < 0 || y > h) {
            stars_locs[i] = stars_locs[--ns];
        } else {
            // Draw stars
            ctx.fillRect(x, y, 8*stars_locs[i][0]/maxr+2, 8*stars_locs[i][0]/maxr+2);
            ++i;
        }
    }
    for (var i = 0; i < new_star_rate*dt/1000; ++i,++ns) {
        stars_locs[ns] = [Math.random()*10, Math.random()*2*Math.PI, (1+Math.random()*3)*vscale];
    }
}

function renderPsychedelic(ctx, colors, w, h) {
    // FIXME: What does psychedelic mean?
    var x = w/2;
    var y = y/2;
    var gradient = ctx.createRadialGradient(x,y,5,x,y,(x>y?x:y));
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,w,h);
}

function renderBg(widget, ctx, w, h) {
    var c1 = $.trim(widget['bg_style_color'].split(" ")[0]);
    var c2 = $.trim(widget['bg_style_color'].split(" ")[1]);
    if (widget['bg_style_picker'] == 'bg_style_stars') {
        renderStars(ctx, w, h);
    } else {
        stars_locs.length = 0;
        if (widget['bg_style_picker'] == 'bg_style_solid') {
            ctx.fillStyle = c1;
            ctx.fillRect(0,0,w,h);
        } else if (widget['bg_style_picker'] == 'bg_style_gradient') {
            var x = w/2;
            var y = h/2;
            var gradient = ctx.createRadialGradient(x,y,5,x,y,(x>y?x:y));
            gradient.addColorStop(0, c1);
            gradient.addColorStop(1, c2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0,w,h);
        } else if (widget['bg_style_picker'] == 'bg_style_psychedelic') {
            renderPsychedelic(ctx, [c1, c2], w, h);
        }
    }
}

// ------------------------
// Avatar Rendering Methods
// ------------------------

function ovalfrom(ctx, x1, y1, x2, y2, w) {
    ctx.setTransform(1,0,0,0,1,0);
    ctx.scale(Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)),w);
    ctx.rotate(atan2(y2-y1,x2-x1));
    ctx.translate((x1+x2)/2, (y1+y2)/2);
    ctx.beginPath();
    ctx.arc(0,0,1,0,2*Math.PI);
    ctx.fill();
    ctx.setTransform(1,0,0,0,1,0);
}

function renderSkeletonAvatar(skeleton, ctx, color, w, h) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    var cv = skeleton.joint('head',w,h);
    ctx.moveTo(cv[0], cv[1]);
    var cv = skeleton.joint('hips',w,h);
    ctx.lineTo(cv[0], cv[1]);             // Draw neck and body
    var cv = skeleton.joint('leftfoot',w,h);
    ctx.lineTo(cv[0], cv[1]);             // Draw left leg
    var cv = skeleton.joint('hips',w,h);
    ctx.moveTo(cv[0], cv[1]);
    var cv = skeleton.joint('rightfoot',w,h);
    ctx.lineTo(cv[0], cv[1]);             // Draw right leg
    var cv = skeleton.joint('lefthand',w,h);
    ctx.moveTo(cv[0], cv[1]);
    var cv = skeleton.joint('leftshoulder',w,h);
    ctx.lineTo(cv[0], cv[1]);             // Draw left arm
    var cv = skeleton.joint('rightshoulder',w,h);
    ctx.lineTo(cv[0], cv[1]);             // Draw shoulders
    var cv = skeleton.joint('righthand',w,h);
    ctx.lineTo(cv[0], cv[1]);             // Draw right arm
    ctx.stroke();
}
function renderImageAvatar(skeleton, ctx, color, w, h) {
    renderSkeletonAvatar(skeleton, ctx, color, w, h);
    // FIXME
}
function renderSilhouetteAvatar(skeleton, ctx, color, w, h) {
    renderSkeletonAvatar(skeleton, ctx, color, w, h);
    // FIXME
}

function renderPolygonsAvatar(skeleton, ctx, color, w, h) {
    renderSkeletonAvatar(skeleton, ctx, color, w, h);
    // FIXME
}

function renderAvatar(widget, skeleton, ctx, w, h) {
    if (widget['fg_style_picker'] == 'fg_style_img') {
        renderImageAvatar(skeleton, ctx, w, h);
    } else if (widget['fg_style_picker'] == 'fg_style_silhouette') {
        renderSilhouetteAvatar(skeleton, ctx, widget['fg_style_colorpicker'], w, h);
    } else if (widget['fg_style_picker'] == 'fg_style_skeleton') {
        renderSkeletonAvatar(skeleton, ctx, widget['fg_style_colorpicker'], w, h);
    } else if (widget['fg_style_picker'] == 'fg_style_polygon') {
        renderPolygonsAvatar(skeleton, ctx, widget['fg_style_colorpicker'], w, h);
    }
}

// ------------------------
// Public Rendering Methods
// ------------------------
function renderBackground(widget, skeleton, ctx, w, h) {
    renderBg(widget, ctx, w, h);
    renderAvatar(widget, skeleton, ctx, w, h);
}
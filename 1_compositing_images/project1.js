// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    console.log(fgImg.data[3])
    var bgX, bgY, bgIdx;
    var cnt = 0;
    for (var fgIdx = 0; fgIdx < fgImg.data.length; fgIdx+=4){ 
        // check if this pixel overlaps background image
        bgX = Math.floor((fgIdx/4) % fgImg.width + fgPos.x);
        bgY = Math.floor((fgIdx/4) / fgImg.width + fgPos.y);
        
        if (outOfRange(bgX, bgY, bgImg.width, bgImg.height))
            continue;
        // we can optimize this A LOT only iterating through the intersecting part

        // calculate pixel index in background image array
        bgIdx = (bgY * bgImg.width + bgX) * 4;

        // calculate new rgba 
        if (fgOpac == 0) cnt+=1;
        
        calculateNewColor(bgImg.data, bgIdx, fgImg.data, fgIdx, fgOpac)
    }
}

function calculateNewColor(bgData, bgIdx, fgData, fgIdx, fgOpac){
    var bgColor = bgData.slice(bgIdx, bgIdx+4);
    var fgColor = fgData.slice(fgIdx, fgIdx+4);
    
    var fgAlpha = Number(fgColor[3])/255 * fgOpac;
    var bgAlpha = Number(bgColor[3])/255;

    // calculate alpha channel
    bgData[bgIdx+3] = fgAlpha + (1-fgAlpha)*bgAlpha; // alpha
    if (bgData[bgIdx+3] === 0.0)  return;

    // calculate RGB channels
    for (var c = 0; c < 3; ++c){
        bgData[bgIdx+c] = Math.round((fgAlpha*fgColor[c] + (1-fgAlpha)*bgColor[c]*bgAlpha) / bgData[bgIdx+3])
    }
    bgData[bgIdx+3] = Math.round(bgData[bgIdx+3]*255)
}

function outOfRange(x, y, width, height){
    return !(x >= 0 && x < width && y >= 0 && y < height)
}

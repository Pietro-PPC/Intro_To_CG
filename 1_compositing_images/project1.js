// Made by Pietro Polinari Cavassin

// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{   
    // calculate intersection between foreground and background
    var lowX = Math.max(fgPos.x, 0);
    var lowY = Math.max(fgPos.y, 0);
    var highX = Math.min(fgPos.x + fgImg.width, bgImg.width);
    var highY = Math.min(fgPos.y + fgImg.height, bgImg.height);

    // Iterate only through pixels in intersection.
    var fgX, fgY, bgX, bgY, bgIdx, fgIdx;
    for (bgX = lowX; bgX < highX; ++bgX){
        for (bgY = lowY; bgY < highY; ++bgY){
            fgX = bgX - fgPos.x;
            fgY = bgY - fgPos.y;

            // Convert image x and y coordinates to index in pixel array
            bgIdx = (bgY * bgImg.width + bgX) * 4; 
            fgIdx = (fgY * fgImg.width + fgX) * 4; 

            calculateNewColor(bgImg.data, bgIdx, fgImg.data, fgIdx, fgOpac);
        }
    }
}

// This is where all the magic happens.
function calculateNewColor(bgData, bgIdx, fgData, fgIdx, fgOpac){
    // normalize alphas between 0 and 1
    var bgAlpha = bgData[bgIdx+3]/255;
    var fgAlpha = fgData[fgIdx+3]/255 * fgOpac;

    // calculate alpha channel
    var alpha = fgAlpha + (1-fgAlpha)*bgAlpha;
    if (alpha === 0.0) return;

    // calculate and update RGB channels
    for (var c = 0; c < 3; ++c)
        bgData[bgIdx+c] = (fgAlpha*fgData[fgIdx+c] + (1-fgAlpha)*bgData[bgIdx+c]*bgAlpha) / alpha;
    
    // update alpha channel
    bgData[bgIdx+3] = alpha*255;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	var pi = Math.acos(-1);

	var scaleMat = Array(
		scale, 0, 0, 
		0, scale, 0, 
		0, 0, 1
	);

	var radRotation = (rotation*pi)/180;
	var rotationMat = Array(
		Math.cos(radRotation),    Math.sin(radRotation), 0,
		-1*Math.sin(radRotation), Math.cos(radRotation), 0,
		0, 0, 1
	)

	var translationMat = Array(
		1, 0, 0,
		0, 1, 0,
		positionX, positionY, 1
	)

	return ApplyTransform(ApplyTransform(scaleMat, rotationMat), translationMat);;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	var ret = Array( 0, 0, 0, 0, 0, 0, 0, 0, 0 );

	for (var j = 0; j < 3; ++j){
		for (var i = 0; i < 3; ++i){
			for (var k = 0; k < 3; ++k)
				ret[i+3*j] += trans2[i+3*k]*trans1[k+3*j];
		}
	}
	
	return ret;
}

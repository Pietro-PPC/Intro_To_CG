// [TO-DO] Complete the implementation of the following class and the vertex shader below.

class CurveDrawer {
	constructor()
	{
		this.prog   = InitShaderProgram( curvesVS, curvesFS );
		// [TO-DO] Other initializations should be done here.
		// [TO-DO] This is a good place to get the locations of attributes and uniform variables.

		this.buffer = {};
		this.attrib = {};
		this.uniform = {};

		this.attrib.t = gl.getAttribLocation(this.prog, 't');
		
		this.uniform.mvp = gl.getUniformLocation(this.prog, 'mvp');

		this.uniform.p = [];
		this.uniform.p.push(gl.getUniformLocation(this.prog, 'p0'));
		this.uniform.p.push(gl.getUniformLocation(this.prog, 'p1'));
		this.uniform.p.push(gl.getUniformLocation(this.prog, 'p2'));
		this.uniform.p.push(gl.getUniformLocation(this.prog, 'p3'));

		// Initialize the attribute buffer
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		// [TO-DO] This is where you can create and set the contents of the vertex buffer object
		// for the vertex attribute we need.

		// Create buffer for tv and send data to GPU
		this.buffer.t = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.t);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);

	}
	setViewport( width, height )
	{
		// [TO-DO] This is where we should set the transformation matrix.
		// [TO-DO] Do not forget to bind the program before you set a uniform variable value.
		gl.useProgram( this.prog );	// Bind the program
		var transfMatrix = [ // column major
			2/width, 0,         0, 0,
			0,       -2/height, 0, 0,
			0,       0,         1, 0,
			-1,      1,         0, 1
		];
		gl.uniformMatrix4fv(this.uniform.mvp, false, transfMatrix);

	}
	updatePoints( pt )
	{
		// [TO-DO] The control points have changed, we must update corresponding uniform variables.
		// [TO-DO] Do not forget to bind the program before you set a uniform variable value.
		// [TO-DO] We can access the x and y coordinates of the i^th control points using
		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");

		gl.useProgram(this.prog);
		for (var i = 0; i < 4; ++i)
			gl.uniform2f(this.uniform.p[i], pt[i].getAttribute("cx"), pt[i].getAttribute("cy"));
		
	}
	draw()
	{
		// [TO-DO] This is where we give the command to draw the curve.
		// [TO-DO] Do not forget to bind the program and set the vertex attribute.

		
		// Set t attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.t);
		gl.vertexAttribPointer(this.attrib.t, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.attrib.t);
		
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(this.prog);
		gl.drawArrays(gl.LINE_STRIP, 0, this.steps);
		// console.log("to desenhando");
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{
		// [TO-DO] Replace the following with the proper vertex shader code
		float tComp = 1.0-t;
		vec2 finalPos = (tComp*tComp*tComp * p0) + (3.0 * tComp*tComp*t * p1) + (3.0 * tComp*t*t * p2) + (t*t*t * p3);
		gl_Position = mvp * vec4(finalPos,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;
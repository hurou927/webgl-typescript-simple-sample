
window.onload = () => {
    const cvs = document.getElementById('canvas') as HTMLCanvasElement;
    cvs.width = 500;
    cvs.height = 300;

    const gl = cvs.getContext('webgl2');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    function getShader(type: number,  source: string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    const program = gl.createProgram();
    const vertexShader = getShader(gl.VERTEX_SHADER, require('./glsl/vert.glsl').default);
    console.log(vertexShader);
    gl.attachShader(program, vertexShader);
    const fragmentShader =  getShader(gl.FRAGMENT_SHADER, require('./glsl/frag.glsl').default);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    function transferData(data: number[], loc: number) {
        gl.enableVertexAttribArray(loc);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
    }

    gl.useProgram(program);
    const position = [
        0.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ]
    const positionLoc = gl.getAttribLocation(program, 'position');
    transferData(position, positionLoc);

    const color = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
    ];
    const inColorLoc = gl.getAttribLocation(program, 'inColor');
    transferData(color, inColorLoc);
    const transform = [
        0.5, 0, 0, 0,
        0, 0.5, 0, 0,
        0, 0, 0.5, 0,
        0, 0, 0, 1
    ];
    const transformLoc = gl.getUniformLocation(program, 'transform');
    gl.uniformMatrix4fv(transformLoc, false, transform);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
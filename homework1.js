"use strict";

var canvas;
var gl;
var numVertices  = 102;
var program;
var c;
var flag = true;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var near = 1.40;
var far = 3;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var materialAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
var materialShininess = 5.0;


// Directional light parameters

var lightPositionDir = vec4(1.5, 0.1, 0.2, 1.0);
var lightAmbientDir = vec4(0.5, 0.6, 0.1, 1.0);
var lightDiffuseDir = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecularDir = vec4(1.0, 1.0, 1.0, 1.0);
var texture = 1.0;

// Spotlight parameters
var cutoff = 0.19;
var alpha = 0.65;
var xPos = 0, yPos = 0.3, zPos = -4.2, xDir = 0, yDir = 0, zDir = -0.4 ;
var spotLightPosition = vec4(xPos, yPos, zPos, 1.0);
var spotLightDirection = vec4(xDir, yDir, zDir, 1.0);
var spotLightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var spotLightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var spotLightSpecular = vec4(1.0, 1.0, 1.0, 1.0);


// Global light 
var globalLight = vec4(0.3, 0.1, 0.1, 1.0);

var texCoordsArray = [];

/*
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
*/

var texCoord = [
    vec2(0.42, 0.27),
    vec2(0.54, 0.26),
    vec2(0.54, 0.70),
    vec2(0.41, 0.68),
    vec2(0.94, 0.92),
    vec2(0.87, 0.85),
    vec2(0.94, 0.69),
    vec2(0.84, 0.12),
    vec2(0.91, 0.00),
    vec2(0.91, 0.12),
    vec2(0.39, 0.93),
    vec2(0.32, 0.71),
    vec2(0.84, 0.33),
    vec2(0.95, 0.16),
    vec2(0.95, 0.41),
    vec2(0.76, 0.00),
    vec2(0.76, 0.78),
    vec2(0.54, 0.78),
    vec2(0.32, 0.00),
    vec2(0.32, 1.00),
    vec2(0.00, 0.62),
    vec2(0.77, 0.69),
    vec2(0.76, 0.41),
    vec2(0.87, 0.41),
    vec2(0.87, 0.68),
    vec2(0.34, 0.25),
    vec2(0.39, 0.03),
    vec2(0.42, 0.10),
    vec2(0.88, 0.41),
    vec2(0.95, 0.42),
    vec2(0.95, 0.69),
    vec2(0.87, 0.69),
    vec2(0.48, 0.00),
    vec2(0.81, 0.95),
    vec2(0.54, 0.96),
    vec2(0.56, 0.78),
    vec2(0.81, 0.78),
    vec2(0.78, 0.69),
    vec2(0.78, 0.70),
    vec2(0.76, 0.69),
    vec2(0.76, 0.41),
    vec2(0.77, 0.00),
    vec2(0.84, 0.00),
    vec2(0.84, 0.41),


  



 
]

var vertices = [
    vec4(0.06, 0.03, -0.17, 1.00),
vec4(0.06, -0.16, -0.00, 1.00),
vec4(-0.53, -0.16, -0.00, 1.00),
vec4(-0.58, 0.03, -0.19, 1.00),
vec4(-0.57, 0.03, 0.19, 1.00),
vec4(-0.58, 0.03, 0.00, 1.00),
vec4(-0.86, 0.03, 0.00, 1.00),
vec4(0.48, 0.03, 0.15, 1.00),
vec4(0.47, -0.16, -0.00, 1.00),
vec4(0.47, 0.03, -0.01, 1.00),
vec4(0.09, 1.25, 0.00, 1.00),
vec4(0.09, 0.05, 0.00, 1.00),
vec4(0.59, 0.05, -0.09, 1.00),
vec4(0.06, 1.25, 0.00, 1.00),
vec4(-0.89, 0.05, -0.02, 1.00),
vec4(0.06, 0.05, 0.00, 1.00),
vec4(0.06, 0.03, 0.17, 1.00),
vec4(0.06, 0.03, 0.00, 1.00),
vec4(0.47, 0.03, -0.16, 1.00),

];




var thetaLoc;

function loadUV()
{
    var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 
             3, 12, 13, 14, 15, 16, 17, 3, 2, 10, 
             18, 19, 20, 21, 22, 23, 24, 0, 3, 11, 
             25, 25, 26, 27, 0, 28, 29, 30, 31, 27, 
             32, 1, 0, 26, 32, 27, 33, 34, 35, 36, 
             37, 38, 39, 40, 41, 42, 43];

    
    var i = 0;
    while(i < texCoord.length)
    {
        
        texCoordsArray.push(texCoord[l[i]]);
        i = i+1;
    }
}

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     
}


function quadText(a, b, c, d, t1, t2, t3, t4) {

    var t1_ = subtract(vertices[b], vertices[a]);
    var t2_ = subtract(vertices[c], vertices[b]);
    var normal = cross(t1_, t2_);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[t1])

    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[t2])
    

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[t3])
    

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[t1])
    

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[t3])
    

    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[t4])
    
}


function colorCubeTex()
{
    quadText(15, 18, 1, 4, 0, 1, 2, 3);
    quadText(2, 7, 5, 5, 4, 5, 6, 6);
    quadText(0, 17, 6, 0, 7, 8, 9, 7);
    quadText(5, 7, 4, 4, 10, 11, 3, 3);
    quadText(2, 5, 1, 1, 12, 13, 14, 14);
    quadText(11, 12, 13, 13, 15, 16, 17, 17);
    quadText(4, 1, 5, 5, 3, 2, 10, 10);
    quadText(8, 9, 10, 10, 18, 19, 10, 10);
    quadText(0, 16, 18, 17,21, 22, 23, 24 );
    quadText(15, 4, 7, 14, 0, 3, 11, 25 );
    quadText(14, 6, 3, 15, 25, 26, 27, 0);
    quadText(0, 6, 14, 16, 28, 29, 30, 31 );
    quadText(3, 17, 18, 15, 27, 32, 1, 0 );
    quadText(6, 17, 3, 3, 26, 32, 27, 27);
    quadText(16, 2, 1, 18, 33, 34, 35, 36);
    quadText(10, 14, 12, 12, 37, 38, 39, 39);
    quadText(2, 16, 14, 7, 40, 41, 42, 43);




}


function colorCube()
{
    quad(15, 18, 1, 4, );
    quad(2, 7, 5, 5);
    quad(0, 17, 6, 0);
    quad(5, 7, 4, 4);
    quad(2, 5, 1, 1);
    quad(11, 12, 13, 13);
    quad(4, 1, 5, 5);
    quad(8, 9, 10, 10);
    quad(0, 16, 18, 17, );
    quad(15, 4, 7, 14, );
    quad(14, 6, 3, 15, );
    quad(0, 6, 14, 16, );
    quad(3, 17, 18, 15, );
    quad(6, 17, 3, 3);
    quad(16, 2, 1, 18, );
    quad(10, 14, 12, 12);
    quad(2, 16, 14, 7, );
}

function configureTexture( image ) 
{
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);
}




window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCubeTex();
    //loadUV();
    console.log(texCoordsArray)

    // Load normals 
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

  
    // Load positions
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Load texCoords
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    // Getting the modelView and projection matrixes
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    var ambientProductDir = mult(lightAmbientDir, materialAmbient);
    var diffuseProductDir = mult(lightDiffuseDir, materialDiffuse);
    var specularProductDir = mult(lightSpecularDir, materialSpecular);
    
    
    var ambientProductSpot = mult(spotLightAmbient, materialAmbient);
    var diffuseProductSpot = mult(spotLightDiffuse, materialDiffuse);
    var specularProductSpot = mult(spotLightSpecular, materialSpecular);
    
    var globalLightProduct = mult(globalLight, materialAmbient);



    gl.uniform4fv(gl.getUniformLocation(program, "uGlobalLightProduct"),
       globalLightProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductDir"),
       ambientProductDir);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductDir"),
       diffuseProductDir);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductDir"),
       specularProductDir);
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionDir"),
       lightPositionDir );
    
       
    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductSpot"),
       ambientProductSpot);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductSpot"),
       diffuseProductSpot);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductSpot"),
       specularProductSpot);
    
    
    
    
    gl.uniform1f(gl.getUniformLocation(program,
        "uShininess"),materialShininess);

    
    var image = document.getElementById("texImage");
    configureTexture(image);

    loadFromHTML();
    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
               radius*Math.sin(theta)*Math.sin(phi), 
               radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    spotLightPosition = vec4(xPos, yPos, zPos, 1.0);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotLightPosition"),
       spotLightPosition);

    spotLightDirection = vec4(xDir, yDir, zDir, 1.0);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotLightDirection"),
        spotLightDirection);

    
    gl.uniform1f(gl.getUniformLocation(program, "uTextureON"), texture);
    gl.uniform1f(gl.getUniformLocation(program, "uCutoff"), cutoff);
    gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), alpha);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimationFrame(render);
}

var loadFromHTML = function() {
    // modelView and projection parameters from HTML
    //Load at least one
    far = document.getElementById("zFarSlider").value

    document.getElementById("zFarSlider").onchange = function(event) {
        far = event.target.value; 
        document.getElementById("zFarLabel").innerHTML = far
    };
    document.getElementById("zNearSlider").onchange = function(event) {
        near = event.target.value;
        document.getElementById("zNearLabel").innerHTML = near
    };
    document.getElementById("radiusSlider").onchange = function(event) {
       radius = event.target.value;
       document.getElementById("radiusLabel").innerHTML = radius
    };
    document.getElementById("thetaSlider").onchange = function(event) {
        theta = event.target.value* Math.PI/180.0;
        document.getElementById("thetaLabel").innerHTML = event.target.value
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
        document.getElementById("phiLabel").innerHTML = event.target.value
    };
    document.getElementById("aspectSlider").onchange = function(event) {
        aspect = event.target.value;
        document.getElementById("aspectLabel").innerHTML = aspect
    };
    document.getElementById("fovSlider").onchange = function(event) {
        fovy = event.target.value;
        document.getElementById("fovLabel").innerHTML = fovy
    };
    document.getElementById("cutoffSlider").onchange = function(event) {
        cutoff = event.target.value;
        document.getElementById("cutoffLabel").innerHTML = event.target.value
    };
    document.getElementById("alphaSlider").onchange = function(event) {
        alpha = event.target.value;
        document.getElementById("alphaLabel").innerHTML = event.target.value
    };
    document.getElementById("xPosSlider").onchange = function(event) {
        xPos = event.target.value;
        document.getElementById("xPosLabel").innerHTML = event.target.value
    };
    document.getElementById("yPosSlider").onchange = function(event) {
        yPos = event.target.value;
        document.getElementById("yPosLabel").innerHTML = event.target.value
    };
    document.getElementById("zPosSlider").onchange = function(event) {
        zPos = event.target.value;
        document.getElementById("zPosLabel").innerHTML = event.target.value
    };
    document.getElementById("xDirSlider").onchange = function(event) {
        xDir = event.target.value;
        document.getElementById("xDirLabel").innerHTML = event.target.value
    };
    document.getElementById("yDirSlider").onchange = function(event) {
        yDir = event.target.value;
        document.getElementById("yDirLabel").innerHTML = event.target.value
    };
    document.getElementById("zDirSlider").onchange = function(event) {
        zDir = event.target.value;
        document.getElementById("zDirLabel").innerHTML = event.target.value
    };
    document.getElementById("textureButton").onclick = function(event) {
        if(texture > 0.0)
            texture = 0.0;
        else
            texture = 1.0;
    };

}

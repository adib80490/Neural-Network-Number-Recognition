
let nn;
let brainJson;
let drawing = false;
let x0;
let y0;


let guessBtn;
let resetBtn;
let pGuess;

const INPUT_W = 28;
const INPUT_H = 28;

const INPUT_LENGTH = INPUT_W * INPUT_H;

const OUTPUT_LENGTH = 10;

let xscl;
let yscl;

let inputs;
let outputs;

function preload(){
	brainJson = loadJSON('mnist_784_200_10_nn.json');
}

function setup() {
	
	createCanvas(140, 140);
	nn = NeuralNetwork.deserialize(brainJson);
	
	guessBtn = createButton("Guess");
	guessBtn.mousePressed(getGuess);
	
	resetBtn = createButton("Reset");
	resetBtn.mousePressed(resetCanvas);
	
	pGuess = createElement('h2',"");
	
	pixelDensity(1);
	
	xscl = width/INPUT_W;
	yscl = height/INPUT_H;
	
	background(0);
	
	
}

function mousePressed(){
	drawing = true;
	
	x0 = mouseX;
	y0 = mouseY;
}

function mouseReleased(){
	
	drawing = false;
}


function draw() {
	
	if(drawing){
		stroke(255);
		strokeWeight(10);
		line(mouseX, mouseY, x0, y0);
		x0 = mouseX;
		y0 = mouseY;
	}
}

function index(x, y, w){
	
	return (y*w + x);
	
}

function getGuess(){
	
	let input = new Array(INPUT_LENGTH).fill(0);
	
	let sum = 0;
	let p = 0;
	loadPixels();
	
	let centerX = 0;
	let centerY = 0;
	let points = 0;
	
	let pixelsMax = xscl*yscl;
	
	for(let x = 0; x<INPUT_W; x++){
		for(let y = 0; y<INPUT_H; y++){
			let s = 0;
			for(let i = 0; i<xscl; i++){
				for(let j = 0; j<yscl; j++){
					s += pixels[index(x*xscl+i,y*yscl+j, width)*4]/pixelsMax;
				}				
			}
			
			
			if(s > 0){
				centerX += x;
				centerY += y;
				points++;
			}
			
			
			input[index(x, y, INPUT_W)] = s/255;
			
		}
	}
	
	centerX = centerX/points;
	centerY = centerY/points;
	
	xc = centerX*xscl;
	yc = centerY*yscl;
	
	
	centerX = floor(INPUT_W/2-centerX);
	centerY = floor(INPUT_H/2-centerY);
	
	
	let correctedInput = new Array(INPUT_LENGTH).fill(0);
	
	for(let i = 0; i<INPUT_LENGTH; i++){
		let x = floor((i % INPUT_W));
		let y = floor(((i-x)/INPUT_H));
		if(input[index(x, y, INPUT_W)]>0){
			correctedInput[index(x+centerX, y+centerY, INPUT_W)] = input[index(x, y, INPUT_W)];
		}
	}

	input = correctedInput;
	
	background(0);
	
	for(let x = 0; x<INPUT_W; x++){
		for(let y = 0; y<INPUT_H; y++){
			let ind = x+y*INPUT_W;
			fill(floor(input[ind]*255));
			noStroke();
			rect(x*xscl, y*yscl, xscl, yscl);
			
		}
	}
	
	let output = nn.predict(input);
	
	let max = 0;
	let maxi = 0;
	for(let i = 0; i<OUTPUT_LENGTH; i++){
		if(output[i]>max){
			max = output[i];
			maxi = i;
		}
	}
	pGuess.html(maxi);
}

function resetCanvas(){
	background(0);
}
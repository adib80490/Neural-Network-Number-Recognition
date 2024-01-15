let data;
let nn;

function preload(){
	
  data = loadJSON('mnist.json');
}

function setup() {
	
	nn = new NeuralNetwork(784, 200, 10);
	
	for(let n = 0; n<60000; n++){
		let input = data[n].data;
		let target = new Array(10).fill(0);
		target[data[n].label] = 1;
		
		nn.train(input, target);
	}
	
	console.log("done training");
	
	saveJSON(nn, 'mnist_784_64_10_nn.json');

}

function draw() {
  
}
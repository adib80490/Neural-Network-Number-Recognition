let data;
let nn;
let brainJson;

function preload(){
	
	data = loadJSON('mnist_test.json');
	brainJson = loadJSON('mnist_784_200_10_nn.json');
	
	
}

function setup() {
	
	nn = NeuralNetwork.deserialize(brainJson);
	
	let correct = 0;
	
	for(let n = 0; n<10000; n++){
		
		let input = data[n].data;
		let output = nn.predict(input);
		let max = 0;
		let maxi = 0;
		
		for(let i = 0; i<10; i++){
			if(output[i]>max){
				max = output[i];
				maxi = i;
			}
		}
		if(maxi == data[n].label){
			correct++;
		}		
	}
	
	console.log(correct/100);
}

function train(){
	
	let brain = new NeuralNetwork(784, 64, 10);
	
	for(let n = 0; n<60000; n++){
		let input = data[n].data;
		let target = new Array(10).fill(0);
		target[data[n].label] = 1;
		
		brain.train(input, target);
	}
	
	console.log("done training");
	
	saveJSON(brain, 'mnist_784_64_10_nn.json');
}

function draw() {
	
}
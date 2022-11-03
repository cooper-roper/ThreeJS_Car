import * as THREE from "https://unpkg.com/three@0.138.0/build/three.module.js"
import {createCar} from './car.js'
//import * as CANNON from 'cannon-es'
//import {OrbitControls} from 'orbitControls'

// The three.js scene: the 3D world where you put objects

var playerDirection = 0;//angles 0 - 2pi
var dVector;
var speed = 0;
var playerSpeed = 30;
var angularSpeed = 0.05;
var playerIsRotating = 0;
var playerIsMovingForward = 0;
var playerIsMovingBackwards = 0;
var thrusting = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xADD8E6 );

var keyMap = {}; // You could also use an array

document.addEventListener("keydown", key_down, false);
document.addEventListener("keyup", key_up, false);

// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

//lighting

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

//world

//const world = new CANNON.World();
//world.gravity.set(0, -9.82, 0);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1, 50);
directionalLight.position.set(0, 5, 0);
scene.add(directionalLight);
directionalLight.castShadow = true;

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Append the renderer canvas into <body>
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

dVector = new THREE.Vector3( 0, 0, 0 ) ;

//controls
//const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set( dVector.x -100, dVector.y + 500, dVector.z + 1000 );
//controls.update();

//ground
const ground = new THREE.Mesh (
  // The geometry: the shape & size of the object
  new THREE.PlaneGeometry(10000,10000),
  // The material: the appearance (color, texture) of the object
  new THREE.MeshStandardMaterial({ color: 0xA9A9A9})
);

ground.position.set(0,-5,0);

ground.rotateX(-Math.PI / 2);

ground.receiveShadow = true; 


const grass = new THREE.Mesh (
  // The geometry: the shape & size of the object
  new THREE.PlaneGeometry(100000, 100000),
  // The material: the appearance (color, texture) of the object
  new THREE.MeshStandardMaterial({ color: "darkgreen" })
);

grass.position.set(0,-8,0);

grass.rotateX(-Math.PI / 2);


var buildings = []
for(let i = 0; i < 20; i++){
	const building = new THREE.Mesh (
	  // The geometry: the shape & size of the object
	  new THREE.BoxGeometry(500, getRandomInt(500,2000), 500),
	  // The material: the appearance (color, texture) of the object
	  new THREE.MeshBasicMaterial({ color: 0x8f5353 })
	);

	building.position.set(getRandomInt(-4750,4750), 0, getRandomInt(-4750,4750))
	building.castShadow = true;
	building.receiveShadow = true;
	buildings.push(building)
	scene.add(building);
}


//car
const car = new createCar();

var carBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
carBox.setFromObject(car.children[0]);

car.castShadow = true; //default is false

scene.add(car, ground, grass);




// The mesh: the geometry and material combined, and something we can directly add into the scene (I had to put this line outside of the object literal, so that I could use the geometry and material properties)



function key_up(event){

    keyMap[event.key] = event.type == 'keydown';

    if(!keyMap['a'] && !keyMap['d']){
        playerIsRotating = 0;
    }
	
    if(!keyMap['w']){ // go forward
		playerIsMovingForward = 0;
    }
    if(!keyMap['s']){ // go back 
		playerIsMovingBackwards = 0;
    }
}

function updatePlayer(){
    if(playerIsMovingForward || playerIsMovingBackwards){ // rotate left
		playerDirection += angularSpeed * -playerIsRotating;
		if (speed < playerSpeed) speed += 1;
    }
	
	if (speed > 0 && !(playerIsMovingForward || playerIsMovingBackwards)){
		speed -= 1;
	} 

	
	//for (const b in buildings){
	//	var box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	//	box.setFromObject(b);
	//	if (carBox.containsBox(box)) {
	//		thrust *= -1;
	//		break;
	//	}
	//}
	
	if (speed == 0){
		thrusting = 0;
	}
	
	setPlayerDirection();	
	moveForward(speed * thrusting);	

}

function key_down(event){

    keyMap[event.key] = event.type == 'keydown';
	
    if(keyMap['a']){ // rotate left
        playerIsRotating = 1;
    }
    if(keyMap['d']){ // rotate right
        playerIsRotating = -1;
    }
	if(keyMap['d'] && keyMap['a']){ // rotate right
        playerIsRotating = 0;
    }
	
    if(keyMap['w'] && thrusting != -1){ // go forward
        playerIsMovingForward = 1;
		thrusting = 1;
    }
    if(keyMap['s'] && thrusting != 1){ // go back 
        playerIsMovingBackwards = 1;
		thrusting = -1;
    }

}

function render() {
  // Render the scene and the camera
	
	renderer.render(scene, camera);

	updatePlayer();

  // Make it call the render() function about every 1/60 second
	camera.lookAt(dVector);
	camera.position.set( dVector.x -100, 500, dVector.z+ 1000 );
	requestAnimationFrame(render);
	
}

function moveForward(speed){
    var delta_x = speed * ((thrusting == -1) ? 0.5 : 1) * Math.cos(playerDirection);
    var delta_z = speed * ((thrusting == -1) ? 0.5 : 1) * Math.sin(playerDirection);

    var new_dx = dVector.x + delta_x;
    var new_dz = dVector.z + delta_z;
    dVector.x = new_dx;
    dVector.z = new_dz;
    car.position.set(dVector.x, dVector.y, dVector.z )

}

function setPlayerDirection(){
    //direction changed.
	if(playerIsMovingForward || playerIsMovingBackwards){
	    var delta_y = angularSpeed * (playerIsRotating);
	
		car.rotation.y += delta_y;
		
	    dVector.y = delta_y;
	}
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


render();
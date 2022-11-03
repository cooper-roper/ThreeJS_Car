import * as THREE from "https://unpkg.com/three@0.138.0/build/three.module.js"

function createWheels() {
  const geometry = new THREE.CylinderGeometry(8, 8, 33, 64);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  geometry.rotateX(Math.PI / 2);
  const wheel = new THREE.Mesh(geometry, material);
  return wheel;
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}

export function createCar() {
	const car = new THREE.Group();
	
	const main = new THREE.Mesh(
		new THREE.BoxGeometry(60, 15, 30),
		new THREE.MeshLambertMaterial({ color: 0xa52523 })
	);
	main.position.y = 12;
	car.add(main);
	
	const carFrontTexture = getCarFrontTexture();
	
	const carBackTexture = getCarFrontTexture();
	
	const carRightSideTexture = getCarSideTexture();
	
	const carLeftSideTexture = getCarSideTexture();
	carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
	carLeftSideTexture.rotation = Math.PI;
	carLeftSideTexture.flipY = false;
	
	const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
	new THREE.MeshLambertMaterial({ map: carFrontTexture }),
	new THREE.MeshLambertMaterial({ map: carBackTexture }),
	new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
	new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
	new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
	new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
	]);
	cabin.position.x = -6;
	cabin.position.y = 25.5;
	
	car.add(cabin);


	const backWheel = createWheels();
	backWheel.position.y = 6;
	backWheel.position.x = -18;
	car.add(backWheel);
	
	const frontWheel = createWheels();
	frontWheel.position.y = 6;
	frontWheel.position.x = 18;
	car.add(frontWheel);

	

  return car;
}

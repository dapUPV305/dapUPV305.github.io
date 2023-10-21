import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js"
import Stats from "../lib/stats.module.js"

// Variables estandar
let renderer, scene, camera;

//  Globales
const vertices = new Float32Array( [
    -9.5, -10.0, 0.0,  9.5, -10.0, 0.0,  9.5, 10.0, 0.0,  -9.5, 10.0, 0.0,
    -9.5, -10.0, 4.0,  9.5, -10.0, 4.0,  9.5, 10.0, 4.0,  -9.5, 10.0, 4.0,
    28.5, -5.0, 0.0,  28.5,  5.0, 0.0,  28.5, -5.0, 2.0,  28.5, 5.0, 2.0,
]);

const vertices_flip = new Float32Array( [
    -9.5, -10.0, 0.0,  9.5, -10.0, 0.0,  9.5, 10.0, 0.0,  -9.5, 10.0, 0.0,
    -9.5, -10.0, 4.0,  9.5, -10.0, 4.0,  9.5, 10.0, 4.0,  -9.5, 10.0, 4.0,
    28.5, -5.0, 2.0,  28.5,  5.0, 2.0,  28.5, -5.0, 4.0,  28.5, 5.0, 4.0,
] );

const indices = [
    5, 6, 4,  4, 6, 7,
    5, 1, 2,  5, 2, 6,
    7, 6, 2,  7, 2, 3,
    0, 4, 7,  0, 7, 3,
    1, 3, 2,  1, 0, 3,
    4, 0, 1,  4, 1, 5,
    
    10, 11, 5, 5, 11, 6,
    10, 8, 9, 10, 9, 11,
    6, 11, 9, 6, 9, 2,
    1, 5, 6,  1, 6, 2,
    8, 2, 9, 8, 1, 2,
    5, 1, 8, 5, 8, 10
];

let planta;
let stats;
const L = 40;
let effectController;
const xSpeed = 10;
const ySpeed = 10;
let base;
let floor;
let eje;
let rotula;
let mano;
let dedo_1;
let dedo_2;
let gui;
let direccional;

// Acciones 
init();
loadScene();
setupGUI();
render();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0x5A5A5A));
    renderer.autoClear = false;
    document.getElementById('container').appendChild(renderer.domElement);
    renderer.antialias = true;
    renderer.shadowMap.enabled = true;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(280,280,280);
    camera.lookAt(0,0,40);

    // Control de camara
    const cameraControls = new OrbitControls( camera, renderer.domElement );
	cameraControls.target.set(0,0,0);

    // Configuracion de las camaras
    const ar = window.innerWidth/window.innerHeight;
    setCameras(ar);

    // Luces
    const ambiental = new THREE.AmbientLight(0x404040, 0.7);
    scene.add(ambiental);

    direccional = new THREE.DirectionalLight(0xffffff, 0.5);
    direccional.position.set(-100,300,-100);
    direccional.angle = Math.PI;
    direccional.castShadow = true;
    direccional.shadow.camera.left = -200;
    direccional.shadow.camera.right = 200;
    direccional.shadow.camera.top = 250;
    direccional.shadow.camera.bottom = -200;
    scene.add(direccional);
    //scene.add(new THREE.CameraHelper(direccional.shadow.camera));

    const puntual = new THREE.PointLight(0xFFFFFF,0.4);
    puntual.position.set(80,350,-100);
    puntual.castShadow = true;
    scene.add(puntual);
    //scene.add(new THREE.CameraHelper(puntual.shadow.camera));

    const focal = new THREE.SpotLight(0xFFFFFF,0.7);
    focal.position.set(-10,350,60);
    focal.target.position.set(0,0,0);
    focal.angle = Math.PI/7;
    focal.penumbra = 0.7;
    focal.castShadow = true;
    scene.add(focal);
    //scene.add(new THREE.CameraHelper(focal.shadow.camera));

    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '30px';
    stats.domElement.style.left = '0px';
    document.getElementById('container').appendChild(stats.domElement);

    // Captura de eventos para redimension de la ventana
    window.addEventListener('resize', updateAspectRatio);
    document.addEventListener("keydown", onDocumentKeyDown, false);
};

function loadScene(){
    //const brazo_robot = new THREE.MeshStandardMaterial( { wireframe: false, flatShading: false, color: 'grey' } );
    //const suelo = new THREE.MeshStandardMaterial( { wireframe: false, flatShading: false, color:'grey' } );
    
    const texSuelo = new THREE.TextureLoader().load("./public/images/photo-floor.avif");                                               
    const matSuelo = new THREE.MeshStandardMaterial( {map: texSuelo});

    const textBR1 = new THREE.TextureLoader().load('./public/images/golden.jpeg');
    const matBR1 = new THREE.MeshLambertMaterial( {color:'gold', map: textBR1} );

    const textBR2 = new THREE.TextureLoader().load('./public/images/dark-m.jpeg');
    const matBR2 = new THREE.MeshLambertMaterial( {color:'grey', map: textBR2} );
    
    const entorno = ["./public/images/pisometalico_1024.jpg","./public/images/pisometalico_1024.jpg",
    "./public/images/pisometalico_1024.jpg","./public/images/pisometalico_1024.jpg",
    "./public/images/pisometalico_1024.jpg","./public/images/pisometalico_1024.jpg"];

    const texRotula = new THREE.CubeTextureLoader().load(entorno);
    
    const matRot = new THREE.MeshPhongMaterial( {color:'white',
                                                    specular:'gray',
                                                    shininess: 30,
                                                    envMap: texRotula} );

    // Suelo
    floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000,10,10), matSuelo);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -0.2;
    floor.receiveShadow = true;

    // Base
    const geometry_base = new THREE.CylinderGeometry( 50, 50, 15, 16 ); 
    base = new THREE.Mesh( geometry_base, matBR1 );
    base.castShadow = true;
    base.receiveShadow = true;
    // Brazo
    // Eje
    const geometry_eje = new THREE.CylinderGeometry( 20, 20, 18, 16 ); 
    eje = new THREE.Mesh( geometry_eje, matBR1 ); 
    eje.rotation.x = Math.PI/2;
    eje.castShadow = true;
    eje.receiveShadow = true;
    // Esparrago
    const geometry_esparrago = new THREE.BoxGeometry( 10, 120, 10 );
    const esparrago = new THREE.Mesh( geometry_esparrago, matBR1 );
    esparrago.rotation.x = -Math.PI/2;
    esparrago.position.z = -60;
    esparrago.castShadow = true;
    esparrago.receiveShadow = true;
    // Rotula
    const geometry_rotula = new THREE.SphereGeometry(20, 20, 20);
    rotula = new THREE.Mesh( geometry_rotula, matRot);
    rotula.position.y = 60;
    rotula.castShadow = true;
    rotula.receiveShadow = true;

    // Antebrazo
    // Disco
    const geometry_disco = new THREE.CylinderGeometry( 22, 22, 6, 16 ); 
    const disco = new THREE.Mesh( geometry_disco, matBR1 );
    disco.castShadow = true;
    disco.receiveShadow = true;
    // Nervios
    const geometry_nervio = new THREE.CylinderGeometry( 3, 3, 80, 36 );
    const nervio_1 = new THREE.Mesh( geometry_nervio, matBR2 ); 
    const nervio_2 = new THREE.Mesh( geometry_nervio, matBR2 ); 
    const nervio_3 = new THREE.Mesh( geometry_nervio, matBR2 ); 
    const nervio_4 = new THREE.Mesh( geometry_nervio, matBR2 ); 
    nervio_1.position.y = 43; nervio_2.position.y = 43; nervio_3.position.y = 43; nervio_4.position.y = 43;
    nervio_1.rotation.y = Math.PI/4; nervio_2.rotation.y = Math.PI/4; nervio_3.rotation.y = Math.PI/4; nervio_4.rotation.y = Math.PI/4;
    nervio_1.position.z = 9; nervio_1.position.x = 6;
    nervio_2.position.z = 9; nervio_2.position.x = -6;
    nervio_3.position.z = -9; nervio_3.position.x = -6;
    nervio_4.position.z = -9; nervio_4.position.x = 6;
    nervio_1.castShadow = true;
    nervio_1.receiveShadow = true;
    nervio_2.castShadow = true;
    nervio_2.receiveShadow = true;
    nervio_3.castShadow = true;
    nervio_3.receiveShadow = true;
    nervio_4.castShadow = true;
    nervio_4.receiveShadow = true;
    // Mano
    const geometry_mano = new THREE.CylinderGeometry( 15, 15, 40, 16 );
    mano = new THREE.Mesh( geometry_mano, matBR2 );
    mano.rotation.x = -Math.PI/2;
    mano.position.y = 83;
    mano.castShadow = true;
    mano.receiveShadow = true;
    disco.add( mano );

    // Dedos
    const geometry_d1 = new THREE.BufferGeometry();
    const geometry_d2 = new THREE.BufferGeometry();

    geometry_d1.setIndex( indices );
    geometry_d1.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    geometry_d2.setIndex( indices );
    geometry_d2.setAttribute( 'position', new THREE.BufferAttribute( vertices_flip, 3 ) );

    dedo_1 = new THREE.Mesh( geometry_d1, matBR2 );
    dedo_1.rotation.x = Math.PI/2;
    dedo_1.position.x = 13;
    dedo_1.position.y = -9;
    dedo_1.castShadow = true;

    dedo_2 = new THREE.Mesh( geometry_d2, matBR2 ); 
    dedo_2.rotation.x = Math.PI/2;
    dedo_2.position.x = 13;
    dedo_2.position.y = 13;
    dedo_2.castShadow = true;

    // Habitacion
    const paredes = [];
    paredes.push(new THREE.MeshBasicMaterial({side:THREE.BackSide,
                                            map:new THREE.TextureLoader().load("./public/images/pisometalico_1024.jpg")}));
    paredes.push(new THREE.MeshBasicMaterial({side:THREE.BackSide,
                                            map:new THREE.TextureLoader().load("./public/images/pisometalico_1024.jpg")}));
    paredes.push(new THREE.MeshBasicMaterial({side:THREE.BackSide,
                                            map:new THREE.TextureLoader().load("./public/images/pisometalico_1024.jpg")}));
    paredes.push(new THREE.MeshBasicMaterial({side:THREE.BackSide,
                                            map:new THREE.TextureLoader().load("./public/images/pisometalico_1024.jpg")}));
    paredes.push(new THREE.MeshBasicMaterial({side:THREE.BackSide,
                                            map:new THREE.TextureLoader().load("./public/images/pisometalico_1024.jpg")}));
    paredes.push(new THREE.MeshBasicMaterial({side:THREE.BackSide,
                                            map:new THREE.TextureLoader().load("./public/images/pisometalico_1024.jpg")}));

    const geoHabitacion = new THREE.BoxGeometry(1500,1000,1500);
    const habitacion = new THREE.Mesh(geoHabitacion,paredes);
    
    scene.add(floor);
    scene.add(habitacion);
    scene.add( base );
    base.add( eje );
    eje.add( esparrago );
    esparrago.add( rotula );
    rotula.add( disco );
    disco.add( nervio_1 );
    disco.add( nervio_2 );
    disco.add( nervio_3 );
    disco.add( nervio_4 );
    disco.add( mano );
    mano.add( dedo_1 );
    mano.add( dedo_2 );
    direccional.target = rotula;
};

function render() {
    requestAnimationFrame(render);
    // update();
    renderer.clear();
    let w = window.innerWidth;
    let h = window.innerHeight;
    let min_dim = Math.min(w/4,h/4)
    
    update();
    // El S.R. del viewport es left-bottom con X right y Y up
    renderer.setViewport(0,h*3/4, min_dim,min_dim);
    renderer.render(scene, planta);
    renderer.setViewport(0,0, w,h);
    renderer.render(scene, camera);
};

function setCameras(ar) {
    // Creacion de las camara
    // ar -> aspect ratio (rel. de aspecto)
    let camaraOrtografica;
    if (ar>1) { // más ancho que alto
		camaraOrtografica = new THREE.OrthographicCamera(-L * ar, L * ar, L, -L, -450, 450);
	}
	else { // más alto que ancho
		camaraOrtografica = new THREE.OrthographicCamera(-L, L, L / ar, -L / ar, -450, 450);
	}

    planta = camaraOrtografica.clone();
	planta.position.set(0,70,0);
	planta.lookAt(0,0,0);
	planta.up = new THREE.Vector3(0,0,-1); // Se ve desde arriba, hay que ponerle up
};

function updateAspectRatio() {
    // Cada vez que se cambie el tamayo de la ventana, se llama a esta funcion
    // Cambiar las dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Nuevo ar de la camara
    const ar = window.innerWidth / window.innerHeight;
    // Perspectiva
    camera.aspect = ar;
    camera.updateProjectionMatrix();

    // Ortografica
    // En funcion del ar, se cambia la camara
    if(ar>1) {
        planta.left = -L*ar;
        planta.right = L*ar;
        planta.bottom = -L;
        planta.top = L;
    }
    else {
        planta.left = -L;
        planta.right = L;
        planta.bottom = -L/ar;
        planta.top = L/ar;
    }

    // Actualizar matrices de proyección
    planta.updateProjectionMatrix();
};

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    console.log(keyCode)
    
    if (keyCode == 37) {
        base.position.z += ySpeed;
    } else if (keyCode == 39) {
        base.position.z -= ySpeed;
    } else if (keyCode == 38) {
        base.position.x -= xSpeed;
    } else if (keyCode == 40) {
        base.position.x += xSpeed;
    } else if (keyCode == 32) {
        base.position.set(0, 0, 0);
    }
}  ;

function setupGUI()
{
    // Definicion del objeto controlador
    effectController = {
        giroBase: 0.0,
        giroBrazo: 0.0,
        giroAnteBrazoY: 0.0,
        giroAnteBrazoZ: 0.0,
        giroPinza: 0.0,
        aperturaPinza: 4,
        animacion,
        isWireframe: false
    }

    // Crear la GUI
    gui = new GUI();
    gui.title("Controles")
    const h = gui.addFolder("Brazo robot");
    h.add(effectController, 'giroBase', -180.0, 180.0, 0.025 ).name('Giro Base');
    h.add(effectController, 'giroBrazo', -45.0, 45.0, 0.025 ).name('Giro Brazo');
    h.add(effectController, 'giroAnteBrazoY', -180.0, 180.0, 0.025 ).name('Giro AntebrazoY');
    h.add(effectController, 'giroAnteBrazoZ', -55.0, 55.0, 0.025 ).name('Giro AntebrazoZ');
    h.add(effectController, 'giroPinza', -188.0, 8.0, 0.025 ).name('Giro Pinza');
    h.add(effectController, 'aperturaPinza', 0.0, 10.0, 0.025 ).name('Apertura Pinza');
    h.add(effectController, 'animacion' ).name('Animación');
    h.add(effectController, 'isWireframe' );
}

function update()
{
    // Lectura de controles en GUI (es mejor hacerlo con onChange)
    stats.update();
    floor.material.setValues( { wireframe: effectController.isWireframe } );
    base.material.setValues( { wireframe: effectController.isWireframe } );
    base.rotation.y = effectController.giroBase * Math.PI/180;
    eje.rotation.y = effectController.giroBrazo * Math.PI/180;
    rotula.rotation.y = effectController.giroAnteBrazoY * Math.PI/180;
    rotula.rotation.z = effectController.giroAnteBrazoZ * Math.PI/180;
    mano.rotation.y = effectController.giroPinza * Math.PI/180;
    dedo_1.position.set( 13,-1-effectController.aperturaPinza-9/2, 0 );
	dedo_2.position.set( 13,1+effectController.aperturaPinza+17/2, 0 );
    TWEEN.update();
}

function animacion() {

    let tween1 = new TWEEN.Tween(effectController).to({aperturaPinza: 8}, 2000);
    let tween2 = new TWEEN.Tween(effectController).to({giroBase: -45.5}, 2000);
    let tween3 = new TWEEN.Tween(effectController).to({giroBrazo: -45.5}, 2000);
    let tween4 = new TWEEN.Tween(effectController).to({giroAnteBrazoZ: -55.5}, 2000);
    let tween5 = new TWEEN.Tween(effectController).to({aperturaPinza: 0}, 2000);
    let tween6 = new TWEEN.Tween(effectController).to({giroBase: -65}, 2000);
    let tween7 = new TWEEN.Tween(effectController).to({giroBrazo: -10}, 2000);
    let tween8 = new TWEEN.Tween(effectController).to({giroPinza: -47.5}, 2000);
    let tween9 = new TWEEN.Tween(effectController).to({aperturaPinza: 8}, 1000);
    let tween10 = new TWEEN.Tween(effectController).to({aperturaPinza: 0, giroBase: 0, giroBrazo: 0, giroAnteBrazoZ: 0, giroPinza: 0}, 4000).onComplete(() => {gui.reset()});
    tween2.chain(tween3);
    tween3.chain(tween4);
    tween4.chain(tween5);
    tween5.chain(tween6, tween7);
    tween7.chain(tween8);
    tween8.chain(tween9);
    tween9.chain(tween10);

    tween1.start();
    tween2.start();

}

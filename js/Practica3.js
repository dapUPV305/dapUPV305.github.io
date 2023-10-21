import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";

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
const L = 40;

// Acciones 
init();
loadScene();
render();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xB1BED0);
    renderer.autoClear = false; 
    document.getElementById('container').appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(230,230,230);

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

    // Captura de eventos para redimension de la ventana
    window.addEventListener('resize', updateAspectRatio);
};

function loadScene(){
    const brazo_robot = new THREE.MeshNormalMaterial( { wireframe: false, flatShading: true } );
    const suelo = new THREE.MeshNormalMaterial( { wireframe: false, flatShading: true } );

    // Suelo
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000,10,10), suelo);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -0.2;
    scene.add(floor);

    // Base
    const geometry_base = new THREE.CylinderGeometry( 50, 50, 15, 16 ); 
    const base = new THREE.Mesh( geometry_base, brazo_robot ); scene.add( base );

    // Brazo
    // Eje
    const geometry_eje = new THREE.CylinderGeometry( 20, 20, 18, 16 ); 
    const eje = new THREE.Mesh( geometry_eje, brazo_robot ); base.add( eje );
    eje.rotation.x = Math.PI/2;
    // Esparrago
    const geometry_esparrago = new THREE.BoxGeometry( 10, 120, 10 );
    const esparrago = new THREE.Mesh( geometry_esparrago, brazo_robot ); eje.add( esparrago );
    esparrago.rotation.x = -Math.PI/2;
    esparrago.position.z = -60;
    // Rotula
    const geometry_rotula = new THREE.SphereGeometry(20, 20, 32);
    const rotula = new THREE.Mesh( geometry_rotula, brazo_robot);  esparrago.add( rotula );
    rotula.position.y = 60;

    // Antebrazo
    // Disco
    const geometry_disco = new THREE.CylinderGeometry( 22, 22, 6, 16 ); 
    const disco = new THREE.Mesh( geometry_disco, brazo_robot ); rotula.add( disco );
    // Nervios
    const geometry_nervio = new THREE.CylinderGeometry( 3, 3, 80, 36 );
    const nervio_1 = new THREE.Mesh( geometry_nervio, brazo_robot ); disco.add( nervio_1 );
    const nervio_2 = new THREE.Mesh( geometry_nervio, brazo_robot ); disco.add( nervio_2 );
    const nervio_3 = new THREE.Mesh( geometry_nervio, brazo_robot ); disco.add( nervio_3 );
    const nervio_4 = new THREE.Mesh( geometry_nervio, brazo_robot ); disco.add( nervio_4 );
    nervio_1.position.y = 43; nervio_2.position.y = 43; nervio_3.position.y = 43; nervio_4.position.y = 43;
    nervio_1.rotation.y = Math.PI/4; nervio_2.rotation.y = Math.PI/4; nervio_3.rotation.y = Math.PI/4; nervio_4.rotation.y = Math.PI/4;
    nervio_1.position.z = 9; nervio_1.position.x = 6;
    nervio_2.position.z = 9; nervio_2.position.x = -6;
    nervio_3.position.z = -9; nervio_3.position.x = -6;
    nervio_4.position.z = -9; nervio_4.position.x = 6;
    // Mano
    const geometry_mano = new THREE.CylinderGeometry( 15, 15, 40, 16 );
    const mano = new THREE.Mesh( geometry_mano, brazo_robot ); disco.add( mano );
    mano.rotation.x = -Math.PI/2;
    mano.position.y = 83

    // Dedos
    const geometry_d1 = new THREE.BufferGeometry();
    const geometry_d2 = new THREE.BufferGeometry();

    geometry_d1.setIndex( indices );
    geometry_d1.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    geometry_d2.setIndex( indices );
    geometry_d2.setAttribute( 'position', new THREE.BufferAttribute( vertices_flip, 3 ) );

    const dedo_1 = new THREE.Mesh( geometry_d1, brazo_robot ); mano.add( dedo_1 );
    dedo_1.rotation.x = Math.PI/2;
    dedo_1.position.x = 13;
    dedo_1.position.y = -9;

    const dedo_2 = new THREE.Mesh( geometry_d2, brazo_robot ); mano.add( dedo_2 );
    dedo_2.rotation.x = Math.PI/2;
    dedo_2.position.x = 13;
    dedo_2.position.y = 13;
};

function render() {
    requestAnimationFrame(render);
    // update();
    renderer.clear();
    let w = window.innerWidth;
    let h = window.innerHeight;
    let min_dim = Math.min(w/4,h/4)
    
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

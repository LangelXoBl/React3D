import { useRef, useEffect } from 'react';
//* importa lo necesario para crear la escena
import * as THREE from 'three';
//* importa las funcionalidades
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Model = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    //# se obtienen las medidas del equipo del usuario
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //# Se crea la instancia de threejs
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a3b4c);

    //# se crea la camara, el angulo desde que el podremos ver
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 1000);
    scene.add(camera);
    camera.position.z = 6;
    camera.position.x = 6;

    //# se crea el render
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    //# se añade el render a una referencia o canvas, es donde se mostrara
    currentRef.appendChild(renderer.domElement);

    //# despues de añadir el render se da las funcionalidades
    //? despues hay que crear una funcion que se encargue de controlarlo y darle sus atributos
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    //# se crea el objeto y se añade a la escena
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xab0097 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    //# le decimos a la camara que mire hacia el cubo
    camera.lookAt(cube.position);

    //# funcion que controla el movimiento
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    //# se llama la funcion de control y como renderiza la scena ya no es necesario tener el otro
    animate();

    //# se renderiza la scena
    // renderer.render(scene, camera);
    return () => {
      currentRef.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <>
      <h1>React 3D</h1>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>
    </>
  );
};

export default Model;

import { useRef, useEffect } from 'react';
//* importa lo necesario para crear la escena
import * as THREE from 'three';
//* importa las funcionalidades
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
    /* const geometry = new THREE.BoxGeometry(1, 1, 1);
    //* Este material no refleja luz
    // const material = new THREE.MeshBasicMaterial({ color: 0xab0097 });
    //* pero este si lo refleja
    const material = new THREE.MeshPhongMaterial({ color: 0xab0097 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    //# le decimos a la camara que mire hacia el cubo
    camera.lookAt(cube.position); */

    //# Load model
    const GLTF = new GLTFLoader();
    GLTF.load(
      'http://localhost:3000/api/v1/public/Bee2.glb',
      (gltf) => {
        console.log('cargado');
        console.log(gltf.scene);
        // gltf.scene.traverse((object) => {
        //   // if (object.isMesh) {
        //   //   object.material.map =
        //   //     object.material.map || object.material.emissiveMap;
        //   //   object.material.normalMap =
        //   //     object.material.normalMap || object.material.map;
        //   //   object.material.normalScale.set(1, -1);
        //   // }
        //   if (object.isMesh) {
        //     object.material = new THREE.MeshBasicMaterial({ color: 0xab0097 });
        //   }
        // });
        scene.add(gltf.scene);
        camera.lookAt(gltf.scene.position);
      },
      () => {
        console.log('cargando');
      },
      () => {
        console.log('error');
      }
    );

    //# se debe crear una luz ambiental para darle el color deseado
    //* ayuda a darle el color natural
    const ambientalLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientalLight);

    //# se crea el punto de luz para la escena, pero le cambia el color al objeto
    //* ayuda a darle brillo
    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(8, 8, 8);
    scene.add(pointLight);

    //# sirve para optimizar de manera sencilla las animaciones
    const clock = new THREE.Clock();

    //# funcion que controla el movimiento
    const animate = () => {
      //# esto optimiza la animacion
      const elapsedTime = clock.getElapsedTime();

      //# hace que se rote de manera automatica
      /*cube.rotation.z = elapsedTime;
      cube.rotation.x = elapsedTime;
      cube.position.y = Math.sin(elapsedTime);*/
      //# esto hace que se detenga suavemente
      controls.update();
      //# Renderiza el nuevo frame y despues se llama a si mismo para seguir renderizando
      //# esto tambien hace que se pueda manipular
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    //# se saco del adEventListener para remover el evento cuando el componente sea desmontado
    //* esto mejora el rendimiento de la web
    const resize = () => {
      const updateWidth = currentRef.clientWidth;
      const updateHeight = currentRef.clientHeight;
      renderer.setSize(updateWidth, updateHeight);
      //# esto es para que no se deforme el objeto con el resize
      camera.aspect = updateWidth / updateHeight;
      camera.updateProjectionMatrix();
    };

    //# funcion para hacer el resize de la escena deacuerdo al cambio de la pantalla
    window.addEventListener('resize', resize);

    //# se llama la funcion de control y como renderiza la scena ya no es necesario tener el otro
    animate();

    //# se renderiza la scena
    // renderer.render(scene, camera);
    return () => {
      //# aqui se remueven los eventos
      currentRef.removeChild(renderer.domElement);
      window.removeEventListener('resize', resize);
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

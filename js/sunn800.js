(function(){
  // set some camera attributes
  var VIEW_ANGLE = 45,
      NEAR = 0.1,
      FAR = 10000;

  var container;

  var camera, scene, renderer;

  var cube, particles;

  init();
  animate();

  function init() {
    // get the DOM element to attach to
    container = document.getElementById( 'container' );

    // create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer({antialias: true});
    camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      window.innerWidth / window.innerHeight,
      NEAR,
      FAR
    );
    scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    camera.position.z = 250;

    // start the renderer
    renderer.setSize( window.innerWidth, window.innerHeight );

    // attach the render-supplied DOM element
    container.appendChild( renderer.domElement );

    // create the cube's material
    var cubeMaterial = new THREE.MeshBasicMaterial(
    {
        color: 0x6C8CD5,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    // set up the cube vars
    var csize = 150, csegments = 8;

    // create a new mesh with cube geometry
    cube = new THREE.Mesh(
       new THREE.CubeGeometry(
         csize, csize, csize, csegments, csegments, csegments),
       cubeMaterial);

    var radius = csize * 1.5;
    var geometry = new THREE.Geometry();

    // Set up the vertices for a set of particles.
    for ( var i = 0; i < 800 * 1000; i++ ) {

      var vertex = new THREE.Vector3();

      // Spherical coords ftw.
      // For some reason, there seem to be a higher density of points
      // when theta is close to zero/Pi. Floating point errors??
      // Just bias theta to Pi/2 then...
      rho = 1;
      r = radius * (Math.exp(Math.random() * 20) - 1)/Math.exp(20);
      rand = Math.random()
      theta = Math.PI/2 + (1 - .5 * Math.random()) *
        (0.5 - Math.random()) * 2 * Math.PI/2;
      phi = Math.random() * Math.PI * 2;

      vertex.x = r * Math.sin(theta) * Math.cos(phi);
      vertex.y = r * Math.sin(theta) * Math.sin(phi);
      vertex.z = r * Math.cos(theta);

      // Don't draw any points outside the box.
      var bound = csize/2;
      if (
          Math.abs(vertex.x) < bound &&
          Math.abs(vertex.y) < bound &&
          Math.abs(vertex.z) < bound ) {
        geometry.vertices.push( vertex );
      }
    }

    // create the material for the particles.
    var particleMaterial = new THREE.MeshBasicMaterial(
    {
        color: 0xFFAA00,
        transparent: true,
        opacity: 0.4
    });

    particles = new THREE.ParticleSystem(geometry, particleMaterial);

     // add the cube to the scene
    scene.add(cube);
    scene.add(particles);

    // and the camera
    scene.add(camera);

    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);

    // draw!
    renderer.render(scene, camera);

    window.addEventListener( 'resize', onWindowResize, false );
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    requestAnimationFrame( animate );

    render();
  }

  function render() {
    var time = Date.now() * 0.0005;

    cube.rotation.x = time * 0.25;
    cube.rotation.y = time * 0.5;
    particles.rotation.x = time * 0.25;
    particles.rotation.y = time * 0.5;

    renderer.render( scene, camera );
  }

}.call(this))

// Fluid Glass Effect - Vanilla JavaScript
// Converted from React Three Fiber to vanilla Three.js

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class FluidGlassEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      mode: options.mode || "lens", // 'lens', 'bar', or 'cube'
      images: options.images || [],
      navItems: options.navItems || [],
      glassProps: options.glassProps || {},
      ...options,
    };

    this.scene = new THREE.Scene();
    this.bufferScene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.renderTarget = null;
    this.glassMesh = null;
    this.pointer = new THREE.Vector2();
    this.targetPosition = new THREE.Vector3();
    this.scrollOffset = 0;
    this.imageGroup = null;
    this.textMeshes = [];
    this.navGroup = null;

    this.init();
  }

  init() {
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      15,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    this.container.appendChild(this.renderer.domElement);

    // Create render target for the glass effect
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.container.clientWidth,
      this.container.clientHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    // Setup mouse/touch tracking
    this.setupPointerTracking();

    // Setup scroll tracking
    this.setupScrollTracking();

    // Load glass geometry and setup scene
    this.loadGlassGeometry();

    // Setup images if provided
    if (this.options.images.length > 0) {
      this.setupImages();
    }

    // Setup navigation if in bar mode
    if (this.options.mode === "bar" && this.options.navItems.length > 0) {
      this.setupNavigation();
    }

    // Handle window resize
    window.addEventListener("resize", () => this.onResize());

    // Start animation loop
    this.animate();
  }

  setupPointerTracking() {
    const updatePointer = (x, y) => {
      this.pointer.x = (x / this.container.clientWidth) * 2 - 1;
      this.pointer.y = -(y / this.container.clientHeight) * 2 + 1;
    };

    this.container.addEventListener("mousemove", (e) => {
      const rect = this.container.getBoundingClientRect();
      updatePointer(e.clientX - rect.left, e.clientY - rect.top);
    });

    this.container.addEventListener("touchmove", (e) => {
      const rect = this.container.getBoundingClientRect();
      const touch = e.touches[0];
      updatePointer(touch.clientX - rect.left, touch.clientY - rect.top);
    });
  }

  setupScrollTracking() {
    window.addEventListener("scroll", () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      this.scrollOffset = window.scrollY / maxScroll;
    });
  }

  loadGlassGeometry() {
    const loader = new GLTFLoader();
    const glbPaths = {
      lens: "/assets/3d/lens.glb",
      cube: "/assets/3d/cube.glb",
      bar: "/assets/3d/bar.glb",
    };

    const geometryKeys = {
      lens: "Cylinder",
      cube: "Cube",
      bar: "Cube",
    };

    const glbPath = glbPaths[this.options.mode];
    const geometryKey = geometryKeys[this.options.mode];

    loader.load(
      glbPath,
      (gltf) => {
        const geometry = gltf.scene.getObjectByName(geometryKey)?.geometry;
        if (!geometry) {
          console.error(`Geometry "${geometryKey}" not found in ${glbPath}`);
          return;
        }

        this.createGlassMesh(geometry);
      },
      undefined,
      (error) => {
        console.error("Error loading glass model:", error);
      }
    );
  }

  createGlassMesh(geometry) {
    // Custom shader material for transmission effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.renderTarget.texture },
        uIor: { value: this.options.glassProps.ior || 1.15 },
        uThickness: { value: this.options.glassProps.thickness || 5 },
        uChromaticAberration: {
          value: this.options.glassProps.chromaticAberration || 0.1,
        },
        uTransmission: { value: this.options.glassProps.transmission || 1 },
        uRoughness: { value: this.options.glassProps.roughness || 0 },
        uColor: {
          value: new THREE.Color(this.options.glassProps.color || "#ffffff"),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uIor;
        uniform float uThickness;
        uniform float uChromaticAberration;
        uniform float uTransmission;
        uniform float uRoughness;
        uniform vec3 uColor;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 viewDir = normalize(vPosition);
          vec3 refracted = refract(viewDir, vNormal, 1.0 / uIor);
          
          vec2 offset = refracted.xy * uThickness * 0.01;
          
          // Chromatic aberration
          float r = texture2D(uTexture, vUv + offset * (1.0 + uChromaticAberration)).r;
          float g = texture2D(uTexture, vUv + offset).g;
          float b = texture2D(uTexture, vUv + offset * (1.0 - uChromaticAberration)).b;
          
          vec3 refractedColor = vec3(r, g, b);
          vec3 finalColor = mix(refractedColor, uColor, 1.0 - uTransmission);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true,
    });

    this.glassMesh = new THREE.Mesh(geometry, material);
    this.glassMesh.rotation.x = Math.PI / 2;
    this.glassMesh.position.z = 15;

    const scale = this.options.glassProps.scale || 0.15;
    this.glassMesh.scale.set(scale, scale, scale);

    this.scene.add(this.glassMesh);

    // Add background plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: this.renderTarget.texture,
      transparent: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.scene.add(plane);
  }

  setupImages() {
    this.imageGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    this.options.images.forEach((imgData, index) => {
      textureLoader.load(imgData.url, (texture) => {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uZoom: { value: 1.0 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            uniform float uZoom;
            varying vec2 vUv;
            
            void main() {
              vec2 centeredUv = vUv - 0.5;
              vec2 zoomedUv = centeredUv / uZoom + 0.5;
              gl_FragColor = texture2D(uTexture, zoomedUv);
            }
          `,
        });

        const geometry = new THREE.PlaneGeometry(
          imgData.scale?.[0] || imgData.scale || 1,
          imgData.scale?.[1] || imgData.scale || 1
        );

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          imgData.position[0],
          imgData.position[1],
          imgData.position[2]
        );
        mesh.userData.zoomRange = imgData.zoomRange || [0, 1];

        this.imageGroup.add(mesh);
      });
    });

    this.bufferScene.add(this.imageGroup);
  }

  setupNavigation() {
    this.navGroup = new THREE.Group();
    // Note: For text rendering in vanilla Three.js, you'd typically use TextGeometry
    // or a library like troika-three-text. This is simplified.
    console.log(
      "Navigation setup would require additional text rendering library"
    );
    this.scene.add(this.navGroup);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const viewport = this.getViewport();
    const followPointer = this.options.mode !== "bar";
    const lockToBottom = this.options.mode === "bar";

    if (this.glassMesh) {
      // Update glass position
      const targetX = followPointer ? (this.pointer.x * viewport.width) / 2 : 0;
      const targetY = lockToBottom
        ? -viewport.height / 2 + 0.2
        : followPointer
        ? (this.pointer.y * viewport.height) / 2
        : 0;

      // Smooth interpolation (lerp)
      const damping = 0.15;
      this.glassMesh.position.x +=
        (targetX - this.glassMesh.position.x) * damping;
      this.glassMesh.position.y +=
        (targetY - this.glassMesh.position.y) * damping;

      // Update material uniform if needed
      if (this.glassMesh.material.uniforms) {
        this.glassMesh.material.uniforms.uTexture.value =
          this.renderTarget.texture;
      }
    }

    // Update image zoom based on scroll
    if (this.imageGroup) {
      this.imageGroup.children.forEach((mesh, i) => {
        if (mesh.material.uniforms && mesh.userData.zoomRange) {
          const [start, range] = mesh.userData.zoomRange;
          const progress = Math.max(
            0,
            Math.min(1, (this.scrollOffset - start) / range)
          );
          mesh.material.uniforms.uZoom.value = 1 + progress / 3;
        }
      });
    }

    // Render buffer scene first
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.bufferScene, this.camera);

    // Render main scene
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  getViewport() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * Math.abs(this.camera.position.z);
    const width = height * aspect;
    return { width, height };
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderTarget.setSize(width, height);
  }

  dispose() {
    this.renderer.dispose();
    this.renderTarget.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

export default FluidGlassEffect;

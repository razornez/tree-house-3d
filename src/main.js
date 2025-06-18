import gsap from "gsap";

import { Howl } from "howler";

import * as THREE from "three";
import { OrbitControls } from "./utils/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import smokeVertexShader from "./shaders/smoke/vertex.glsl";
import smokeFragmentShader from "./shaders/smoke/fragment.glsl";
import themeVertexShader from "./shaders/theme/vertex.glsl";
import themeFragmentShader from "./shaders/theme/fragment.glsl";
/**  -------------------------- Audio setup -------------------------- */

// Background Music
let isMusicFaded = false;
const MUSIC_FADE_TIME = 500;
const BACKGROUND_MUSIC_VOLUME = 0.8;
const FADED_VOLUME = 0;

// Build the path to the randomly selected audio file
const randomAudioSrc = `/audio/music/audio.mp3`;

// Create a new Howl instance with the randomly selected audio file
const backgroundMusic = new Howl({
  src: [randomAudioSrc],
  loop: true,
  volume: BACKGROUND_MUSIC_VOLUME,
  html5: true
});

const fadeOutBackgroundMusic = () => {
  if (!isMuted && !isMusicFaded) {
    backgroundMusic.fade(
      backgroundMusic.volume(),
      FADED_VOLUME,
      MUSIC_FADE_TIME
    );
    isMusicFaded = true;
  }
};

const fadeInBackgroundMusic = () => {
  if (!isMuted && isMusicFaded) {
    backgroundMusic.fade(
      FADED_VOLUME,
      BACKGROUND_MUSIC_VOLUME,
      MUSIC_FADE_TIME
    );
    isMusicFaded = false;
  }
};

// Button
const buttonSounds = {
  click: new Howl({
    src: ["/audio/sfx/click/bubble.mp3"],
    preload: true,
    volume: 0.5,
    html5: true
  }),
};

/**  -------------------------- Scene setup -------------------------- */
const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color("#D9CAD1");
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 45;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = Math.PI / 2;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

let initialCameraPosition = new THREE.Vector3();
let initialControlsTarget = new THREE.Vector3();

// ... (dalam blok if/else yang mengatur posisi kamera awal) ...
if (window.innerWidth < 768) {
  camera.position.set(
    35.5, // x: sedikit lebih jauh ke kanan dari 17.49 -> 20.5
    13.0, // y: tetap
    45.5  // z: lebih jauh dari 21 -> 24.5
  );
  controls.target.set(
    5.4624746759408973,
    7.7,               // target y sedikit turun
    1.3300979125494505
  );
  controls.maxDistance = 45;
} else {
  camera.position.set(
    21.5, // x: sedikit lebih jauh ke kanan dari 17.49 -> 20.5
    13.0, // y: tetap
    25.5  // z: lebih jauh dari 21 -> 24.5
  );
  controls.target.set(
    5.4624746759408973,
    7.7,               // target y sedikit turun
    1.3300979125494505
  );
  controls.maxDistance = 30;
}

// Simpan posisi awal setelah diatur
initialCameraPosition.copy(camera.position);
initialControlsTarget.copy(controls.target);


window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**  -------------------------- Modal Stuff -------------------------- */
const modals = {
  work: document.querySelector(".modal.work"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};

const overlay = document.querySelector(".overlay");

let touchHappened = false;
overlay.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    e.preventDefault();
    const modal = document.querySelector('.modal[style*="display: block"]');
    if (modal) hideModal(modal);
  },
  { passive: false }
);

overlay.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    e.preventDefault();
    const modal = document.querySelector('.modal[style*="display: block"]');
    if (modal) hideModal(modal);
  },
  { passive: false }
);

document.querySelectorAll(".modal-exit-button").forEach((button) => {
  function handleModalExit(e) {
    e.preventDefault();
    const modal = e.target.closest(".modal");
  
    gsap.to(button, {
      scale: 5,
      duration: 0.5,
      ease: "back.out(2)",
      onStart: () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
          onComplete: () => {
            gsap.set(button, {
              clearProps: "all",
            });
          },
        });
      },
    });

    buttonSounds.click.play();
  
    // Animasi reset posisi kamera menggunakan GSAP
    gsap.to(camera.position, {
      x: initialCameraPosition.x,
      y: initialCameraPosition.y,
      z: initialCameraPosition.z,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => controls.update()
    });
  
    // Animasi reset target kontrol menggunakan GSAP
    gsap.to(controls.target, {
      x: initialControlsTarget.x,
      y: initialControlsTarget.y,
      z: initialControlsTarget.z,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        hideModal(modal);
      }
    });
  }

  button.addEventListener(
    "touchend",
    (e) => {
      touchHappened = true;
      handleModalExit(e);
    },
    { passive: false }
  );

  button.addEventListener(
    "click",
    (e) => {
      if (touchHappened) return;
      handleModalExit(e);
    },
    { passive: false }
  );
});

let isModalOpen = true;

const showModal = (modal) => {
  modal.style.display = "block";
  overlay.style.display = "block";

  isModalOpen = true;
  controls.enabled = false;

  if (currentHoveredObject) {
    playHoverAnimation(currentHoveredObject, false);
    currentHoveredObject = null;
  }
  document.body.style.cursor = "default";
  currentIntersects = [];

  gsap.set(modal, {
    opacity: 0,
    scale: 0,
  });
  gsap.set(overlay, {
    opacity: 0,
  });

  gsap.to(overlay, {
    opacity: 1,
    duration: 0.5,
  });

  gsap.to(modal, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "back.out(2)",
  });
};

const hideModal = (modal) => {
  isModalOpen = false;
  controls.enabled = true;

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.5,
  });

  gsap.to(modal, {
    opacity: 0,
    scale: 0,
    duration: 0.5,
    ease: "back.in(2)",
    onComplete: () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    },
  });
};

/**  -------------------------- Loading Screen & Intro Animation -------------------------- */

setTimeout(() => {
  document.querySelectorAll(".instructions").forEach((el) => {
    el.style.opacity = "1";
    el.style.animation = "fadeSlideUp 1s ease forwards";
  });
}, 800);

const manager = new THREE.LoadingManager();

const loadingScreen = document.querySelector(".loading-screen");
const loadingScreenButton = document.querySelector(".loading-screen-button");
const desktopInstructions = document.querySelector(".desktop-instructions");
const mobileInstructions = document.querySelector(".mobile-instructions");

manager.onLoad = function () {
  loadingScreenButton.style.cursor = "pointer";
  loadingScreenButton.textContent = "Enter Room";

  let isDisabled = false;
  let touchHappened = false;

  function handleEnter() {
    if (isDisabled) return;

    isDisabled = true;
    loadingScreenButton.textContent = "~ Enjoy ~";
    loadingScreenButton.style.cursor = "default";

    toggleFavicons?.();
    backgroundMusic?.play();
    playReveal?.();
  }

  loadingScreenButton.addEventListener("mouseenter", () => {
    if (!isDisabled) loadingScreenButton.style.transform = "scale(1.1)";
  });

  loadingScreenButton.addEventListener("mouseleave", () => {
    loadingScreenButton.style.transform = "scale(1)";
  });

  loadingScreenButton.addEventListener("touchend", (e) => {
    touchHappened = true;
    e.preventDefault();
    handleEnter();
  });

  loadingScreenButton.addEventListener("click", (e) => {
    if (touchHappened) return;
    handleEnter();
  });
};

function playReveal() {
  const tl = gsap.timeline();

  tl.to(loadingScreen, {
    backdropFilter: "blur(10px)", // Animasi blur
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Animasi background menjadi lebih transparan
    opacity: 0, // Animasi opasitas menjadi 0
    duration: 1.2, // Durasi animasi blur/transparan, sesuaikan
    ease: "power2.inOut",
    onComplete: () => {
      // Setelah semua animasi selesai, baru hapus loadingScreen
      isModalOpen = false;
      playIntroAnimation();
      loadingScreen.remove();
    },
  }, 0.5); 
}

function playIntroAnimation() {
  const tCactus = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: "back.out(1.8)",
    },
  });
  tCactus.timeScale(0.8);

  tCactus
    .to(cactus.scale, {
      x: 1,
      y: 1,
      z: 1,
    })

    const tBooks = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: "back.out(1.8)",
      },
    });
    tBooks.timeScale(0.8);
    
    books.slice().reverse().forEach((book, reversedIndex) => {
      tBooks.to(book.scale, {
        x: 1,
        y: 1,
        z: 1,
      }, reversedIndex === 0 ? 0 : `-=${0.5}`);
    });

  // 1. Urutkan berdasarkan nama objek (Egg_1, Egg_2, ...)
  const sortedEggs = eggs.slice().sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/));
    const numB = parseInt(b.name.match(/\d+/));
    return numA - numB;
  });

  // 2. Timeline dengan efek bounce lembut
  const tEggs = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: "elastic.out(1, 0.4)", // Lebih elastis dan hidup
    },  
  });
  tEggs.timeScale(0.8);

  // 3. Tambahkan animasi satu per satu dengan delay bertahap
  sortedEggs.forEach((egg, index) => {
    // Reset scale dulu jika perlu
    egg.scale.set(0, 0, 0);

    tEggs.to(egg.scale, {
      x: 1,
      y: 1,
      z: 1,
    }, `+=${index * 0.1}`); // Delay bertahap
  });

}

/**  -------------------------- Loaders & Texture Preparations -------------------------- */
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader);

const environmentMap = new THREE.CubeTextureLoader()
  .setPath("textures/skybox/")
  .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);

const textureMap = {
  First: {
    day: "/textures/room/day/first_texture_set_day.webp",
    night: "/textures/room/night/first_texture_set_night.webp",
  },
  Second: {
    day: "/textures/room/day/second_texture_set_day.webp",
    night: "/textures/room/night/second_texture_set_night.webp",
  },
  Third: {
    day: "/textures/room/day/third_texture_set_day.webp",
    night: "/textures/room/night/third_texture_set_night.webp",
  },
  Fourth: {
    day: "/textures/room/day/fourth_texture_set_day.webp",
    night: "/textures/room/night/fourth_texture_set_night.webp",
  },
};

const loadedTextures = {
  day: {},
  night: {},
};

Object.entries(textureMap).forEach(([key, paths]) => {
  // Load and configure day texture
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  dayTexture.minFilter = THREE.LinearFilter;
  dayTexture.magFilter = THREE.LinearFilter;
  loadedTextures.day[key] = dayTexture;

  // Load and configure night texture
  const nightTexture = textureLoader.load(paths.night);
  nightTexture.flipY = false;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.minFilter = THREE.LinearFilter;
  nightTexture.magFilter = THREE.LinearFilter;
  loadedTextures.night[key] = nightTexture;
});

// Reuseable Materials
const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  opacity: 1,
  color: 0xfbfbfb,
  metalness: 0,
  roughness: 0,
  ior: 3,
  thickness: 0.01,
  specularIntensity: 1,
  envMap: environmentMap,
  envMapIntensity: 1,
  depthWrite: false,
  specularColor: 0xfbfbfb,
});

const whiteMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const createMaterialForTextureSet = (textureSet) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uDayTexture1: { value: loadedTextures.day.First },
      uNightTexture1: { value: loadedTextures.night.First },
      uDayTexture2: { value: loadedTextures.day.Second },
      uNightTexture2: { value: loadedTextures.night.Second },
      uDayTexture3: { value: loadedTextures.day.Third },
      uNightTexture3: { value: loadedTextures.night.Third },
      uDayTexture4: { value: loadedTextures.day.Fourth },
      uNightTexture4: { value: loadedTextures.night.Fourth },
      uMixRatio: { value: 0 },
      uTextureSet: { value: textureSet },
    },
    vertexShader: themeVertexShader,
    fragmentShader: themeFragmentShader,
  });

  Object.entries(material.uniforms).forEach(([key, uniform]) => {
    if (uniform.value instanceof THREE.Texture) {
      uniform.value.minFilter = THREE.LinearFilter;
      uniform.value.magFilter = THREE.LinearFilter;
    }
  });

  return material;
};

const roomMaterials = {
  First: createMaterialForTextureSet(1),
  Second: createMaterialForTextureSet(2),
  Third: createMaterialForTextureSet(3),
  Fourth: createMaterialForTextureSet(4),
};

// Smoke Shader setup
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(0.33, 1, 0.33);

const perlinTexture = textureLoader.load("/shaders/perlin.png");
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

const smokeMaterial = new THREE.ShaderMaterial({
  vertexShader: smokeVertexShader,
  fragmentShader: smokeFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uPerlinTexture: new THREE.Uniform(perlinTexture),
  },
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
});

const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.y = 1.83;
scene.add(smoke);

function createVideoTexture(src, rotation) {
  const videoElement = document.createElement("video");
  videoElement.src = src;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.playsInline = true;
  videoElement.autoplay = true;
  videoElement.volume = 0.8;
  videoElement.play();

  const texture = new THREE.VideoTexture(videoElement);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;
  texture.center.set(0.5, 0.5);
  texture.rotation = rotation;


  return texture;
}

// Buat video texture
const videoTexture = createVideoTexture("/textures/video/Screen2.mp4", Math.PI / 2);
/**  -------------------------- Model and Mesh Setup -------------------------- */

let coffeePosition;
let chairTop;
let birdBody;
let leftBirdWing;
let rightBirdWing;
let AccFourth1;
let AccFourth2;
const xAxisFans = [];
const yAxisFans = [];
let cactus;
const books = [];
const eggs = [];

loader.load("/models/Room_Portfolio.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (!child.isMesh) return;

    // Simpan rotasi awal
    if (["Chair_Top", "Birdwing_1", "Birdwing_2", "Acc_Fourth_1", "Acc_Fourth_2"].some(name => child.name.includes(name))) {
      child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
    }

    // Simpan objek khusus
    if (child.name.includes("Chair_Top")) chairTop = child;
    if (child.name === "Bird_1_Fourth_Raycaster") {
      birdBody = child;
      birdBody.userData.initialPosition = birdBody.position.clone();
    }
    if (child.name.includes("Birdwing_1")) leftBirdWing = child;
    if (child.name.includes("Birdwing_2")) rightBirdWing = child;
    if (child.name === "Acc_Fourth_1") AccFourth1 = child;
    if (child.name === "Acc_Fourth_2") AccFourth2 = child;

    if (child.name.includes("Coffee")) {
      coffeePosition = child.position.clone();
    }

    if (child.name.includes("Raycaster")) {
      raycasterObjects.push(child);
    }

    if (child.name.includes("Hover")) {
      child.userData.initialScale = child.scale.clone();
      child.userData.initialPosition = child.position.clone();
      child.userData.initialRotation = child.rotation.clone();
    }

    // Atur animasi intro dan sembunyikan
    if (child.name.includes("Book_")) {
      books.push(child);
      child.scale.set(0, 0, 0);
    }

    if (child.name.includes("Egg_")) {
      eggs.push(child);
      child.scale.set(0, 0, 0);
    }

    if (child.name.includes("Cactus")) {
      cactus = child;
      child.scale.set(0, 0, 0);
    }

    if (child.name.includes("Screen")) {
      child.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: false,
        opacity: 1,
      });
    } 

    // TERPISAH: Apply material jika ada
    Object.keys(textureMap).forEach((key) => {
      if (child.name.includes(key)) {
        child.material = roomMaterials[key];

        if (child.name.includes("Fan")) {
          if (child.name.includes("Fan_2") || child.name.includes("Fan_4")) {
            xAxisFans.push(child);
          } else {
            yAxisFans.push(child);
          }
        }
      }
    });
  });

  // Tempatkan asap kopi
  if (coffeePosition) {
    smoke.position.set(
      coffeePosition.x,
      coffeePosition.y + 0.2,
      coffeePosition.z
    );
  }

  scene.add(glb.scene);
});


/**  -------------------------- Raycaster setup -------------------------- */

const raycasterObjects = [];
let currentIntersects = [];
let currentHoveredObject = null;

const socialLinks = {
  GitHub: "https://github.com/#",
  YouTube: "https://instagram.com/razornez",
  Twitter: "https://wa.me/6285889963822",
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function handleRaycasterInteraction() {
  if (currentIntersects.length > 0) {
    const object = currentIntersects[0].object;

    if (object.name.includes("Button")) {
      buttonSounds.click.play();
    }

    Object.entries(socialLinks).forEach(([key, url]) => {
      if (object.name.includes(key)) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer";
      }
    });

    if (object.name.includes("About_Button")) {
      showModal(modals.about);
    }
  }
}

function playHoverAnimation(object, isHovering) {
  let scale = 1.4;
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.rotation);
  gsap.killTweensOf(object.position);

  if (object.name.includes("Coffee")) {
    gsap.killTweensOf(smoke.scale);
    if (isHovering) {
      gsap.to(smoke.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 0.5,
        ease: "back.out(2)",
      });
    } else {
      gsap.to(smoke.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: "back.out(2)",
      });
    }
  }

  if (object.name.includes("Fish")) {
    scale = 1.2;
  }

  if (isHovering) {
    // Scale animation for all objects
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * scale,
      y: object.userData.initialScale.y * scale,
      z: object.userData.initialScale.z * scale,
      duration: 0.5,
      ease: "back.out(2)",
    });

    if (object.name.includes("About_Button")) {
      gsap.to(object.rotation, {
        x: object.userData.initialRotation.x - Math.PI / 10,
        duration: 0.5,
        ease: "back.out(2)",
      });
    }
  } else {
    // Reset scale for all objects
    gsap.to(object.scale, {
      x: object.userData.initialScale.x,
      y: object.userData.initialScale.y,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease: "back.out(2)",
    });

    if (
      object.name.includes("About_Button") ||
      object.name.includes("Contact_Button") ||
      object.name.includes("My_Work_Button") ||
      object.name.includes("GitHub") ||
      object.name.includes("YouTube") ||
      object.name.includes("Twitter")
    ) {
      gsap.to(object.rotation, {
        x: object.userData.initialRotation.x,
        duration: 0.3,
        ease: "back.out(2)",
      });
    }

    if (object.name.includes("Name_Letter")) {
      gsap.to(object.position, {
        y: object.userData.initialPosition.y,
        duration: 0.3,
        ease: "back.out(2)",
      });
    }
  }
}

window.addEventListener("mousemove", (e) => {
  touchHappened = false;
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener(
  "touchstart",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    handleRaycasterInteraction();
  },
  { passive: false }
);

window.addEventListener("click", handleRaycasterInteraction);

// Other Event Listeners
const themeToggleButton = document.querySelector(".theme-toggle-button");
const muteToggleButton = document.querySelector(".mute-toggle-button");
const aboutToggleButton = document.querySelector(".about-toggle-button");
const sunSvg = document.querySelector(".sun-svg");
const moonSvg = document.querySelector(".moon-svg");
const aboutSvg = document.querySelector(".about-svg");
const soundOffSvg = document.querySelector(".sound-off-svg");
const soundOnSvg = document.querySelector(".sound-on-svg");

const updateMuteState = (muted) => {
  if (muted) {
    backgroundMusic.volume(0);
  } else {
    backgroundMusic.volume(BACKGROUND_MUSIC_VOLUME);
  }

  buttonSounds.click.mute(muted);
};

const handleMuteToggle = (e) => {
  e.preventDefault();

  isMuted = !isMuted;
  updateMuteState(isMuted);
  buttonSounds.click.play();

  gsap.to(muteToggleButton, {
    rotate: -45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (!isMuted) {
        soundOffSvg.style.display = "none";
        soundOnSvg.style.display = "block";
      } else {
        soundOnSvg.style.display = "none";
        soundOffSvg.style.display = "block";
      }

      gsap.to(muteToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(muteToggleButton, {
            clearProps: "all",
          });
        },
      });
    },
  });
};

let isMuted = false;
muteToggleButton.addEventListener(
  "click",
  (e) => {
    backgroundMusic.volume(0);
    if (touchHappened) return;
    handleMuteToggle(e);
  },
  { passive: false }
);

muteToggleButton.addEventListener(
  "touchend",
  (e) => {
    backgroundMusic.volume(BACKGROUND_MUSIC_VOLUME);
    touchHappened = true;
    handleMuteToggle(e);
  },
  { passive: false }
);

// Themeing stuff
const toggleFavicons = () => {
  const isDark = document.body.classList.contains("dark-theme");
  const theme = isDark ? "light" : "dark";

  document.querySelector(
    'link[sizes="96x96"]'
  ).href = `media/${theme}-favicon/favicon-96x96.png`;
  document.querySelector(
    'link[type="image/svg+xml"]'
  ).href = `/media/${theme}-favicon/favicon.svg`;
  document.querySelector(
    'link[rel="shortcut icon"]'
  ).href = `media/${theme}-favicon/favicon.ico`;
  document.querySelector(
    'link[rel="apple-touch-icon"]'
  ).href = `media/${theme}-favicon/apple-touch-icon.png`;
  document.querySelector(
    'link[rel="manifest"]'
  ).href = `media/${theme}-favicon/site.webmanifest`;
};

let isNightMode = false;

const skyBackground = document.getElementById('sky-background');

const handleThemeToggle = (e) => {
  e.preventDefault();
  toggleFavicons();

  const isDark = document.body.classList.contains("dark-theme");
  document.body.classList.remove(isDark ? "dark-theme" : "light-theme");
  document.body.classList.add(isDark ? "light-theme" : "dark-theme");

  isNightMode = !isNightMode;
  buttonSounds.click.play();

  if (isNightMode) {
    scene.background = new THREE.Color(0x0a0a23);
    // fade in stars, etc.
  } else {
    scene.background = new THREE.Color("#D9CAD1");
    // fade out stars, etc.
  }

  // Animate button
  gsap.to(themeToggleButton, {
    rotate: 45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (isNightMode) {
        sunSvg.style.display = "none";
        moonSvg.style.display = "block";
      } else {
        moonSvg.style.display = "none";
        sunSvg.style.display = "block";
      }

      gsap.to(themeToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(themeToggleButton, {
            clearProps: "all",
          });
        },
      });
    },
  });

  // Animate room materials
  Object.values(roomMaterials).forEach((material) => {
    gsap.to(material.uniforms.uMixRatio, {
      value: isNightMode ? 1 : 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
  });
};

// Click event listener
themeToggleButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    handleThemeToggle(e);
  },
  { passive: false }
);

themeToggleButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    handleThemeToggle(e);
  },
  { passive: false }
);

aboutToggleButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;

    // Animasikan posisi kamera
    gsap.to(camera.position, {
      x: 0.4053795360936806,
      y: 8.43632336727302,
      z: 6.323978769231198,
      duration: 1.5, // Durasi animasi (detik)
      ease: "power2.inOut", // Jenis easing untuk transisi mulus
      onUpdate: () => controls.update() // Pastikan controls diupdate selama animasi
    });

    // Animasikan target kontrol
    gsap.to(controls.target, {
      x: 0.26503182728152547,
      y: 7.603102165932663,
      z: 1.3958914170966892,
      duration: 1.5, // Durasi animasi harus sama dengan posisi kamera
      ease: "power2.inOut",
      onComplete: () => {
        // Setelah animasi selesai, baru tampilkan modal
        showModal(modals.about);
      }
    });
  },
  { passive: false }
);

aboutToggleButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
  },
  { passive: false }
);

/**  -------------------------- Render and Animations Stuff -------------------------- */
const clock = new THREE.Clock();

const render = (timestamp) => {
  const elapsedTime = clock.getElapsedTime();

  // Update Shader Univform
  smokeMaterial.uniforms.uTime.value = elapsedTime;

  //Update Orbit Controls
  controls.update();

  const time = timestamp * 0.001;

  // --- DEBUGGING KAMERA DI SINI ---
  // console.log("Camera Position:", camera.position);
  // console.log("Controls Target:", controls.target);


  // Reusable oscillation function
  function applyOscillation(object, axis, amplitude, speedMultiplier = 1.0) {
    if (!object) return;
    const wave = Math.sin(time * speedMultiplier);
    const offset = amplitude * wave * (1 - Math.abs(wave) * 0.3);
    object.rotation[axis] = object.userData.initialRotation[axis] + offset;
  }
  
  // Reusable wing flapping function
  function applyFlap(object, direction = 1, body = null) {
    if (!object) return;
  
    const flapAngle = THREE.MathUtils.degToRad(90);
    const flapSpeed = 25.0;
    const wingOffset = (flapAngle / 2) * (1 + Math.cos(time * flapSpeed));
    object.rotation.x = object.userData.initialRotation.x + direction * wingOffset;
  
    // ⬆️ Gerakkan tubuh naik-turun jika diberikan
    if (body) {
      const bounce = Math.sin(time * flapSpeed) * 0.03; // atur amplitude sesuai kebutuhan
      body.position.y = body.userData.initialPosition.y + bounce;
    }
  }
  
  // Apply animations
  applyOscillation(chairTop, 'y', Math.PI / 8, 0.5);
  applyFlap(leftBirdWing, -1, birdBody);  // Sayap kiri
  applyFlap(rightBirdWing, 1, birdBody);  // Sayap kanan
  applyOscillation(AccFourth1, 'x', Math.PI / 10, 1.0);
  applyOscillation(AccFourth2, 'x', Math.PI / 8, 1.5);
  
  // Raycaster
  if (!isModalOpen) {
    raycaster.setFromCamera(pointer, camera);

    // Get all the objects the raycaster is currently shooting through / intersecting with
    currentIntersects = raycaster.intersectObjects(raycasterObjects);

    for (let i = 0; i < currentIntersects.length; i++) {}

    if (currentIntersects.length > 0) {
      const currentIntersectObject = currentIntersects[0].object;

      if (currentIntersectObject.name.includes("Hover")) {
        if (currentIntersectObject !== currentHoveredObject) {
          if (currentHoveredObject) {
            playHoverAnimation(currentHoveredObject, false);
          }

          playHoverAnimation(currentIntersectObject, true);
          currentHoveredObject = currentIntersectObject;
        }
      }

      if (currentIntersectObject.name.includes("Pointer")) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    } else {
      if (currentHoveredObject) {
        playHoverAnimation(currentHoveredObject, false);
        currentHoveredObject = null;
      }
      document.body.style.cursor = "default";
    }
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();

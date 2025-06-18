# Tree House 3D Portfolio

**[Live Site](https://tree-house-3d.vercel.app/)**

![Page screenshot](public/media/image-intro.webp?raw=true "Page screenshot")

Welcome to the **Tree House 3D Portfolio**! This is a captivating interactive portfolio project, built using the power of 3D modeling from [Blender](https://www.blender.org/) and advanced web visualization with [Three.js](https://threejs.org/). Experience a unique journey exploring a cozy miniature world nestled within a tree house, where every object is interactive and leads to portfolio sections or contact information.

## Key Features

* **Immersive 3D Experience:** Explore a detailed 3D tree house, with models optimized for web performance.
* **Intuitive Interaction:** Easily navigate the camera using mouse controls (click & drag, scroll) or touch gestures (one/two fingers) on mobile devices.
* **Day & Night Mode:** Experience a change of ambiance with a theme toggle feature that transforms the environment's lighting and textures from a bright day to a tranquil night.
* **Interactive Audio:** Enjoy soothing background music and responsive sound effects (SFX) when interacting with elements within the tree house. A mute feature is also available for a personalized experience.
* **Innovative Portfolio Navigation:** Click on specific objects within the tree house (such as books, a computer screen, etc.) to reveal modal information about my projects or contact details.
* **Smooth Camera Transitions:** Camera movements to specific focal areas (e.g., when opening modals or clicking interactive objects) are seamlessly animated using GSAP.
* **Dynamic Loading Screen:** An engaging loading experience featuring a rocket animation and a smooth visual transition from night mode to day mode upon entering the "room."
* **Responsive Design:** The portfolio is designed to be accessible and fully functional across various screen sizes, from desktops to mobile devices.
* **"Scroll Down" Button:** Provides easy navigation to the scrollable traditional portfolio section located below the 3D view.

## Technologies Used

* **Frontend Framework:**
    * **HTML5:** The fundamental structure of the web page.
    * **CSS (Sass/SCSS):** Modern and structured styling with variables for theming and mixins for responsiveness.
    * **JavaScript (ES6+):** Core logic and interactivity.
* **3D Graphics & Animation:**
    * **Blender:** Used for 3D modeling, texturing, and asset optimization. Models are optimized with DRACO compression.
    * **Three.js:** A powerful JavaScript library for displaying 3D graphics on the web.
    * **GSAP (GreenSock Animation Platform):** Employed for fluid UI element animations, camera transitions, and other visual effects.
* **Asset Management & Optimization:**
    * **GLTFLoader (Three.js):** For loading 3D models (in `.glb` format).
    * **DRACOLoader (Three.js):** For decoding compressed 3D models, ensuring faster loading times.
    * **Howler.js:** A lightweight audio library for robust sound management and cross-browser (including mobile) compatibility.
* **Bundler:**
    * **Vite:** A next-generation frontend tooling for rapid development.

## Project Structure (Overview)

├── public/                 # Static assets (3D models, textures, audio, images, fonts, favicons)
│   ├── models/
│   ├── media/
│   ├── audio/
│   ├── fonts/
│   └── shaders/            # Custom GLSL shaders for material effects and themes
├── src/
│   ├── main.js             # Main JavaScript logic, Three.js initialization, interactions
│   ├── style.scss          # Primary project styling (using Sass)
│   ├── utils/              # JavaScript utilities (e.g., OrbitControls)
│   └── shaders/            # Shader files (vertex.glsl, fragment.glsl)
└── index.html              # Main HTML structure


## Getting Started (Development)

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/tree-house-3d-portfolio.git](https://github.com/your-username/tree-house-3d-portfolio.git)
    cd tree-house-3d-portfolio
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will open in your browser, typically at `http://localhost:5173/`.

## Contributing

Contributions in the form of ideas, bug fixes, or new feature additions are highly welcome! Please feel free to submit a *pull request* or open an *issue* in this repository.

## Info & Credits

This project is inspired by and utilizes certain references/assets from the following amazing works:

* **3D Room Concept Inspiration:**
    * [Bruno Simon's Room](https://my-room-in-3d.vercel.app/) - A masterclass in web 3D experiences.
    * [Rachel Wei's Room](https://rachelqrwei.ca/) - Inspiration for a personalized portfolio space.
* **3D Models / Assets:**
    * [Nicky Blender](https://www.instagram.com/nicky.blender/?hl=en) - Potential model provider or style inspiration.
* **Audio:**
    * [Background Music](https://www.youtube.com/watch?v=LIw856LAfno) - Source of background music.
    * [Click SFX](https://uppbeat.io/sfx/category/digital-and-ui/ui) - Source of UI sound effects.
* **Graphics & Design:**
    * [SVGs](https://www.svgrepo.com/) - Source of SVG icons.
    * [Fonts](https://www.fontspace.com/niskala-huruf) - Source of fonts used in the project.

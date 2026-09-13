// SceneManager.js
// Gère la scène 3D, la grille en damier, et les objets

class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.grid = null;
        this.objects = [];
        this.currentMode = '3d';

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f0f1e);

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Create checkerboard grid
        this.createCheckerboardGrid(20, 20);

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    createCheckerboardGrid(size, divisions) {
        // Grid helper
        const gridHelper = new THREE.GridHelper(size, divisions, 0x4ade80, 0x2a2a3e);
        this.scene.add(gridHelper);
        this.grid = gridHelper;

        // Checkerboard plane
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const tileSize = 64;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? '#2a2a3e' : '#1a1a2e';
                ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(divisions / 2, divisions / 2);

        const planeGeometry = new THREE.PlaneGeometry(size, size);
        const planeMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    addPrimitive(type, position = [0, 1, 0]) {
        let geometry;

        switch (type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.5, 32, 32);
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(2, 2);
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }

        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.7,
            metalness: 0.3
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);
        this.objects.push(mesh);

        console.log(`✅ Added ${type} at`, position);
        return mesh;
    }

    setMode(mode) {
        this.currentMode = mode;

        switch (mode) {
            case '3d':
                this.camera.fov = 60;
                this.camera.updateProjectionMatrix();
                this.controls.enabled = true;
                this.grid.visible = true;
                break;

            case '2d':
                // Orthographic top-down view
                this.camera.position.set(0, 20, 0);
                this.camera.lookAt(0, 0, 0);
                this.controls.enabled = true;
                this.grid.visible = true;
                break;

            case 'render':
                // Cinematic view
                this.camera.fov = 45;
                this.camera.updateProjectionMatrix();
                this.controls.enabled = true;
                this.grid.visible = false;
                break;

            case 'game':
                // Game mode handled by GameMode class
                this.controls.enabled = false;
                this.grid.visible = false;
                break;
        }

        console.log(`📷 Mode changed to: ${mode}`);
    }

    clear() {
        // Remove all objects except grid and plane
        this.objects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        this.objects = [];
        console.log('🗑️ Scene cleared');
    }

    saveScene() {
        const sceneData = {
            objects: this.objects.map(obj => ({
                type: obj.geometry.type,
                position: obj.position.toArray(),
                rotation: obj.rotation.toArray(),
                scale: obj.scale.toArray(),
                color: obj.material.color.getHex()
            }))
        };

        const json = JSON.stringify(sceneData, null, 2);
        console.log('💾 Scene saved:', json);
        return json;
    }

    loadScene(sceneData) {
        this.clear();

        sceneData.objects.forEach(objData => {
            // Recreate objects from saved data
            // TODO: Implement full loading logic
            console.log('📥 Loading object:', objData);
        });
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }
}

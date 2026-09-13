// main.js
// Point d'entrée principal de l'application

let sceneManager;
let assetManager;
let characterController;
let virtualJoystick;
let gameMode;
let clock;

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    console.log('🎮 Initializing Game Editor...');

    // Hide loading screen after a delay
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);

    // Initialize clock for delta time
    clock = new THREE.Clock();

    // Initialize scene manager
    const viewport = document.getElementById('viewport');
    sceneManager = new SceneManager(viewport);

    // Initialize asset manager
    assetManager = new AssetManager(sceneManager);

    // Initialize character controller
    characterController = new CharacterController(sceneManager);

    // Initialize virtual joystick
    const joystickBase = document.querySelector('.joystick-base');
    const joystickStick = document.querySelector('.joystick-stick');
    virtualJoystick = new VirtualJoystick(joystickBase, joystickStick);

    // Initialize game mode
    gameMode = new GameMode(sceneManager, characterController, virtualJoystick);

    // Setup UI event listeners
    setupUI();

    // Start update loop
    animate();

    console.log('✅ Game Editor initialized');
}

function setupUI() {
    // Mode switcher buttons
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);

            // Update active button
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Primitive asset buttons
    const primitiveItems = document.querySelectorAll('.asset-item[data-type]');
    primitiveItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            sceneManager.addPrimitive(type);
        });
    });

    // Toolbar buttons
    document.getElementById('btn-clear').addEventListener('click', () => {
        if (confirm('Effacer toute la scène ?')) {
            sceneManager.clear();
        }
    });

    document.getElementById('btn-save').addEventListener('click', () => {
        const json = sceneManager.saveScene();
        // TODO: Save to backend
        alert('Scène sauvegardée (console)');
    });

    document.getElementById('btn-load').addEventListener('click', () => {
        // TODO: Load from backend
        alert('Chargement non implémenté');
    });

    document.getElementById('btn-play').addEventListener('click', () => {
        switchMode('game');
        document.querySelector('.mode-btn[data-mode="game"]').classList.add('active');
        document.querySelectorAll('.mode-btn:not([data-mode="game"])').forEach(b => b.classList.remove('active'));
    });
}

function switchMode(mode) {
    console.log(`🔄 Switching to mode: ${mode}`);

    // Update scene manager mode
    sceneManager.setMode(mode);

    // Handle game mode
    if (mode === 'game') {
        gameMode.activate();
    } else {
        gameMode.deactivate();
    }

    // Update status
    const statusEl = document.getElementById('status');
    const modeNames = {
        '3d': '3D Editor',
        '2d': '2D Top-Down',
        'render': 'Render Preview',
        'game': 'Game Mode'
    };
    statusEl.textContent = `Mode: ${modeNames[mode]}`;
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    // Update character animations
    if (characterController) {
        characterController.update(deltaTime);
    }

    // Update game mode
    if (gameMode && gameMode.active) {
        gameMode.update(deltaTime);
    }
}

// Expose to window for debugging
window.sceneManager = sceneManager;
window.assetManager = assetManager;
window.characterController = characterController;
window.gameMode = gameMode;

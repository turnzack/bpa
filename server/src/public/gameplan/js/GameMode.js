// GameMode.js
// Gère le mode jeu avec contrôles et caméra 3ème personne

class GameMode {
    constructor(sceneManager, characterController, joystick) {
        this.sceneManager = sceneManager;
        this.characterController = characterController;
        this.joystick = joystick;
        this.active = false;
        this.isRunning = false;
        this.cameraOffset = new THREE.Vector3(0, 3, -5);
        this.cameraLookOffset = new THREE.Vector3(0, 1, 0);

        this.setupButtons();
    }

    setupButtons() {
        const jumpBtn = document.querySelector('.btn-jump');
        const runBtn = document.querySelector('.btn-run');

        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', () => this.onJump());
            jumpBtn.addEventListener('mousedown', () => this.onJump());
        }

        if (runBtn) {
            runBtn.addEventListener('touchstart', () => this.isRunning = true);
            runBtn.addEventListener('touchend', () => this.isRunning = false);
            runBtn.addEventListener('mousedown', () => this.isRunning = true);
            runBtn.addEventListener('mouseup', () => this.isRunning = false);
        }
    }

    activate() {
        this.active = true;
        console.log('🎮 Game mode activated');

        // Show game controls
        const gameControls = document.getElementById('game-controls');
        gameControls.classList.add('active');

        // Hide asset panel and toolbar
        document.getElementById('asset-panel').style.display = 'none';
        document.getElementById('toolbar').style.display = 'none';

        // Adjust viewport
        const viewport = document.getElementById('viewport');
        viewport.style.left = '0';
        viewport.style.bottom = '180px';
    }

    deactivate() {
        this.active = false;
        console.log('🎮 Game mode deactivated');

        // Hide game controls
        const gameControls = document.getElementById('game-controls');
        gameControls.classList.remove('active');

        // Show asset panel and toolbar
        document.getElementById('asset-panel').style.display = 'block';
        document.getElementById('toolbar').style.display = 'flex';

        // Reset viewport
        const viewport = document.getElementById('viewport');
        viewport.style.left = '200px';
        viewport.style.bottom = '60px';

        // Reset character animation
        this.characterController.stopAnimation();
    }

    onJump() {
        if (!this.active) return;
        console.log('🦘 Jump!');
        this.characterController.playAnimation('jump');

        // Reset to idle after jump
        setTimeout(() => {
            if (this.active) {
                this.characterController.playAnimation('idle');
            }
        }, 1000);
    }

    update(deltaTime) {
        if (!this.active) return;

        const character = this.characterController.getCharacter();
        if (!character) return;

        // Get joystick input
        const input = this.joystick.getPosition();
        const inputMagnitude = Math.sqrt(input.x * input.x + input.y * input.y);

        // Determine speed and animation
        if (inputMagnitude > 0.1) {
            const speed = this.isRunning ? 0.1 : 0.05;

            // Move character
            this.characterController.move(input, speed);

            // Play appropriate animation
            if (this.isRunning) {
                this.characterController.playAnimation('run');
            } else {
                this.characterController.playAnimation('walk');
            }
        } else {
            // Idle
            this.characterController.playAnimation('idle');
        }

        // Update camera to follow character
        this.updateCamera();
    }

    updateCamera() {
        const character = this.characterController.getCharacter();
        if (!character) return;

        const camera = this.sceneManager.getCamera();

        // Calculate target camera position (behind and above character)
        const targetPosition = character.position.clone();
        const offset = this.cameraOffset.clone();

        // Rotate offset based on character rotation
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), character.rotation.y);
        targetPosition.add(offset);

        // Smooth camera movement
        camera.position.lerp(targetPosition, 0.1);

        // Look at character (slightly above)
        const lookTarget = character.position.clone().add(this.cameraLookOffset);
        camera.lookAt(lookTarget);
    }
}

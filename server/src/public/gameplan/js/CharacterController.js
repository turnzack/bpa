// CharacterController.js
// Gère le personnage et ses animations

class CharacterController {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.character = null;
        this.mixer = null;
        this.animations = new Map();
        this.currentAnimation = null;
        this.fbxLoader = new THREE.FBXLoader();
    }

    loadCharacter(fbxPath) {
        console.log('👤 Loading character:', fbxPath);

        return new Promise((resolve, reject) => {
            this.fbxLoader.load(
                fbxPath,
                (fbx) => {
                    this.character = fbx;
                    this.character.scale.setScalar(0.01);
                    this.character.position.set(0, 0, 0);

                    // Enable shadows
                    this.character.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    // Create animation mixer
                    this.mixer = new THREE.AnimationMixer(this.character);

                    // Add to scene
                    const scene = this.sceneManager.getScene();
                    scene.add(this.character);

                    console.log('✅ Character loaded');
                    resolve(this.character);
                },
                undefined,
                (error) => {
                    console.error('❌ Failed to load character:', error);
                    reject(error);
                }
            );
        });
    }

    loadAnimation(name, fbxPath) {
        console.log(`🎬 Loading animation "${name}":`, fbxPath);

        return new Promise((resolve, reject) => {
            this.fbxLoader.load(
                fbxPath,
                (fbx) => {
                    if (fbx.animations && fbx.animations.length > 0) {
                        const clip = fbx.animations[0];
                        const action = this.mixer.clipAction(clip);
                        this.animations.set(name, action);
                        console.log(`✅ Animation "${name}" loaded`);
                        resolve(action);
                    } else {
                        console.warn(`⚠️ No animations found in ${fbxPath}`);
                        reject(new Error('No animations found'));
                    }
                },
                undefined,
                (error) => {
                    console.error(`❌ Failed to load animation "${name}":`, error);
                    reject(error);
                }
            );
        });
    }

    playAnimation(name, fadeTime = 0.2) {
        if (!this.mixer) {
            console.warn('⚠️ No mixer available');
            return;
        }

        const action = this.animations.get(name);
        if (!action) {
            console.warn(`⚠️ Animation "${name}" not found`);
            return;
        }

        // Fade out current animation
        if (this.currentAnimation && this.currentAnimation !== action) {
            this.currentAnimation.fadeOut(fadeTime);
        }

        // Fade in new animation
        action.reset().fadeIn(fadeTime).play();
        this.currentAnimation = action;

        console.log(`▶️ Playing animation: ${name}`);
    }

    stopAnimation() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
            this.currentAnimation = null;
        }
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    getCharacter() {
        return this.character;
    }

    move(direction, speed) {
        if (!this.character) return;

        const moveVector = new THREE.Vector3(direction.x, 0, direction.y);
        moveVector.normalize().multiplyScalar(speed);

        this.character.position.add(moveVector);

        // Rotate character to face movement direction
        if (moveVector.length() > 0.01) {
            const angle = Math.atan2(moveVector.x, moveVector.z);
            this.character.rotation.y = angle;
        }
    }
}

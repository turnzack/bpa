// AssetManager.js
// Gère le chargement et l'affichage des assets FBX

class AssetManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.fbxLoader = new THREE.FBXLoader();
        this.availableAssets = [];
        this.loadedModels = new Map();

        this.init();
    }

    async init() {
        // Fetch available FBX files from backend
        await this.fetchAvailableAssets();
        this.populateAssetPanel();
    }

    async fetchAvailableAssets() {
        try {
            const response = await fetch('/api/models');
            const data = await response.json();
            this.availableAssets = data.models || [];
            console.log('📦 Available assets:', this.availableAssets);
        } catch (err) {
            console.error('❌ Failed to fetch assets:', err);
            // Fallback to mock data for testing
            this.availableAssets = [
                { id: '1', name: 'Character', path: '/data/jobs/1766516817524/output/Walking.fbx', type: 'character' },
                { id: '2', name: 'Fast Run', path: '/data/jobs/1766516817524/output/Fast Run (1).fbx', type: 'animation' },
                { id: '3', name: 'Running Jump', path: '/data/jobs/1766516817524/output/Running Jump.fbx', type: 'animation' }
            ];
        }
    }

    populateAssetPanel() {
        const characterList = document.getElementById('character-list');
        const objectList = document.getElementById('object-list');

        this.availableAssets.forEach(asset => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.textContent = asset.name;
            item.dataset.assetId = asset.id;
            item.dataset.assetPath = asset.path;

            item.addEventListener('click', () => {
                this.loadAsset(asset);
            });

            if (asset.type === 'character' || asset.type === 'animation') {
                characterList.appendChild(item);
            } else {
                objectList.appendChild(item);
            }
        });
    }

    loadAsset(asset) {
        console.log('📥 Loading asset:', asset.name);

        this.fbxLoader.load(
            asset.path,
            (fbx) => {
                this.onAssetLoaded(fbx, asset);
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(0);
                console.log(`Loading ${asset.name}: ${percent}%`);
            },
            (error) => {
                console.error('❌ Failed to load asset:', error);
            }
        );
    }

    onAssetLoaded(fbx, asset) {
        // Scale down (FBX models are often huge)
        fbx.scale.setScalar(0.01);

        // Position at origin
        fbx.position.set(0, 0, 0);

        // Enable shadows
        fbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Add to scene
        const scene = this.sceneManager.getScene();
        scene.add(fbx);

        // Store reference
        this.loadedModels.set(asset.id, fbx);

        console.log('✅ Asset loaded:', asset.name);

        // Update status
        const statusEl = document.getElementById('status');
        statusEl.textContent = `✅ Loaded: ${asset.name}`;
        setTimeout(() => {
            statusEl.textContent = `Mode: ${this.sceneManager.currentMode}`;
        }, 2000);
    }

    getLoadedModel(assetId) {
        return this.loadedModels.get(assetId);
    }

    removeAsset(assetId) {
        const model = this.loadedModels.get(assetId);
        if (model) {
            const scene = this.sceneManager.getScene();
            scene.remove(model);
            this.loadedModels.delete(assetId);
            console.log('🗑️ Asset removed:', assetId);
        }
    }
}

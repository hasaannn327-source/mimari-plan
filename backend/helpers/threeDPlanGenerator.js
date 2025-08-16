const planData = require("../planData.json");
const fs = require('fs');
const path = require('path');

class ThreeDPlanGenerator {
  constructor() {
    // 3D mimari standartları
    this.architecturalStandards = {
      "1+1": { 
        livingRoom: { width: 4.5, length: 5.0, height: 2.8 },
        bedroom: { width: 3.5, length: 4.0, height: 2.8 },
        kitchen: { width: 2.5, length: 3.0, height: 2.8 },
        bathroom: { width: 2.0, length: 2.5, height: 2.8 },
        hallway: { width: 1.2, length: 3.0, height: 2.8 }
      },
      "2+1": {
        livingRoom: { width: 5.0, length: 5.5, height: 2.8 },
        bedroom1: { width: 4.0, length: 4.5, height: 2.8 },
        bedroom2: { width: 3.5, length: 4.0, height: 2.8 },
        kitchen: { width: 3.0, length: 3.5, height: 2.8 },
        bathroom: { width: 2.5, length: 3.0, height: 2.8 },
        hallway: { width: 1.5, length: 3.5, height: 2.8 }
      },
      "3+1": {
        livingRoom: { width: 5.5, length: 6.0, height: 2.8 },
        bedroom1: { width: 4.5, length: 5.0, height: 2.8 },
        bedroom2: { width: 4.0, length: 4.5, height: 2.8 },
        bedroom3: { width: 3.5, length: 4.0, height: 2.8 },
        kitchen: { width: 3.5, length: 4.0, height: 2.8 },
        bathroom: { width: 3.0, length: 3.5, height: 2.8 },
        hallway: { width: 1.8, length: 4.0, height: 2.8 }
      },
      "4+1": {
        livingRoom: { width: 6.0, length: 6.5, height: 2.8 },
        bedroom1: { width: 5.0, length: 5.5, height: 2.8 },
        bedroom2: { width: 4.5, length: 5.0, height: 2.8 },
        bedroom3: { width: 4.0, length: 4.5, height: 2.8 },
        bedroom4: { width: 3.5, length: 4.0, height: 2.8 },
        kitchen: { width: 4.0, length: 4.5, height: 2.8 },
        bathroom: { width: 3.5, length: 4.0, height: 2.8 },
        hallway: { width: 2.0, length: 4.5, height: 2.8 }
      }
    };

    // 3D materyal tanımları
    this.materials = {
      wall: { color: 0xf5f5f5, roughness: 0.8, metalness: 0.1 },
      floor: { color: 0x8d6e63, roughness: 0.9, metalness: 0.0 },
      ceiling: { color: 0xffffff, roughness: 0.7, metalness: 0.0 },
      glass: { color: 0x87ceeb, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.3 },
      wood: { color: 0x8b4513, roughness: 0.6, metalness: 0.0 },
      metal: { color: 0x708090, roughness: 0.3, metalness: 0.8 }
    };

    // 3D ışık konfigürasyonları
    this.lighting = {
      ambient: { color: 0x404040, intensity: 0.4 },
      directional: { color: 0xffffff, intensity: 0.8, position: { x: 10, y: 10, z: 5 } },
      point: { color: 0xffaa00, intensity: 0.6, distance: 100, decay: 2 }
    };
  }

  generate3DPlan(planId, options = {}) {
    const plan = planData.floorPlans.find(p => p.id === planId);
    if (!plan) return null;

    const standards = this.architecturalStandards[plan.apartmentType];
    const {
      enableShadows = true,
      enableTextures = true,
      enableFurniture = true,
      cameraPosition = { x: 15, y: 15, z: 15 },
      renderQuality = 'high'
    } = options;

    console.log(`Generating 3D plan for ${plan.apartmentType} with ${plan.streetFacingSides} facades`);

    // HTML dosyası oluştur
    const html = this.generate3DHTML(plan, standards, options);
    
    // JavaScript dosyası oluştur
    const js = this.generate3DJavaScript(plan, standards, options);
    
    // CSS dosyası oluştur
    const css = this.generate3DCSS(options);

    return { html, js, css };
  }

  generate3DHTML(plan, standards, options) {
    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D ${plan.name}</title>
    <link rel="stylesheet" href="3d-plan.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
</head>
<body>
    <div class="container">
        <header class="plan-header">
            <h1>🏗️ ${plan.name}</h1>
            <div class="plan-info">
                <span class="info-item">📐 ${plan.apartmentType}</span>
                <span class="info-item">🏠 ${plan.streetFacingSides} Cephe</span>
                <span class="info-item">📏 ${plan.minUsableArea}-${plan.maxUsableArea} m²</span>
            </div>
        </header>

        <div class="controls-panel">
            <div class="control-group">
                <label>Kamera Kontrolü:</label>
                <button id="resetCamera" class="control-btn">🔄 Sıfırla</button>
                <button id="topView" class="control-btn">⬆️ Üstten</button>
                <button id="sideView" class="control-btn">➡️ Yan</button>
                <button id="perspectiveView" class="control-btn">👁️ Perspektif</button>
            </div>
            
            <div class="control-group">
                <label>Görünüm:</label>
                <button id="toggleWalls" class="control-btn active">🧱 Duvarlar</button>
                <button id="toggleFurniture" class="control-btn active">🪑 Mobilya</button>
                <button id="toggleLighting" class="control-btn active">💡 Işık</button>
                <button id="toggleShadows" class="control-btn active">🌑 Gölge</button>
            </div>

            <div class="control-group">
                <label>Kalite:</label>
                <button id="lowQuality" class="control-btn">📱 Düşük</button>
                <button id="mediumQuality" class="control-btn active">💻 Orta</button>
                <button id="highQuality" class="control-btn">🚀 Yüksek</button>
            </div>
        </div>

        <div class="viewer-container">
            <div id="3dScene" class="scene"></div>
            
            <div class="info-panel">
                <div class="room-info">
                    <h3>🏠 Oda Bilgileri</h3>
                    <div id="roomDetails"></div>
                </div>
                
                <div class="measurements">
                    <h3>📏 Ölçüler</h3>
                    <div id="measurementDetails"></div>
                </div>
                
                <div class="features">
                    <h3>✨ Özellikler</h3>
                    <ul>
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="action-panel">
            <button id="exportImage" class="action-btn">📸 Resim İndir</button>
            <button id="export3D" class="action-btn">📦 3D Model İndir</button>
            <button id="sharePlan" class="action-btn">📤 Paylaş</button>
            <button id="printPlan" class="action-btn">🖨️ Yazdır</button>
        </div>
    </div>

    <script src="3d-plan.js"></script>
</body>
</html>`;
  }

  generate3DJavaScript(plan, standards, options) {
    return `// 3D Mimari Plan Görüntüleyici
class ThreeDPlanViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planData = ${JSON.stringify(plan)};
        this.standards = ${JSON.stringify(standards)};
        this.options = ${JSON.stringify(options)};
        
        this.rooms = new Map();
        this.furniture = new Map();
        this.lights = new Map();
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.generateBuilding();
        this.generateRooms();
        this.generateFurniture();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        this.scene.fog = new THREE.Fog(0xf0f0f0, 50, 200);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(15, 15, 15);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.8);
        this.renderer.shadowMap.enabled = this.options.enableShadows;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        document.getElementById('3dScene').appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        this.lights.set('ambient', ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        this.lights.set('directional', directionalLight);

        // Point lights for rooms
        this.addRoomLights();
    }

    addRoomLights() {
        const roomPositions = [
            { x: 0, y: 1.4, z: 0 },      // Living room
            { x: 5, y: 1.4, z: 0 },      // Bedroom 1
            { x: 10, y: 1.4, z: 0 },     // Bedroom 2
            { x: 0, y: 1.4, z: -5 },     // Kitchen
            { x: 5, y: 1.4, z: -5 }      // Bathroom
        ];

        roomPositions.forEach((pos, index) => {
            const pointLight = new THREE.PointLight(0xffaa00, 0.6, 100, 2);
            pointLight.position.set(pos.x, pos.y, pos.z);
            pointLight.castShadow = true;
            this.scene.add(pointLight);
            this.lights.set(\`room_\${index}\`, pointLight);
        });
    }

    generateBuilding() {
        // Building foundation
        const foundationGeometry = new THREE.BoxGeometry(20, 0.5, 15);
        const foundationMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
        foundation.position.y = -0.25;
        foundation.receiveShadow = true;
        this.scene.add(foundation);

        // Building outline
        const outlineGeometry = new THREE.BoxGeometry(20, 0.1, 15);
        const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        outline.position.y = 0.05;
        this.scene.add(outline);
    }

    generateRooms() {
        let currentX = -7.5;
        
        Object.entries(this.standards).forEach(([roomType, dimensions]) => {
            if (roomType === 'total') return;
            
            const room = this.createRoom(roomType, dimensions, currentX);
            this.rooms.set(roomType, room);
            this.scene.add(room);
            
            currentX += dimensions.width + 0.2; // 0.2m wall thickness
        });
    }

    createRoom(roomType, dimensions, x) {
        const roomGroup = new THREE.Group();
        
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.length);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: this.getFloorColor(roomType) });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x, 0, 0);
        floor.receiveShadow = true;
        roomGroup.add(floor);

        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.length);
        const ceilingMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(x, dimensions.height, 0);
        roomGroup.add(ceiling);

        // Walls
        this.createWalls(roomGroup, dimensions, x);

        // Room label
        this.addRoomLabel(roomGroup, roomType, dimensions, x);

        return roomGroup;
    }

    createWalls(roomGroup, dimensions, x) {
        const wallThickness = 0.2;
        const wallHeight = dimensions.height;
        
        // Left wall
        const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, dimensions.length);
        const leftWallMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
        const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
        leftWall.position.set(x - dimensions.width/2 - wallThickness/2, wallHeight/2, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        roomGroup.add(leftWall);

        // Right wall
        const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, dimensions.length);
        const rightWallMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
        const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
        rightWall.position.set(x + dimensions.width/2 + wallThickness/2, wallHeight/2, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        roomGroup.add(rightWall);

        // Back wall
        const backWallGeometry = new THREE.BoxGeometry(dimensions.width, wallHeight, wallThickness);
        const backWallMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
        const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
        backWall.position.set(x, wallHeight/2, -dimensions.length/2 - wallThickness/2);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        roomGroup.add(backWall);

        // Front wall (with door opening)
        const frontWallGeometry = new THREE.BoxGeometry(dimensions.width, wallHeight, wallThickness);
        const frontWallMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
        const frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
        frontWall.position.set(x, wallHeight/2, dimensions.length/2 + wallThickness/2);
        frontWall.castShadow = true;
        frontWall.receiveShadow = true;
        roomGroup.add(frontWall);
    }

    addRoomLabel(roomGroup, roomType, dimensions, x) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 256, 64);
        context.fillStyle = '#000000';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(this.getRoomLabel(roomType), 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, dimensions.height + 0.5, 0);
        sprite.scale.set(2, 0.5, 1);
        roomGroup.add(sprite);
    }

    getRoomLabel(roomType) {
        const labels = {
            'livingRoom': 'SALON',
            'bedroom': 'YATAK ODASI',
            'bedroom1': 'ANA YATAK',
            'bedroom2': 'ÇOCUK ODASI',
            'bedroom3': 'MİSAFIR ODASI',
            'bedroom4': 'ÇALIŞMA ODASI',
            'kitchen': 'MUTFAK',
            'bathroom': 'BANYO',
            'hallway': 'KORİDOR'
        };
        return labels[roomType] || roomType;
    }

    getFloorColor(roomType) {
        const colors = {
            'livingRoom': 0x8d6e63,      // Brown
            'bedroom': 0x6d4c41,         // Dark brown
            'bedroom1': 0x6d4c41,        // Dark brown
            'bedroom2': 0x6d4c41,        // Dark brown
            'bedroom3': 0x6d4c41,        // Dark brown
            'bedroom4': 0x6d4c41,        // Dark brown
            'kitchen': 0x5d4037,         // Very dark brown
            'bathroom': 0x4e342e,        // Almost black
            'hallway': 0x8d6e63          // Brown
        };
        return colors[roomType] || 0x8d6e63;
    }

    generateFurniture() {
        if (!this.options.enableFurniture) return;
        
        this.rooms.forEach((room, roomType) => {
            const furniture = this.createFurniture(roomType);
            if (furniture) {
                this.furniture.set(roomType, furniture);
                room.add(furniture);
            }
        });
    }

    createFurniture(roomType) {
        const furnitureGroup = new THREE.Group();
        
        switch(roomType) {
            case 'livingRoom':
                this.addLivingRoomFurniture(furnitureGroup);
                break;
            case 'bedroom':
            case 'bedroom1':
            case 'bedroom2':
            case 'bedroom3':
            case 'bedroom4':
                this.addBedroomFurniture(furnitureGroup);
                break;
            case 'kitchen':
                this.addKitchenFurniture(furnitureGroup);
                break;
            case 'bathroom':
                this.addBathroomFurniture(furnitureGroup);
                break;
        }
        
        return furnitureGroup;
    }

    addLivingRoomFurniture(group) {
        // Sofa
        const sofaGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.0);
        const sofaMaterial = new THREE.MeshLambertMaterial({ color: 0x8bc34a });
        const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
        sofa.position.set(0, 0.4, 0);
        sofa.castShadow = true;
        group.add(sofa);

        // Coffee table
        const tableGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.8);
        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(0, 0.2, -1.5);
        table.castShadow = true;
        group.add(table);

        // TV stand
        const tvStandGeometry = new THREE.BoxGeometry(1.8, 0.6, 0.5);
        const tvStandMaterial = new THREE.MeshLambertMaterial({ color: 0x424242 });
        const tvStand = new THREE.Mesh(tvStandGeometry, tvStandMaterial);
        tvStand.position.set(0, 0.3, 1.5);
        tvStand.castShadow = true;
        group.add(tvStand);
    }

    addBedroomFurniture(group) {
        // Bed
        const bedGeometry = new THREE.BoxGeometry(1.6, 0.5, 2.0);
        const bedMaterial = new THREE.MeshLambertMaterial({ color: 0x3f51b5 });
        const bed = new THREE.Mesh(bedGeometry, bedMaterial);
        bed.position.set(0, 0.25, 0);
        bed.castShadow = true;
        group.add(bed);

        // Bedside table
        const bedsideGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.5);
        const bedsideMaterial = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
        const bedside = new THREE.Mesh(bedsideGeometry, bedsideMaterial);
        bedside.position.set(1.0, 0.3, 0);
        bedside.castShadow = true;
        group.add(bedside);

        // Wardrobe
        const wardrobeGeometry = new THREE.BoxGeometry(2.0, 2.0, 0.6);
        const wardrobeMaterial = new THREE.MeshLambertMaterial({ color: 0x795548 });
        const wardrobe = new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
        wardrobe.position.set(0, 1.0, -1.5);
        wardrobe.castShadow = true;
        group.add(wardrobe);
    }

    addKitchenFurniture(group) {
        // Kitchen counter
        const counterGeometry = new THREE.BoxGeometry(3.0, 0.9, 0.6);
        const counterMaterial = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(0, 0.45, 0);
        counter.castShadow = true;
        group.add(counter);

        // Stove
        const stoveGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.6);
        const stoveMaterial = new THREE.MeshLambertMaterial({ color: 0x424242 });
        const stove = new THREE.Mesh(stoveGeometry, stoveMaterial);
        stove.position.set(-1.0, 0.45, 0);
        stove.castShadow = true;
        group.add(stove);

        // Refrigerator
        const fridgeGeometry = new THREE.BoxGeometry(0.7, 1.8, 0.7);
        const fridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
        fridge.position.set(1.5, 0.9, 0);
        fridge.castShadow = true;
        group.add(fridge);
    }

    addBathroomFurniture(group) {
        // Toilet
        const toiletGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8);
        const toiletMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const toilet = new THREE.Mesh(toiletGeometry, toiletMaterial);
        toilet.position.set(0, 0.2, 0);
        toilet.castShadow = true;
        group.add(toilet);

        // Sink
        const sinkGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 8);
        const sinkMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
        sink.position.set(0, 0.1, -0.8);
        sink.castShadow = true;
        group.add(sink);

        // Shower
        const showerGeometry = new THREE.BoxGeometry(0.8, 2.0, 0.8);
        const showerMaterial = new THREE.MeshLambertMaterial({ color: 0x81c784, transparent: true, opacity: 0.7 });
        const shower = new THREE.Mesh(showerGeometry, showerMaterial);
        shower.position.set(0, 1.0, 0.8);
        shower.castShadow = true;
        group.add(shower);
    }

    setupEventListeners() {
        // Camera controls
        document.getElementById('resetCamera').addEventListener('click', () => {
            this.camera.position.set(15, 15, 15);
            this.camera.lookAt(0, 0, 0);
        });

        document.getElementById('topView').addEventListener('click', () => {
            this.camera.position.set(0, 20, 0);
            this.camera.lookAt(0, 0, 0);
        });

        document.getElementById('sideView').addEventListener('click', () => {
            this.camera.position.set(20, 0, 0);
            this.camera.lookAt(0, 0, 0);
        });

        document.getElementById('perspectiveView').addEventListener('click', () => {
            this.camera.position.set(15, 15, 15);
            this.camera.lookAt(0, 0, 0);
        });

        // Toggle controls
        document.getElementById('toggleWalls').addEventListener('click', (e) => {
            this.toggleRoomVisibility('walls', e.target);
        });

        document.getElementById('toggleFurniture').addEventListener('click', (e) => {
            this.toggleRoomVisibility('furniture', e.target);
        });

        document.getElementById('toggleLighting').addEventListener('click', (e) => {
            this.toggleRoomVisibility('lighting', e.target);
        });

        document.getElementById('toggleShadows').addEventListener('click', (e) => {
            this.toggleRoomVisibility('shadows', e.target);
        });

        // Quality controls
        document.getElementById('lowQuality').addEventListener('click', (e) => {
            this.setRenderQuality('low', e.target);
        });

        document.getElementById('mediumQuality').addEventListener('click', (e) => {
            this.setRenderQuality('medium', e.target);
        });

        document.getElementById('highQuality').addEventListener('click', (e) => {
            this.setRenderQuality('high', e.target);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        // Export functions
        document.getElementById('exportImage').addEventListener('click', () => {
            this.exportImage();
        });

        document.getElementById('export3D').addEventListener('click', () => {
            this.export3D();
        });
    }

    toggleRoomVisibility(type, button) {
        button.classList.toggle('active');
        
        switch(type) {
            case 'walls':
                this.rooms.forEach(room => {
                    room.children.forEach(child => {
                        if (child.geometry.type === 'BoxGeometry') {
                            child.visible = button.classList.contains('active');
                        }
                    });
                });
                break;
            case 'furniture':
                this.furniture.forEach(furniture => {
                    furniture.visible = button.classList.contains('active');
                });
                break;
            case 'lighting':
                this.lights.forEach(light => {
                    light.intensity = button.classList.contains('active') ? light.userData.originalIntensity : 0;
                });
                break;
            case 'shadows':
                this.renderer.shadowMap.enabled = button.classList.contains('active');
                break;
        }
    }

    setRenderQuality(quality, button) {
        // Remove active class from all quality buttons
        document.querySelectorAll('[id$="Quality"]').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        switch(quality) {
            case 'low':
                this.renderer.setPixelRatio(1);
                this.renderer.shadowMap.enabled = false;
                break;
            case 'medium':
                this.renderer.setPixelRatio(1.5);
                this.renderer.shadowMap.enabled = true;
                break;
            case 'high':
                this.renderer.setPixelRatio(2);
                this.renderer.shadowMap.enabled = true;
                break;
        }
    }

    onWindowResize() {
        const container = document.getElementById('3dScene');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    exportImage() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = '3d-plan.png';
        link.href = dataURL;
        link.click();
    }

    export3D() {
        // Export as GLTF
        const exporter = new THREE.GLTFExporter();
        exporter.parse(this.scene, (gltf) => {
            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.download = '3d-plan.gltf';
            link.href = url;
            link.click();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize 3D viewer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThreeDPlanViewer();
});`;
  }

  generate3DCSS(options) {
    return `/* 3D Plan Viewer Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    overflow-x: hidden;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.plan-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.plan-header h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.plan-info {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.info-item {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9rem;
}

.controls-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.control-group label {
    font-weight: 600;
    color: #555;
    font-size: 0.9rem;
}

.control-btn {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
}

.control-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-2px);
}

.control-btn.active {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border-color: #667eea;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.viewer-container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    margin-bottom: 20px;
}

.scene {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.info-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    height: fit-content;
}

.info-panel h3 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 1.1rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 8px;
}

.room-info, .measurements, .features {
    margin-bottom: 25px;
}

.features ul {
    list-style: none;
    padding-left: 0;
}

.features li {
    background: #f8f9fa;
    margin: 8px 0;
    padding: 10px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    font-size: 0.9rem;
}

.action-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

.action-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.action-btn:active {
    transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1200px) {
    .viewer-container {
        grid-template-columns: 1fr;
    }
    
    .info-panel {
        order: -1;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .plan-header h1 {
        font-size: 2rem;
    }
    
    .controls-panel {
        grid-template-columns: 1fr;
    }
    
    .plan-info {
        flex-direction: column;
        align-items: center;
    }
    
    .action-panel {
        flex-direction: column;
        align-items: center;
    }
    
    .action-btn {
        width: 100%;
        max-width: 300px;
    }
}

/* Loading Animation */
.scene::before {
    content: '3D Plan Yükleniyor...';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #667eea;
    font-size: 1.2rem;
    font-weight: 600;
    z-index: 1;
}

.scene.loaded::before {
    display: none;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #5a6fd8, #6a4190);
}`;
  }

  generateAll3DPlans() {
    const plansDir = path.join(__dirname, '..', 'plans', '3d');
    
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    planData.floorPlans.forEach(plan => {
      const plan3D = this.generate3DPlan(plan.id, {
        enableShadows: true,
        enableTextures: true,
        enableFurniture: true,
        renderQuality: 'high'
      });
      
      if (plan3D) {
        // HTML dosyası
        const htmlPath = path.join(plansDir, `${plan.id}_3d.html`);
        fs.writeFileSync(htmlPath, plan3D.html);
        
        // JavaScript dosyası
        const jsPath = path.join(plansDir, `${plan.id}_3d.js`);
        fs.writeFileSync(jsPath, plan3D.js);
        
        // CSS dosyası
        const cssPath = path.join(plansDir, `${plan.id}_3d.css`);
        fs.writeFileSync(cssPath, plan3D.css);
        
        console.log(`Generated 3D plan: ${plan.id}_3d.*`);
      }
    });
  }
}

module.exports = ThreeDPlanGenerator;
// 3D Mimari Plan Görüntüleyici
class ThreeDPlanViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planData = {"id":"plan_8","apartmentType":"4+1","streetFacingSides":2,"minUsableArea":800,"maxUsableArea":1600,"averageApartmentArea":140,"estimatedApartments":"6-11","name":"Lüks Köşe Blok - 4+1","description":"Büyük aileler için lüks apartman","image":"plans/plan_8_4plus1_2side.svg","features":["4 yatak odası","Geniş salon","Ana banyo + lavabo","Büyük balkonlar"]};
        this.standards = {"livingRoom":{"width":6,"length":6.5,"height":2.8},"bedroom1":{"width":5,"length":5.5,"height":2.8},"bedroom2":{"width":4.5,"length":5,"height":2.8},"bedroom3":{"width":4,"length":4.5,"height":2.8},"bedroom4":{"width":3.5,"length":4,"height":2.8},"kitchen":{"width":4,"length":4.5,"height":2.8},"bathroom":{"width":3.5,"length":4,"height":2.8},"hallway":{"width":2,"length":4.5,"height":2.8}};
        this.options = {"enableShadows":true,"enableTextures":true,"enableFurniture":true,"renderQuality":"high"};
        
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
            this.lights.set(`room_${index}`, pointLight);
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
});
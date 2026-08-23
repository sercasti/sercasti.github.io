import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* -------------------------------------------------------------------- */
/* Feature detection: fall back gracefully if WebGL isn't available.    */
/* -------------------------------------------------------------------- */

function hasWebGL() {
	try {
		const canvas = document.createElement('canvas');
		return !!(window.WebGLRenderingContext &&
			(canvas.getContext('webgl2') || canvas.getContext('webgl')));
	} catch (e) {
		return false;
	}
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.innerWidth < 760;
const lowPower = isSmallScreen || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

/* -------------------------------------------------------------------- */
/* Shader chunks                                                        */
/* -------------------------------------------------------------------- */

const NOISE_GLSL = `
	vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
	vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
	vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
	vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

	float snoise(vec3 v) {
		const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
		const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

		vec3 i  = floor(v + dot(v, C.yyy));
		vec3 x0 = v - i + dot(i, C.xxx);

		vec3 g = step(x0.yzx, x0.xyz);
		vec3 l = 1.0 - g;
		vec3 i1 = min(g.xyz, l.zxy);
		vec3 i2 = max(g.xyz, l.zxy);

		vec3 x1 = x0 - i1 + C.xxx;
		vec3 x2 = x0 - i2 + C.yyy;
		vec3 x3 = x0 - D.yyy;

		i = mod289(i);
		vec4 p = permute(permute(permute(
				i.z + vec4(0.0, i1.z, i2.z, 1.0))
				+ i.y + vec4(0.0, i1.y, i2.y, 1.0))
				+ i.x + vec4(0.0, i1.x, i2.x, 1.0));

		float n_ = 0.142857142857;
		vec3 ns = n_ * D.wyz - D.xzx;

		vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

		vec4 x_ = floor(j * ns.z);
		vec4 y_ = floor(j - 7.0 * x_);

		vec4 x = x_ * ns.x + ns.yyyy;
		vec4 y = y_ * ns.x + ns.yyyy;
		vec4 h = 1.0 - abs(x) - abs(y);

		vec4 b0 = vec4(x.xy, y.xy);
		vec4 b1 = vec4(x.zw, y.zw);

		vec4 s0 = floor(b0) * 2.0 + 1.0;
		vec4 s1 = floor(b1) * 2.0 + 1.0;
		vec4 sh = -step(h, vec4(0.0));

		vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
		vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

		vec3 p0 = vec3(a0.xy, h.x);
		vec3 p1 = vec3(a0.zw, h.y);
		vec3 p2 = vec3(a1.xy, h.z);
		vec3 p3 = vec3(a1.zw, h.w);

		vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
		p0 *= norm.x;
		p1 *= norm.y;
		p2 *= norm.z;
		p3 *= norm.w;

		vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
		m = m * m;
		return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
	}

	float fbm(vec3 p) {
		float value = 0.0;
		float amp = 0.5;
		for (int i = 0; i < 4; i++) {
			value += amp * snoise(p);
			p *= 2.0;
			amp *= 0.5;
		}
		return value;
	}
`;

const CORE_VERTEX = `
	uniform float uTime;
	uniform float uAmp;
	uniform float uPulse;
	varying vec3 vNormal;
	varying vec3 vViewPosition;
	varying float vNoise;

	${NOISE_GLSL}

	void main() {
		float n = fbm(position * 1.5 + uTime * 0.15);
		vNoise = n;
		vec3 displaced = position + normal * n * (uAmp + uPulse);
		vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
		vViewPosition = -mvPosition.xyz;
		vNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const CORE_FRAGMENT = `
	uniform vec3 uColorA;
	uniform vec3 uColorB;
	uniform vec3 uColorC;
	varying vec3 vNormal;
	varying vec3 vViewPosition;
	varying float vNoise;

	void main() {
		vec3 viewDir = normalize(vViewPosition);
		float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.6);
		vec3 base = mix(uColorA, uColorB, smoothstep(-0.6, 0.6, vNoise));
		vec3 glow = uColorC * fresnel * 0.9;
		vec3 color = base * (0.22 + 0.28 * (vNoise * 0.5 + 0.5)) + glow;
		gl_FragColor = vec4(color, 1.0);
	}
`;

const GALAXY_VERTEX = `
	attribute float aRadius;
	attribute float aAngle;
	attribute float aSpeed;
	attribute float aHeight;
	attribute float aSize;
	attribute float aPhase;
	uniform float uTime;
	uniform float uPixelRatio;
	varying float vDist;
	varying float vPhase;

	void main() {
		float angle = aAngle + uTime * aSpeed;
		float wob = sin(uTime * 0.6 + aPhase) * 0.15;
		vec3 pos = vec3(cos(angle) * aRadius, aHeight + wob, sin(angle) * aRadius);
		vDist = aRadius;
		vPhase = aPhase;
		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		float dist = max(-mvPosition.z, 0.6);
		gl_PointSize = min(aSize * uPixelRatio * (140.0 / dist), 22.0);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const GALAXY_FRAGMENT = `
	uniform float uTime;
	uniform vec3 uColorInner;
	uniform vec3 uColorOuter;
	varying float vDist;
	varying float vPhase;

	void main() {
		vec2 uv = gl_PointCoord - 0.5;
		float d = length(uv);
		if (d > 0.5) discard;
		float alpha = smoothstep(0.5, 0.0, d);
		float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + vPhase * 6.2831);
		vec3 color = mix(uColorInner, uColorOuter, clamp(vDist / 4.2, 0.0, 1.0));
		gl_FragColor = vec4(color, alpha * twinkle * 0.55);
	}
`;

const RING_VERTEX = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const RING_FRAGMENT = `
	uniform float uProgress;
	uniform vec3 uColor;
	varying vec2 vUv;

	void main() {
		vec2 uv = vUv - 0.5;
		float d = length(uv) * 2.0;
		float ring = smoothstep(0.14, 0.0, abs(d - uProgress));
		float alpha = ring * (1.0 - uProgress);
		gl_FragColor = vec4(uColor, alpha);
	}
`;

const VIGNETTE_GRAIN_SHADER = {
	uniforms: {
		tDiffuse: { value: null },
		uTime: { value: 0 },
		uIntensity: { value: 0.28 }
	},
	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: `
		uniform sampler2D tDiffuse;
		uniform float uTime;
		uniform float uIntensity;
		varying vec2 vUv;

		float rand(vec2 co) {
			return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
		}

		void main() {
			vec4 color = texture2D(tDiffuse, vUv);
			vec2 uv = vUv - 0.5;
			float vig = smoothstep(0.9, 0.25, dot(uv, uv));
			color.rgb *= mix(1.0, vig, uIntensity);
			float grain = (rand(vUv * fract(uTime)) - 0.5) * 0.02;
			color.rgb += grain;
			gl_FragColor = color;
		}
	`
};

/* -------------------------------------------------------------------- */
/* Main init                                                            */
/* -------------------------------------------------------------------- */

function init() {
	const canvas = document.getElementById('bg-canvas');
	const clock = new THREE.Clock();

	const scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x05050a, 0.045);

	const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 0.4, 6.5);

	let renderer;
	try {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: false, powerPreference: 'high-performance' });
	} catch (e) {
		document.body.classList.add('no-webgl');
		document.body.classList.remove('is-loading');
		return;
	}
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x05050a, 1);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.0;

	/* ---------------- Energy core ---------------- */

	const coreGeometry = new THREE.IcosahedronGeometry(1.35, lowPower ? 3 : 5);
	const coreUniforms = {
		uTime: { value: 0 },
		uAmp: { value: 0.16 },
		uPulse: { value: 0 },
		uColorA: { value: new THREE.Color(0xff2d55) },
		uColorB: { value: new THREE.Color(0x7c3aed) },
		uColorC: { value: new THREE.Color(0xffffff) }
	};
	const coreMaterial = new THREE.ShaderMaterial({
		vertexShader: CORE_VERTEX,
		fragmentShader: CORE_FRAGMENT,
		uniforms: coreUniforms
	});
	const core = new THREE.Mesh(coreGeometry, coreMaterial);
	scene.add(core);

	const shellGeometry = new THREE.IcosahedronGeometry(2.05, 1);
	const shellWire = new THREE.LineSegments(
		new THREE.WireframeGeometry(shellGeometry),
		new THREE.LineBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.16 })
	);
	scene.add(shellWire);

	const shell2Geometry = new THREE.IcosahedronGeometry(2.55, 1);
	const shell2Wire = new THREE.LineSegments(
		new THREE.WireframeGeometry(shell2Geometry),
		new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.1 })
	);
	scene.add(shell2Wire);

	/* ---------------- Swirling particle galaxy ---------------- */

	const galaxyCount = lowPower ? 2200 : 5200;
	const galaxyGeometry = new THREE.BufferGeometry();
	const gPositions = new Float32Array(galaxyCount * 3);
	const gRadius = new Float32Array(galaxyCount);
	const gAngle = new Float32Array(galaxyCount);
	const gSpeed = new Float32Array(galaxyCount);
	const gHeight = new Float32Array(galaxyCount);
	const gSize = new Float32Array(galaxyCount);
	const gPhase = new Float32Array(galaxyCount);

	for (let i = 0; i < galaxyCount; i++) {
		const radius = 1.8 + Math.pow(Math.random(), 1.5) * 3.4;
		gRadius[i] = radius;
		gAngle[i] = Math.random() * Math.PI * 2;
		gSpeed[i] = (0.06 + Math.random() * 0.1) * (Math.random() < 0.5 ? 1 : -1) / (radius * 0.35);
		gHeight[i] = (Math.random() - 0.5) * (1.2 + radius * 0.12);
		gSize[i] = 1.0 + Math.random() * 2.2;
		gPhase[i] = Math.random();
	}

	galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(gPositions, 3));
	galaxyGeometry.setAttribute('aRadius', new THREE.BufferAttribute(gRadius, 1));
	galaxyGeometry.setAttribute('aAngle', new THREE.BufferAttribute(gAngle, 1));
	galaxyGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(gSpeed, 1));
	galaxyGeometry.setAttribute('aHeight', new THREE.BufferAttribute(gHeight, 1));
	galaxyGeometry.setAttribute('aSize', new THREE.BufferAttribute(gSize, 1));
	galaxyGeometry.setAttribute('aPhase', new THREE.BufferAttribute(gPhase, 1));

	const galaxyUniforms = {
		uTime: { value: 0 },
		uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
		uColorInner: { value: new THREE.Color(0xffe8d6) },
		uColorOuter: { value: new THREE.Color(0x7c3aed) }
	};
	const galaxyMaterial = new THREE.ShaderMaterial({
		vertexShader: GALAXY_VERTEX,
		fragmentShader: GALAXY_FRAGMENT,
		uniforms: galaxyUniforms,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});
	const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
	galaxy.frustumCulled = false;
	scene.add(galaxy);

	/* ---------------- Distant starfield ---------------- */

	const starCount = lowPower ? 900 : 2200;
	const starGeometry = new THREE.BufferGeometry();
	const sPositions = new Float32Array(starCount * 3);
	for (let i = 0; i < starCount; i++) {
		const r = 20 + Math.random() * 30;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		sPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
		sPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
		sPositions[i * 3 + 2] = r * Math.cos(phi);
	}
	starGeometry.setAttribute('position', new THREE.BufferAttribute(sPositions, 3));
	const starMaterial = new THREE.PointsMaterial({
		size: 0.045,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		opacity: 0.55,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	});
	const starfield = new THREE.Points(starGeometry, starMaterial);
	scene.add(starfield);

	/* ---------------- Postprocessing ---------------- */

	const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
		samples: lowPower ? 0 : 4
	});
	const composer = new EffectComposer(renderer, renderTarget);
	composer.addPass(new RenderPass(scene, camera));

	const bloomPass = new UnrealBloomPass(
		new THREE.Vector2(window.innerWidth, window.innerHeight),
		lowPower ? 0.45 : 0.65,
		0.45,
		0.5
	);
	composer.addPass(bloomPass);

	const grainPass = new ShaderPass(VIGNETTE_GRAIN_SHADER);
	composer.addPass(grainPass);

	composer.addPass(new OutputPass());

	/* ---------------- Pointer interaction ---------------- */

	const pointer = { x: 0, y: 0 };
	const pointerTarget = { x: 0, y: 0 };

	window.addEventListener('pointermove', (e) => {
		pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
		pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
	});

	/* ---------------- Click shockwaves ---------------- */

	const raycaster = new THREE.Raycaster();
	const clickPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	const shockwaves = [];

	function spawnShockwave(point) {
		const uniforms = {
			uProgress: { value: 0 },
			uColor: { value: new THREE.Color(Math.random() < 0.5 ? 0xff2d55 : 0x7c3aed) }
		};
		const mat = new THREE.ShaderMaterial({
			vertexShader: RING_VERTEX,
			fragmentShader: RING_FRAGMENT,
			uniforms,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide
		});
		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), mat);
		mesh.position.copy(point);
		mesh.quaternion.copy(camera.quaternion);
		scene.add(mesh);
		shockwaves.push({ mesh, mat, start: clock.getElapsedTime() });
		coreUniforms.uPulse.value = Math.min(coreUniforms.uPulse.value + 0.35, 0.7);
	}

	window.addEventListener('pointerdown', (e) => {
		if (e.target.closest && e.target.closest('.glass-card')) return;
		const ndc = new THREE.Vector2(
			(e.clientX / window.innerWidth) * 2 - 1,
			-(e.clientY / window.innerHeight) * 2 + 1
		);
		raycaster.setFromCamera(ndc, camera);
		const point = new THREE.Vector3();
		if (raycaster.ray.intersectPlane(clickPlane, point)) {
			spawnShockwave(point);
		}
	});

	/* ---------------- Resize ---------------- */

	function onResize() {
		const w = window.innerWidth;
		const h = window.innerHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		composer.setSize(w, h);
		bloomPass.setSize(w, h);
		galaxyUniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
	}
	window.addEventListener('resize', onResize);

	/* ---------------- Visibility pause ---------------- */

	let isVisible = true;
	document.addEventListener('visibilitychange', () => {
		isVisible = !document.hidden;
	});

	/* ---------------- Animate ---------------- */

	function animate() {
		requestAnimationFrame(animate);
		if (!isVisible) return;

		const t = clock.getElapsedTime();

		coreUniforms.uTime.value = t;
		coreUniforms.uPulse.value *= 0.92;
		galaxyUniforms.uTime.value = t;
		grainPass.uniforms.uTime.value = t;

		core.rotation.y = t * 0.08;
		core.rotation.x = Math.sin(t * 0.15) * 0.1;
		shellWire.rotation.y = -t * 0.05;
		shellWire.rotation.x = t * 0.03;
		shell2Wire.rotation.y = t * 0.035;
		starfield.rotation.y = t * 0.005;

		const easing = reduceMotion ? 0.02 : 0.045;
		pointer.x += (pointerTarget.x - pointer.x) * easing;
		pointer.y += (pointerTarget.y - pointer.y) * easing;

		const orbitSpeed = reduceMotion ? 0 : 0.05;
		const orbitAngle = t * orbitSpeed;
		const baseX = Math.sin(orbitAngle) * 0.6;
		const baseZ = 6.5 + Math.cos(orbitAngle) * 0.3;

		camera.position.x = baseX + pointer.x * 0.9;
		camera.position.y = 0.4 - pointer.y * 0.6;
		camera.position.z = baseZ;
		camera.lookAt(0, 0, 0);

		for (let i = shockwaves.length - 1; i >= 0; i--) {
			const sw = shockwaves[i];
			const progress = (t - sw.start) / 1.1;
			if (progress >= 1) {
				scene.remove(sw.mesh);
				sw.mat.dispose();
				sw.mesh.geometry.dispose();
				shockwaves.splice(i, 1);
				continue;
			}
			sw.mat.uniforms.uProgress.value = progress;
			sw.mesh.quaternion.copy(camera.quaternion);
		}

		composer.render();
	}

	animate();

	requestAnimationFrame(() => {
		document.body.classList.remove('is-loading');
	});
}

/* -------------------------------------------------------------------- */
/* Boot                                                                  */
/* -------------------------------------------------------------------- */

if (!hasWebGL()) {
	document.body.classList.add('no-webgl');
	document.body.classList.remove('is-loading');
} else {
	init();
}

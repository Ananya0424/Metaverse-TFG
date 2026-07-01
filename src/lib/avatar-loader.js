import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const AVATAR_MODEL_PATH = '/models/male.glb';
// ── OVR/ReadyPlayerMe viseme morph target names ────────────────────────────
const OVR_VISEMES = [
  'viseme_sil',
  'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD',
  'viseme_kk', 'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR',
  'viseme_aa', 'viseme_E', 'viseme_ih', 'viseme_oh', 'viseme_ou',
];

// Jaw/mouth-open fallback names (used when model has no viseme_ targets)
const JAW_MORPH_NAMES = [
  'jawOpen', 'Jaw_Open', 'mouthOpen', 'mouth_open', 'mouth open',
  'viseme_aa', 'viseme_AA', 'viseme_O',
];

const BLINK_MORPH_NAMES = [
  'eyeBlinkLeft', 'eyeBlinkRight',
  'blink', 'Blink', 'Eye_Blink_L', 'Eye_Blink_R',
];

const FADE_DURATION = 0.4;


export class AvatarLoader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.avatar = null;

    this._mixer = null;
    this._actions = {};
    this._activeAction = null;
    this._onReadyCallbacks = [];   // fired once after avatar + mixer are ready

    this._headBone = null;
    this._headLockQuat = new THREE.Quaternion(); // head rotation locked during talking

    this._animFrameId = null;
    this._lastTime = performance.now();
    this._elapsed = 0;
    this._blinkTimer = Math.random() * 3 + 2;

    this._isSpeaking = false;
    this._sineT = 0;
    this._sineInterval = null;

    // Viseme morph targets
    // Map<viseme_name, Array<{mesh, index}>>
    this._visemeTargets = new Map();
    // Fallback jaw for models without OVR visemes
    this._jawTargets = [];
    this._blinkMeshes = [];
    this._useVisemes = false;

    // Smooth weight state
    this._targetWeights = {};   // where we want to go
    this._currentWeights = {};   // what's currently applied (lerped)
  }

  init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 1.5, 2.5);
    this.camera.lookAt(0, 1.0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 2.5);
    this.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 4, 3);
    this.scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xd0e4ff, 0.6);
    fillLight.position.set(-2, 2, -1);
    this.scene.add(fillLight);

    this._loadAvatar();
    window.addEventListener('resize', () => this._onResize());
    this._animate();
  }

  // Register a callback to run once the avatar and mixer are ready.
  // If already ready, runs immediately.
  onReady(fn) {
    if (this._mixer && this.avatar) fn();
    else this._onReadyCallbacks.push(fn);
  }

  // ── Animation control ───────────────────────────────────────────────────────

  _playAnimation(name, fadeIn = FADE_DURATION) {
    const next = this._actions[name] || this._actions[name.toLowerCase()];
    if (!next || next === this._activeAction) return;
    if (this._activeAction) this._activeAction.fadeOut(fadeIn);
    next.reset().fadeIn(fadeIn).play();
    this._activeAction = next;
    console.log(`▶ Animation → "${name}"`);
  }


  // ── Lip sync public API ─────────────────────────────────────────────────────

  startLipSync(_audioElement) {
    this._playAnimation('Talking1');
    if (this._headBone) this._headLockQuat.copy(this._headBone.quaternion);
    this._isSpeaking = true;
    this._sineT = 0;

    clearInterval(this._sineInterval);
    this._sineInterval = setInterval(() => {
      if (!this._isSpeaking) return;
      this._sineT += 0.25;                          // slower = natural speech rhythm
      const v = Math.abs(Math.sin(this._sineT));    // smooth 0 → 1 → 0 cycle

      // Write directly to mesh — bypass lerp to avoid jitter
      if (this._useVisemes) {
        for (const [name, targets] of this._visemeTargets) {
          const w = name === 'viseme_aa' ? v
            : name === 'viseme_oh' ? v * 0.35
              : 0;
          for (const { mesh, index } of targets) {
            mesh.morphTargetInfluences[index] = w;
          }
        }
      } else {
        for (const { mesh, index } of this._jawTargets) {
          mesh.morphTargetInfluences[index] = v;
        }
      }
    }, 80);
  }

  stopLipSync() {
    this._isSpeaking = false;
    clearInterval(this._sineInterval);
    this._sineInterval = null;
    this._analyser = null;

    for (const name in this._targetWeights) this._targetWeights[name] = 0;
    for (const { mesh, index } of this._jawTargets) mesh.morphTargetInfluences[index] = 0;
    this._playAnimation('idle');
  }

  // ── Morph target scanning ───────────────────────────────────────────────────

  _scanMorphTargets() {
    if (!this.avatar) return;

    this._visemeTargets = new Map();
    this._jawTargets = [];
    this._blinkMeshes = [];

    this.avatar.traverse((node) => {
      if (!node.isMesh || !node.morphTargetDictionary) return;
      // Teeth mesh should stay fixed — don't apply any viseme weights to it
      if (node.name.toLowerCase().includes('teeth') || node.name.toLowerCase().includes('tooth')) return;
      const dict = node.morphTargetDictionary;

      // Collect ALL OVR viseme targets
      for (const name of OVR_VISEMES) {
        if (dict[name] !== undefined) {
          if (!this._visemeTargets.has(name)) {
            this._visemeTargets.set(name, []);
          }
          this._visemeTargets.get(name).push({ mesh: node, index: dict[name] });
        }
      }

      // Jaw fallback (one per mesh)
      for (const name of JAW_MORPH_NAMES) {
        if (dict[name] !== undefined) {
          this._jawTargets.push({ mesh: node, index: dict[name] });
          break;
        }
      }

      // Blink
      for (const name of BLINK_MORPH_NAMES) {
        if (dict[name] !== undefined) {
          this._blinkMeshes.push({ mesh: node, index: dict[name] });
        }
      }
    });

    this._useVisemes = this._visemeTargets.size > 0;

    // Init weight state for all found visemes
    this._targetWeights = {};
    this._currentWeights = {};
    for (const name of this._visemeTargets.keys()) {
      this._targetWeights[name] = 0;
      this._currentWeights[name] = 0;
    }

    console.log(
      `Morph targets — OVR visemes: ${this._visemeTargets.size}` +
      ` [${[...this._visemeTargets.keys()].join(', ')}]` +
      `, jaw fallback: ${this._jawTargets.length}` +
      `, blink: ${this._blinkMeshes.length}`
    );
    console.log(`Lip sync mode: ${this._useVisemes ? 'OVR visemes' : 'jaw fallback'}`);
  }

  // ── Animation loop ──────────────────────────────────────────────────────────

  _animate() {
    this._animFrameId = requestAnimationFrame(() => this._animate());
    if (!this.renderer) return;

    const now = performance.now();
    const delta = (now - this._lastTime) / 1000;
    this._lastTime = now;
    this._elapsed += delta;

    if (this._mixer) this._mixer.update(delta);

    // Lock head still during talking — restore snapshot taken at speak start
    if (this._isSpeaking && this._headBone) {
      this._headBone.quaternion.copy(this._headLockQuat);
    }

    if (this.avatar) {
      // Sine wave sets morphs directly in the interval — nothing to do per-frame
      // Just smooth the jaw close when not speaking
      if (!this._isSpeaking && !this._useVisemes) {
        for (const { mesh, index } of this._jawTargets) {
          mesh.morphTargetInfluences[index] *= 0.82;
        }
      }

      // Auto blink
      this._blinkTimer -= delta;
      if (this._blinkTimer <= 0) {
        this._triggerBlink();
        this._blinkTimer = Math.random() * 3 + 2;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  _triggerBlink() {
    let t = 0;
    const tick = () => {
      t += 1;
      const v = t < Math.PI ? Math.sin(t) : 0;
      for (const { mesh, index } of this._blinkMeshes) {
        mesh.morphTargetInfluences[index] = v;
      }
      if (t < Math.PI) requestAnimationFrame(tick);
      else for (const { mesh, index } of this._blinkMeshes) {
        mesh.morphTargetInfluences[index] = 0;
      }
    };
    tick();
  }

  // ── Avatar loading ──────────────────────────────────────────────────────────

  _loadAvatar() {
    const loader = new GLTFLoader();
    loader.load(
      AVATAR_MODEL_PATH,
      (gltf) => {
        this.avatar = gltf.scene;
        this.scene.add(this.avatar);

        this._mixer = new THREE.AnimationMixer(gltf.scene);

        const clips = gltf.animations || [];
        console.log(`gltf.animations count: ${clips.length}`);

        clips.forEach((clip) => {
          console.log(`  Clip: "${clip.name}" — ${clip.duration.toFixed(2)}s, ${clip.tracks.length} tracks`);
          const action = this._mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.enabled = true;
          action.timeScale = 1;
          action.weight = 1;
          this._actions[clip.name] = action;
          this._actions[clip.name.toLowerCase()] = action;

        });

        if (clips.length === 0) {
          console.warn('No clips on gltf.animations — scanning children...');
          gltf.scene.traverse((child) => {
            if (child.animations && child.animations.length > 0) {
              const childMixer = new THREE.AnimationMixer(child);
              child.animations.forEach((clip) => {
                const action = childMixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.enabled = true;
                action.timeScale = 1;
                this._actions[clip.name] = action;
                this._actions[clip.name.toLowerCase()] = action;
              });
              this._mixer = childMixer;
            }
          });
        }

        const idleAction = this._actions['idle'] || this._actions['Idle'];
        if (idleAction) {
          idleAction.reset().play();
          this._activeAction = idleAction;
          console.log('▶ Playing: idle');
        } else {
          const first = Object.values(this._actions)[1];
          if (first) { first.reset().play(); this._activeAction = first; }
        }

        this._scanMorphTargets();

        // Dim background room meshes (non-skinned static meshes in the GLB set)
        gltf.scene.traverse((node) => {
          if (node.isMesh && !node.isSkinnedMesh) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((mat) => {
              if (!mat) return;
              mat.transparent = true;
              mat.opacity = 0;
            });
          }
        });

        // Find head bone for tilt correction
        this.avatar.traverse((node) => {
          if (node.isBone && node.name.toLowerCase() === 'head') {
            this._headBone = node;
            console.log(`Head bone found: "${node.name}"`);
          }
        });

        // Fire any callbacks registered via onReady()
        this._onReadyCallbacks.forEach(fn => fn());
        this._onReadyCallbacks = [];
      },
      undefined,
      (error) => {
        console.warn('Avatar GLB not found:', error.message);
        this._showPlaceholder();
      }
    );
  }

  // ── External animation loader ───────────────────────────────────────────────
  // Load an animation-only GLB (e.g. ReadyPlayerMe animation library files)
  // and register each clip under a given name (or the clip's own name).
  //
  // Usage:
  //   avatar.loadExternalAnimation('/models/animations/F_Talking_Variations_001.glb', 'Talking1')
  //   avatar.loadExternalAnimation('/models/animations/M_Standing_Idle_001.glb', 'idle')
  //
  loadExternalAnimation(url, registerAs = null, onLoaded = null) {
    console.log(`[extAnim] Starting load: ${url}`);
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        console.log(`[extAnim] Loaded OK — clips: ${gltf.animations?.length ?? 0}`);
        const clips = gltf.animations || [];
        if (clips.length === 0) {
          console.warn(`[extAnim] No clips found in ${url}`);
          return;
        }

        clips.forEach((clip, i) => {
          const name = registerAs
            ? (clips.length === 1 ? registerAs : `${registerAs}_${i}`)
            : clip.name;

          try {
            const action = this._mixer.clipAction(clip, this.avatar);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.clampWhenFinished = false;
            action.enabled = true;
            action.timeScale = 1;
            action.weight = 1;

            this._actions[name] = action;
            this._actions[name.toLowerCase()] = action;

            console.log(`✔ External animation "${clip.name}" registered as "${name}" (${clip.duration.toFixed(2)}s)`);
          } catch (e) {
            console.error(`[extAnim] clipAction failed for "${clip.name}":`, e);
          }
        });
        if (onLoaded) onLoaded();
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          console.log(`[extAnim] ${Math.round(xhr.loaded / xhr.total * 100)}% loaded`);
        }
      },
      (err) => console.error(`[extAnim] Load FAILED (${url}):`, err)
    );
  }

  switchAvatar(path, onReady = null) {
    // Stop speaking and clear current avatar from scene
    this.stopLipSync();
    clearInterval(this._sineInterval);
    if (this._mixer) { this._mixer.stopAllAction(); this._mixer = null; }
    if (this.avatar) { this.scene.remove(this.avatar); this.avatar = null; }
    this._actions       = {};
    this._activeAction  = null;
    this._headBone      = null;
    this._visemeTargets = new Map();
    this._jawTargets    = [];
    this._blinkMeshes   = [];
    this._onReadyCallbacks = onReady ? [onReady] : [];

    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        this.avatar = gltf.scene;
        this.scene.add(this.avatar);
        this._mixer = new THREE.AnimationMixer(gltf.scene);

        (gltf.animations || []).forEach((clip) => {
          const action = this._mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.enabled = true;
          action.timeScale = 1;
          action.weight = 1;
          this._actions[clip.name] = action;
          this._actions[clip.name.toLowerCase()] = action;
        });

        // Dim background room meshes
        gltf.scene.traverse((node) => {
          if (node.isMesh && !node.isSkinnedMesh) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((mat) => { if (mat) { mat.transparent = true; mat.opacity = 0.08; } });
          }
        });

        this._scanMorphTargets();
        this.avatar.traverse((node) => {
          if (node.isBone && node.name.toLowerCase() === 'head') this._headBone = node;
        });

        const idle = this._actions['idle'] || this._actions['F_Standing_Idle_001'] || Object.values(this._actions)[0];
        if (idle) { idle.reset().play(); this._activeAction = idle; }

        this._onReadyCallbacks.forEach(fn => fn());
        this._onReadyCallbacks = [];
        console.log(`Switched avatar → ${path}`);
      },
      undefined,
      (err) => console.error(`switchAvatar failed (${path}):`, err)
    );
  }

  _showPlaceholder() {
    if (this.renderer) this.renderer.domElement.remove();
    const el = document.createElement('div');
    el.className = 'avatar-placeholder';
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
      <span>Add male-avatar.glb<br/>to frontend/models/</span>`;
    this.container.appendChild(el);
  }

  _onResize() {
    if (!this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  destroy() {
    if (this._animFrameId) cancelAnimationFrame(this._animFrameId);
    if (this._mixer) this._mixer.stopAllAction();
    if (this._audioCtx) this._audioCtx.close();
    if (this.renderer) this.renderer.dispose();
  }
}

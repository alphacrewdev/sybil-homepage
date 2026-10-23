// Runtime for "Behind the image": renderer, scroll timeline, camera path,
// copy beats and HTML labels. Loaded only when WebGL is available and the
// visitor hasn't asked for reduced motion (see BehindImage.astro).

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { buildLab } from "./scene";
import { SHOTS, TIMELINE, type Shot } from "./config";

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const range = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function pose(s: Shot) {
  const pos = new THREE.Vector3(...s.pos);
  const m = new THREE.Matrix4().lookAt(pos, new THREE.Vector3(...s.target), new THREE.Vector3(...s.up));
  return { pos, quat: new THREE.Quaternion().setFromRotationMatrix(m), fov: s.fov, target: new THREE.Vector3(...s.target) };
}

export function start(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas.bi-canvas")!;
  const beats = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
  const labels = Array.from(root.querySelectorAll<HTMLElement>("[data-label]"));
  const imageTags = root.querySelector<HTMLElement>("[data-anchor='imageTag']");
  const fovTag = root.querySelector<HTMLElement>("[data-anchor='fovTag']");
  const note = root.querySelector<HTMLElement>(".bi-note");

  // Debug/poster hooks: ?bi=0.5 pins the timeline; &poster centres the
  // subject for the static fallback stills (scripts in docs/).
  const params = new URLSearchParams(location.search);
  const pinParam = params.get("bi");
  const pinned = pinParam === null ? null : clamp01(parseFloat(pinParam));
  const posterMode = params.has("poster");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const lab = buildLab(renderer);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(lab.scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.5, 0.88);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const A = pose(SHOTS.A);
  const A2 = pose(SHOTS.A2);
  const B = pose(SHOTS.B);
  // The tilt passes through a high three-quarter point so the image stays in
  // frame while the stack beneath it comes into view.
  const mid = new THREE.Vector3(5.2, 12.5, SHOTS.B.target[2] + 4.2);
  const path = new THREE.CatmullRomCurve3([A2.pos, mid, B.pos], false, "centripetal");

  let width = 0;
  let height = 0;
  let desktop = true;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    desktop = width >= 900;
    const dpr = Math.min(window.devicePixelRatio || 1, desktop ? 1.75 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    composer.setPixelRatio(dpr);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const tmpQ = new THREE.Quaternion();
  const tmpV = new THREE.Vector3();

  function placeCamera(p: number) {
    const push = easeInOut(range(p, TIMELINE.pushIn));
    const reveal = easeInOut(range(p, TIMELINE.reveal));
    if (reveal <= 0) {
      camera.position.lerpVectors(A.pos, A2.pos, push);
      camera.quaternion.slerpQuaternions(A.quat, A2.quat, push);
      camera.fov = A.fov;
    } else {
      path.getPoint(reveal, tmpV);
      camera.position.copy(tmpV);
      // Orientation: look at a target that glides from the image to the stack.
      const target = new THREE.Vector3().lerpVectors(A2.target, B.target, smooth(reveal));
      const up = new THREE.Vector3(0, 0, -1).lerp(new THREE.Vector3(0, 1, 0), smooth(clamp01(reveal * 1.4))).normalize();
      const m = new THREE.Matrix4().lookAt(camera.position, target, up);
      tmpQ.setFromRotationMatrix(m);
      camera.quaternion.copy(tmpQ);
      camera.fov = A2.fov + (B.fov - A2.fov) * reveal;
    }
    // Frame the subject right of the copy on wide screens, above it on narrow.
    const settle = 1 - reveal * 0.55;
    if (posterMode) {
      // Stills for the static fallback: subject centred, no copy column.
      camera.zoom = desktop ? 1 : Math.min(1, (width / height) / (reveal > 0.5 ? 1.1 : 0.75));
      camera.clearViewOffset();
    } else if (desktop) {
      camera.zoom = 1;
      camera.setViewOffset(width, height, -width * 0.17 * settle, 0, width, height);
    } else {
      // Portrait: pull back so the stack's width fits, and lift the subject
      // clear of the copy at the bottom.
      const aspect = width / height;
      const zA = Math.min(1, aspect / 0.75);
      const zB = Math.min(1, Math.max(0.42, aspect / 1.1));
      camera.zoom = zA + (zB - zA) * reveal;
      camera.setViewOffset(width, height, 0, height * (0.095 + reveal * 0.06), width, height);
    }
    camera.updateProjectionMatrix();
    return { push, reveal };
  }

  const v = new THREE.Vector3();
  function project(el: HTMLElement, key: keyof typeof lab.anchors) {
    v.copy(lab.anchors[key]).project(camera);
    const x = (v.x * 0.5 + 0.5) * width;
    const y = (-v.y * 0.5 + 0.5) * height;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    // Keep text on screen: flip to the left of the anchor near the edge.
    el.classList.toggle("flip", x > width - el.offsetWidth - 16);
  }

  function placeLabels(alpha: number) {
    labels.forEach((el) => {
      project(el, el.dataset.label as keyof typeof lab.anchors);
      el.style.opacity = String(alpha);
    });
    if (imageTags) project(imageTags, "imageTag");
    if (fovTag) project(fovTag, "fovTag");
  }

  function placeBeats(p: number) {
    // Beat 0 = intro, 1 = image question, 2 = mechanism.
    const windows: [number, number][] = [
      [-1, TIMELINE.intro[1]],
      [TIMELINE.intro[1] + 0.02, TIMELINE.pushIn[1] + 0.04],
      [TIMELINE.reveal[0] + 0.16, 2],
    ];
    beats.forEach((el, i) => {
      const [a, b] = windows[i];
      const fin = clamp01((p - a) / 0.06);
      const fout = clamp01((p - b) / 0.06);
      const o = smooth(fin) * (1 - smooth(fout));
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${((1 - fin) * 16 - fout * 12).toFixed(1)}px, 0)`;
      el.style.visibility = o > 0.01 ? "visible" : "hidden";
    });
  }

  function readProgress() {
    if (pinned !== null) return pinned;
    const rect = root.getBoundingClientRect();
    const scrollable = root.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return clamp01(-rect.top / scrollable);
  }

  let progress = readProgress();
  let eased = progress;
  let visible = false;
  let raf = 0;
  const clock = new THREE.Timer();

  function frame(now: number) {
    raf = 0;
    clock.update(now);
    eased += (progress - eased) * 0.09;
    if (Math.abs(progress - eased) < 0.0003) eased = progress;
    const p = eased;
    const { push, reveal } = placeCamera(p);
    lab.setState({
      fovFocus: smooth(clamp01(push * 1.3 - 0.15)),
      cut: smooth(clamp01((reveal - 0.04) / 0.42)),
      explode: clamp01((reveal - 0.12) / 0.75),
      patient: smooth(clamp01((reveal - 0.05) / 0.5)),
      time: clock.getElapsed(),
    });
    composer.render();
    placeBeats(p);
    placeLabels(smooth(range(p, [TIMELINE.reveal[1] - 0.06, TIMELINE.reveal[1] + 0.04])));
    if (imageTags) imageTags.style.opacity = String(1 - smooth(clamp01(reveal * 2.5)));
    if (fovTag) fovTag.style.opacity = String(smooth(clamp01(push * 1.4 - 0.4)) * (1 - smooth(clamp01(reveal * 3))));
    if (note) note.style.opacity = String(smooth(range(p, [TIMELINE.reveal[1] - 0.04, TIMELINE.reveal[1] + 0.06])));
    root.dataset.ready = "1";
    if (visible) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  }

  resize();
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    kick();
  }).observe(root);
  window.addEventListener("scroll", () => {
    progress = readProgress();
    kick();
  }, { passive: true });
  window.addEventListener("resize", () => {
    resize();
    progress = readProgress();
    kick();
  }, { passive: true });

  if (pinned !== null) {
    // Frame-by-frame capture: window.__biSeek(p) jumps the timeline.
    (window as unknown as { __biSeek: (p: number) => void }).__biSeek = (p: number) => {
      progress = eased = clamp01(p);
      frame(performance.now());
    };
  }

  root.classList.add("bi-live");
  visible = true;
  kick();
}

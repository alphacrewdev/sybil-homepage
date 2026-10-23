// Geometry, materials and lighting for "Behind the image". Everything is
// built in code from the brand palette; no external models or textures.
//
// Physical stack, top to bottom (anterior planar acquisition):
//   image matrix     one count per accepted event, at the event's position
//   PMT array        converts the light flash to electrical signals
//   light guide      spreads light so several PMTs share each flash
//   NaI(Tl) crystal  absorbs the gamma ray and emits a flash of light
//   collimator       lead septa: passes only photons travelling ~along the holes
//   patient          tracer (Tc-99m MDP) concentrated in bone emits gamma rays
//
// Scale and spacing are stylised; see docs/behind-the-image.md.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { buildBoneScan, outlinePath, paintBoneScan, FIELD_CM, type BoneScan } from "./bonescan";
import { COLORS, FOV, IMAGE, LAYERS, UNIT_CM } from "./config";

export type Lab = {
  scene: THREE.Scene;
  scan: BoneScan;
  /** World-space anchors for HTML labels. */
  anchors: Record<"image" | "pmt" | "crystal" | "collimator" | "patient" | "imageTag" | "fovTag", THREE.Vector3>;
  /** Scene state driven by the timeline (0..1 each). */
  setState: (s: { fovFocus: number; cut: number; explode: number; patient: number; time: number }) => void;
};

// The tracer map at mid-depth inside the body volume. (Offset copies for
// "depth" ghosted badly at the oblique camera angle, so it's one sheet.)
const TRACER_LAYERS = [{ dy: 0, o: 0.75 }];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function imageMaterial(tex: THREE.Texture) {
  // The display image plus a field-of-view emphasis: outside the detector's
  // field the image dims, inside a fine teal frame appears.
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: tex },
      fov: { value: new THREE.Vector4(0, 0, 1, 1) }, // u0, v0, u1, v1
      focus: { value: 0 },
      cut: { value: 0 },
      tint: { value: new THREE.Color(COLORS.tealLight) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform vec4 fov;
      uniform float focus;
      uniform float cut;
      uniform vec3 tint;
      varying vec2 vUv;
      void main() {
        vec3 c = texture2D(map, vUv).rgb;
        vec2 lo = fov.xy;
        vec2 hi = fov.zw;
        vec2 d = max(lo - vUv, vUv - hi);
        float outside = smoothstep(0.0, 0.004, max(d.x, d.y));
        // Edge distance in uv, scaled so the line is even on both axes.
        vec2 e = min(abs(vUv - lo), abs(vUv - hi)) * vec2(6.4, 19.2);
        bool inX = vUv.x > lo.x - 0.002 && vUv.x < hi.x + 0.002;
        bool inY = vUv.y > lo.y - 0.001 && vUv.y < hi.y + 0.001;
        float line = 0.0;
        if (inY) line = max(line, 1.0 - smoothstep(0.0, 0.035, e.x));
        if (inX) line = max(line, 1.0 - smoothstep(0.0, 0.035, e.y));
        vec3 dim = mix(c, c * vec3(0.42, 0.5, 0.6), 0.85);
        c = mix(c, dim, outside * focus);
        c = mix(c, tint, line * focus);
        // Outside this detector position the image lifts away: this head,
        // at this table position, only records its own field of view.
        float a = 1.0 - outside * cut;
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

function bracket(size: number, thick: number, mat: THREE.Material) {
  const g = new THREE.Group();
  const a = new THREE.Mesh(new THREE.BoxGeometry(size, thick, thick), mat);
  a.position.x = size / 2;
  const b = new THREE.Mesh(new THREE.BoxGeometry(thick, thick, size), mat);
  b.position.z = size / 2;
  g.add(a, b);
  return g;
}

/** Hexagonal lead septa clipped to the field of view, as one merged mesh. */
function collimatorGeometry(width: number, depth: number, height: number, pitch: number) {
  const r = pitch / Math.sqrt(3); // hex circumradius for a flat-to-flat pitch
  const positions: number[] = [];
  const rowStep = pitch * (Math.sqrt(3) / 2);
  const cols = Math.ceil(width / pitch) + 2;
  const rows = Math.ceil(depth / rowStep) + 2;
  const hx = width / 2;
  const hz = depth / 2;
  const wall = (x1: number, z1: number, x2: number, z2: number) => {
    // Clip walls to the field rectangle.
    if (Math.max(Math.abs(x1), Math.abs(x2)) > hx + 1e-4 || Math.max(Math.abs(z1), Math.abs(z2)) > hz + 1e-4) return;
    const y0 = -height / 2;
    const y1 = height / 2;
    positions.push(x1, y0, z1, x2, y0, z2, x2, y1, z2, x1, y0, z1, x2, y1, z2, x1, y1, z1);
  };
  for (let j = -rows; j <= rows; j++) {
    for (let i = -cols; i <= cols; i++) {
      // Flat-topped columns: centres offset every other row.
      const cx = i * pitch + (j & 1 ? pitch / 2 : 0);
      const cz = j * rowStep;
      const corner = (k: number) => {
        const a = Math.PI / 6 + (k * Math.PI) / 3;
        return [cx + r * Math.cos(a), cz + r * Math.sin(a)];
      };
      // Three walls per cell; neighbours supply the rest.
      for (const k of [0, 1, 2]) {
        const [x1, z1] = corner(k);
        const [x2, z2] = corner(k + 1);
        wall(x1, z1, x2, z2);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.computeVertexNormals();
  return g;
}

/** Hexagonally packed PMT centres inside the field of view. */
function pmtCentres(width: number, depth: number, pitch: number, radius: number) {
  const out: [number, number][] = [];
  const rowStep = pitch * (Math.sqrt(3) / 2);
  for (let j = -10; j <= 10; j++) {
    for (let i = -10; i <= 10; i++) {
      const x = i * pitch + (j & 1 ? pitch / 2 : 0);
      const z = j * rowStep;
      if (Math.abs(x) + radius <= width / 2 + 0.02 && Math.abs(z) + radius <= depth / 2 + 0.02) out.push([x, z]);
    }
  }
  return out;
}

/** A shell around the body outline with a soft rim: reads as a volume. */
function bodyMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      color: { value: new THREE.Color(COLORS.tealLight) },
      fill: { value: new THREE.Color(0x0b3a58) },
      opacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform vec3 fill;
      uniform float opacity;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(f, 2.6);
        vec3 c = mix(fill, color, rim);
        float a = (0.03 + rim * 0.22) * opacity;
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

export function buildLab(renderer: THREE.WebGLRenderer): Lab {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.Fog(COLORS.fog, 26, 58);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  // Lighting: cool key from above the image, teal rim from behind the
  // stack, faint warm fill from the patient's tracer glow.
  scene.add(new THREE.HemisphereLight(0x9cc8d8, 0x020a16, 0.5));
  const key = new THREE.DirectionalLight(0xe6f2ff, 2.2);
  key.position.set(6, 14, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(COLORS.tealLight, 1.6);
  rim.position.set(-8, 4, -14);
  scene.add(rim);
  const warm = new THREE.PointLight(COLORS.tracer, 6, 9, 1.6);
  warm.position.set(0, -0.6, FOV.z);
  scene.add(warm);

  // ---------------------------------------------------------------- image
  const scan = buildBoneScan();
  // A slightly dimmer "paper" than the page so the lit display doesn't bloom.
  const imgCanvas = paintBoneScan(scan, document.createElement("canvas"), { paper: [214, 224, 230], ink: [4, 12, 24] });
  const imgTex = new THREE.CanvasTexture(imgCanvas);
  imgTex.colorSpace = THREE.SRGBColorSpace;
  imgTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const imgMat = imageMaterial(imgTex);
  // Field-of-view rectangle in uv (v runs from the image bottom, so feet = 0).
  const u0 = 0.5 - FOV.w / 2 / IMAGE.w;
  const u1 = 0.5 + FOV.w / 2 / IMAGE.w;
  const zTop = FOV.z - FOV.d / 2; // toward the head
  const zBot = FOV.z + FOV.d / 2;
  const vOf = (z: number) => 1 - (z + IMAGE.h / 2) / IMAGE.h;
  imgMat.uniforms.fov.value.set(u0, vOf(zBot), u1, vOf(zTop));

  const imageGroup = new THREE.Group();
  imageGroup.position.y = IMAGE.y;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(IMAGE.w, IMAGE.h), imgMat);
  plane.rotation.x = -Math.PI / 2; // lies flat, uv v=1 toward -z (head)
  plane.position.y = 0.031;
  imageGroup.add(plane);
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x0a2240, metalness: 0.55, roughness: 0.38, transparent: true });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(IMAGE.w + 0.36, 0.06, IMAGE.h + 0.36), slabMat);
  imageGroup.add(slab);
  // The tile that remains: one detector position's worth of image.
  const tile = new THREE.Mesh(
    new THREE.BoxGeometry(FOV.w + 0.16, 0.05, FOV.d + 0.16),
    new THREE.MeshStandardMaterial({ color: 0x0a2240, metalness: 0.55, roughness: 0.38 }),
  );
  tile.position.set(0, -0.004, FOV.z);
  imageGroup.add(tile);
  // Sybil's bracket device, in 3D, around the display.
  const bracketMat = new THREE.MeshBasicMaterial({ color: COLORS.tealLight, transparent: true });
  const tileBracketMat = new THREE.MeshBasicMaterial({ color: COLORS.tealLight, transparent: true, opacity: 0 });
  const corners = (hw: number, hd: number, cz: number, size: number, mat: THREE.Material) =>
    [
      [-hw, cz - hd, 0],
      [hw, cz - hd, -Math.PI / 2],
      [hw, cz + hd, Math.PI],
      [-hw, cz + hd, Math.PI / 2],
    ].forEach(([x, z, r]) => {
      const b = bracket(size, 0.045, mat);
      b.position.set(x, 0.05, z);
      b.rotation.y = r;
      imageGroup.add(b);
    });
  corners(IMAGE.w / 2 + 0.34, IMAGE.h / 2 + 0.34, 0, 0.9, bracketMat);
  corners(FOV.w / 2 + 0.22, FOV.d / 2 + 0.22, FOV.z, 0.5, tileBracketMat);
  scene.add(imageGroup);

  // ---------------------------------------------------------- detector
  const detector = new THREE.Group();
  detector.position.z = FOV.z;
  scene.add(detector);

  // PMT array: glass envelope, photocathode face, dynode core, base.
  const centres = pmtCentres(FOV.w, FOV.d, LAYERS.pmt.pitch, LAYERS.pmt.radius);
  const pmt = new THREE.Group();
  const R = LAYERS.pmt.radius;
  const H = LAYERS.pmt.height;
  const glassGeo = new THREE.CylinderGeometry(R, R, H * 0.62, 40, 1, true);
  const neckGeo = new THREE.CylinderGeometry(R * 0.62, R * 0.98, H * 0.16, 40, 1, true);
  const baseGeo = new THREE.CylinderGeometry(R * 0.62, R * 0.62, H * 0.22, 32);
  const cathodeGeo = new THREE.CircleGeometry(R * 0.96, 40);
  const dynodeGeo = new THREE.CylinderGeometry(R * 0.2, R * 0.28, H * 0.5, 16);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfd9e6,
    metalness: 0,
    roughness: 0.08,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x15283d, metalness: 0.7, roughness: 0.35 });
  // Bialkali photocathodes look bronze; emissive is driven per-tube later.
  const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x8a6a3c, metalness: 0.85, roughness: 0.3, emissive: 0x000000 });
  const dynodeMat = new THREE.MeshStandardMaterial({ color: 0x9aa7b0, metalness: 0.9, roughness: 0.3 });
  const n = centres.length;
  const glass = new THREE.InstancedMesh(glassGeo, glassMat, n);
  const neck = new THREE.InstancedMesh(neckGeo, glassMat, n);
  const base = new THREE.InstancedMesh(baseGeo, baseMat, n);
  const cathode = new THREE.InstancedMesh(cathodeGeo, cathodeMat, n);
  const dynode = new THREE.InstancedMesh(dynodeGeo, dynodeMat, n);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const qDown = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
  const one = new THREE.Vector3(1, 1, 1);
  centres.forEach(([x, z], i) => {
    glass.setMatrixAt(i, m.compose(new THREE.Vector3(x, -H / 2 + H * 0.31, z), q, one));
    neck.setMatrixAt(i, m.compose(new THREE.Vector3(x, -H / 2 + H * 0.7, z), q, one));
    base.setMatrixAt(i, m.compose(new THREE.Vector3(x, H / 2 - H * 0.11, z), q, one));
    dynode.setMatrixAt(i, m.compose(new THREE.Vector3(x, -H / 2 + H * 0.42, z), q, one));
    cathode.setMatrixAt(i, m.compose(new THREE.Vector3(x, -H / 2 + 0.004, z), qDown, one));
  });
  pmt.add(cathode, dynode, base, glass, neck);
  // Mounting plate the tubes hang from.
  detector.add(pmt);

  // Light guide: clear acrylic.
  const guide = new THREE.Mesh(
    new THREE.BoxGeometry(FOV.w, LAYERS.guide.thickness, FOV.d),
    new THREE.MeshPhysicalMaterial({ color: 0xd6eef5, roughness: 0.05, transparent: true, opacity: 0.08, clearcoat: 1, depthWrite: false }),
  );
  detector.add(guide);

  // NaI(Tl) crystal in its aluminium housing, edges lit so the thin slab reads.
  const crystal = new THREE.Group();
  const crystalBody = new THREE.Mesh(
    new THREE.BoxGeometry(FOV.w, LAYERS.crystal.thickness, FOV.d),
    new THREE.MeshPhysicalMaterial({
      color: 0x9fb6ff,
      roughness: 0.12,
      metalness: 0,
      transparent: true,
      opacity: 0.4,
      emissive: COLORS.scint,
      emissiveIntensity: 0.12,
      clearcoat: 1,
      depthWrite: false,
    }),
  );
  crystal.add(crystalBody);
  const crystalEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(crystalBody.geometry),
    new THREE.LineBasicMaterial({ color: 0xaebfff, transparent: true, opacity: 0.85 }),
  );
  crystal.add(crystalEdges);
  const housingMat = new THREE.MeshStandardMaterial({ color: 0x8b98a3, metalness: 0.9, roughness: 0.32 });
  const ht = 0.07;
  const hh = LAYERS.crystal.thickness + 0.04;
  [
    [0, -FOV.d / 2 - ht / 2, FOV.w + ht * 2, ht],
    [0, FOV.d / 2 + ht / 2, FOV.w + ht * 2, ht],
    [-FOV.w / 2 - ht / 2, 0, ht, FOV.d],
    [FOV.w / 2 + ht / 2, 0, ht, FOV.d],
  ].forEach(([x, z, w, d]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), housingMat);
    bar.position.set(x, 0, z);
    crystal.add(bar);
  });
  detector.add(crystal);

  // Parallel-hole collimator: lead septa in a hexagonal array, with a frame.
  const collimator = new THREE.Group();
  const leadMat = new THREE.MeshStandardMaterial({ color: 0x7b858d, metalness: 0.55, roughness: 0.5, side: THREE.DoubleSide });
  const septa = new THREE.Mesh(collimatorGeometry(FOV.w, FOV.d, LAYERS.collimator.height, LAYERS.collimator.pitch), leadMat);
  collimator.add(septa);
  const frameGeos: THREE.BufferGeometry[] = [];
  const ft = 0.08;
  const fh = LAYERS.collimator.height + 0.02;
  [
    [0, -FOV.d / 2 - ft / 2, FOV.w + ft * 2, ft],
    [0, FOV.d / 2 + ft / 2, FOV.w + ft * 2, ft],
    [-FOV.w / 2 - ft / 2, 0, ft, FOV.d],
    [FOV.w / 2 + ft / 2, 0, ft, FOV.d],
  ].forEach(([x, z, w, d]) => {
    const g = new THREE.BoxGeometry(w, fh, d);
    g.translate(x, 0, z);
    frameGeos.push(g);
  });
  collimator.add(new THREE.Mesh(mergeGeometries(frameGeos), new THREE.MeshStandardMaterial({ color: 0x4f5a63, metalness: 0.6, roughness: 0.45 })));
  detector.add(collimator);

  // ----------------------------------------------------------- patient
  const patient = new THREE.Group();
  patient.position.y = LAYERS.patient.y;
  scene.add(patient);

  // Body volume from the same outline as the image, so they align 1:1.
  const outline = outlinePath();
  const shape = new THREE.Shape(outline.map(([x, ycm]) => new THREE.Vector2(x / UNIT_CM, -(ycm - FIELD_CM.h / 2) / UNIT_CM)));
  const T = LAYERS.patient.thickness;
  const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth: T - 0.7, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.22, bevelSegments: 5, curveSegments: 4 });
  bodyGeo.translate(0, 0, -(T - 0.7) / 2);
  bodyGeo.rotateX(-Math.PI / 2); // shape y → world -z (head toward -z)
  const bodyMat = bodyMaterial();
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.renderOrder = 2;
  patient.add(body);

  // Tracer distribution: the noise-free activity map as additive layers at
  // a few depths, so the skeleton reads as inside a volume.
  const act = document.createElement("canvas");
  act.width = scan.w;
  act.height = scan.h;
  const actx = act.getContext("2d")!;
  const aimg = actx.createImageData(scan.w, scan.h);
  const amber = new THREE.Color(COLORS.tracer);
  for (let i = 0; i < scan.w * scan.h; i++) {
    const t = Math.min(1, scan.activity[i] / (scan.windowMax * 1.15));
    const k = Math.pow(t, 1.25) * 0.9;
    const white = Math.max(0, t - 0.85) * 1.2;
    aimg.data[i * 4] = Math.min(255, (amber.r * k + white * 0.6) * 255);
    aimg.data[i * 4 + 1] = Math.min(255, (amber.g * k + white * 0.55) * 255);
    aimg.data[i * 4 + 2] = Math.min(255, (amber.b * k + white * 0.45) * 255);
    aimg.data[i * 4 + 3] = 255;
  }
  actx.putImageData(aimg, 0, 0);
  const actTex = new THREE.CanvasTexture(act);
  actTex.colorSpace = THREE.SRGBColorSpace;
  const tracerMats: THREE.MeshBasicMaterial[] = [];
  TRACER_LAYERS.forEach(({ dy, o }) => {
    const mat = new THREE.MeshBasicMaterial({
      map: actTex,
      transparent: true,
      opacity: o,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    tracerMats.push(mat);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(IMAGE.w, IMAGE.h), mat);
    p.rotation.x = -Math.PI / 2;
    p.position.y = dy;
    p.renderOrder = 1;
    patient.add(p);
  });

  // Patient table: a shallow carbon-fibre pallet.
  const tableShape = new THREE.Shape();
  const tw = 2.9;
  tableShape.moveTo(-tw, 0.18);
  tableShape.quadraticCurveTo(0, -0.42, tw, 0.18);
  tableShape.lineTo(tw, 0.1);
  tableShape.quadraticCurveTo(0, -0.5, -tw, 0.1);
  tableShape.closePath();
  const tableGeo = new THREE.ExtrudeGeometry(tableShape, { depth: 21, bevelEnabled: false });
  tableGeo.translate(0, 0, -10.5);
  const table = new THREE.Mesh(tableGeo, new THREE.MeshStandardMaterial({ color: 0x06111f, metalness: 0.2, roughness: 0.8 }));
  table.position.y = LAYERS.table.y;
  scene.add(table);

  // Faint floor grid far below, for depth.
  const grid = new THREE.GridHelper(80, 80, 0x0f3550, 0x0a2741);
  grid.position.y = -4.2;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.5;
  scene.add(grid);

  const anchors = {
    image: new THREE.Vector3(FOV.w / 2 + 0.3, IMAGE.y + 0.05, FOV.z - FOV.d / 2 - 0.4),
    pmt: new THREE.Vector3(FOV.w / 2, LAYERS.pmt.y, FOV.z - FOV.d / 2),
    crystal: new THREE.Vector3(FOV.w / 2, LAYERS.crystal.y, FOV.z - FOV.d / 2),
    collimator: new THREE.Vector3(FOV.w / 2, LAYERS.collimator.y, FOV.z - FOV.d / 2),
    patient: new THREE.Vector3(1.1, LAYERS.patient.y + 0.75, FOV.z + 0.6),
    // On the image: beside its lower right corner, and the field's corner.
    imageTag: new THREE.Vector3(IMAGE.w / 2 + 0.75, IMAGE.y, IMAGE.h / 2 + 0.3),
    fovTag: new THREE.Vector3(FOV.w / 2 + 0.25, IMAGE.y, FOV.z - FOV.d / 2),
  };

  const parts = [
    { obj: pmt, l: LAYERS.pmt, delay: 0 },
    { obj: guide, l: LAYERS.guide, delay: 0.08 },
    { obj: crystal, l: LAYERS.crystal, delay: 0.14 },
    { obj: collimator, l: LAYERS.collimator, delay: 0.22 },
  ];

  function setState({ fovFocus, cut, explode, patient: pv, time }: { fovFocus: number; cut: number; explode: number; patient: number; time: number }) {
    imgMat.uniforms.focus.value = fovFocus;
    imgMat.uniforms.cut.value = cut;
    slabMat.opacity = 1 - cut;
    slab.visible = cut < 0.999;
    bracketMat.opacity = 1 - cut;
    tileBracketMat.opacity = cut;
    parts.forEach(({ obj, l, delay }) => {
      const t = easeInOut(clamp01((explode - delay) / (1 - 0.22)));
      obj.position.y = l.compact + (l.y - l.compact) * t;
      obj.visible = explode > 0.001;
    });
    bodyMat.uniforms.opacity.value = pv;
    // Slow "breathing" of the tracer glow: stylistic, not decay (Tc-99m's
    // 6-hour half-life is flat on this timescale).
    const breathe = 1 + Math.sin(time * 0.9) * 0.05;
    tracerMats.forEach((mat, i) => (mat.opacity = pv * TRACER_LAYERS[i].o * breathe));
    warm.intensity = 6 * pv;
    cathodeMat.emissive.setRGB(0.05 * explode, 0.035 * explode, 0.01 * explode);
  }

  return { scene, scan, anchors, setState };
}

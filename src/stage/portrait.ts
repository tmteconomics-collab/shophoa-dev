import { Color, Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector2, Vector4 } from "three";
import { character, type VariantInfo } from "./config";
import { palette } from "./palette";

// The photo is drawn on a quad placed directly in clip space over the hero box.
const vertex = /* glsl */ `
uniform vec4 uRect; // center xy and half size zw, in NDC
varying vec2 vUv;
void main() {
  vUv = vec2(uv.x, 1.0 - uv.y); // top-down, like the image
  gl_Position = vec4(uRect.xy + position.xy * uRect.zw, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
uniform sampler2D uMap;
uniform sampler2D uDepth;
uniform vec4 uImg;       // image box inside the hero box: x, y, w, h (0-1, top-down)
uniform vec2 uLook;      // head direction, image space
uniform vec2 uIris;      // eye direction inside the socket
uniform float uBlink;
uniform vec2 uEyeL;
uniform vec2 uEyeR;
uniform vec2 uEyeRad;
uniform float uStrength;
uniform float uYGain;
uniform float uAspect;   // image width / height
uniform float uOpacity;
uniform float uGrade;
uniform vec3 uNight;
uniform vec3 uCobalt;
varying vec2 vUv;

vec2 eye(vec2 uv, vec2 c, inout float lash) {
  vec2 q = (uv - c) / uEyeRad;
  float m = 1.0 - smoothstep(0.8, 1.2, length(q));
  if (m <= 0.0) return uv;
  // Move the iris toward the gaze by sampling from the opposite side.
  vec2 q2 = q - uIris * vec2(0.28, 0.1) * m;
  if (uBlink > 0.001) {
    float lid = -1.0 + 2.0 * uBlink;
    float y = q2.y;
    // Above the lid: stretch the skin from just above the eye down over it.
    // Below the lid: squeeze the open eye into what is left.
    float sy = y < lid
      ? -1.0 - 1.3 * (lid - y) / max(lid + 1.0, 0.001)
      : -1.0 + 2.0 * (y - lid) / max(1.0 - lid, 0.001);
    q2.y = mix(y, sy, m);
    float dl = (y - lid) / 0.22;
    lash += m * smoothstep(0.0, 0.25, uBlink) * exp(-dl * dl);
  }
  return mix(uv, c + q2 * uEyeRad, m);
}

void main() {
  vec2 uv = (vUv - uImg.xy) / uImg.zw;

  // Depth parallax: near pixels shift with the gaze, far ones against it.
  vec2 off = uLook * vec2(1.0, uYGain * uAspect) * uStrength;
  vec2 suv = uv;
  for (int i = 0; i < 4; i++) {
    float d = texture2D(uDepth, clamp(suv, 0.0, 1.0)).r;
    suv = uv - off * (d - 0.42);
  }

  float lash = 0.0;
  suv = eye(suv, uEyeL, lash);
  suv = eye(suv, uEyeR, lash);
  suv = clamp(suv, 0.001, 0.999);

  vec3 col = texture2D(uMap, suv).rgb;
  col *= 1.0 - 0.38 * clamp(lash, 0.0, 1.0);

  // Grade: the world recedes into cobalt night, the person stays true.
  vec2 dm = texture2D(uDepth, suv).rg;
  float bg = (1.0 - dm.g) * (1.0 - dm.r * 0.6);
  vec3 tinted = col * vec3(0.62, 0.66, 1.0) + uCobalt * 0.06;
  col = mix(col, tinted, bg * uGrade);
  col = mix(col, uNight, bg * uGrade * 0.18);

  gl_FragColor = vec4(col, uOpacity);
}
`;

export function createPortrait(map: Texture, depth: Texture, v: VariantInfo) {
  const lm = v.landmarks;
  const t = character.tracking.headParallax;
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uMap: { value: map },
      uDepth: { value: depth },
      uRect: { value: new Vector4(0, 0, 1, 1) },
      uImg: { value: new Vector4(0, 0, 1, 1) },
      uLook: { value: new Vector2() },
      uIris: { value: new Vector2() },
      uBlink: { value: 0 },
      uEyeL: { value: new Vector2(...lm.leftEye) },
      uEyeR: { value: new Vector2(...lm.rightEye) },
      uEyeRad: { value: new Vector2(...v.eyeRadius) },
      uStrength: { value: t.strengthFractionOfWidth },
      uYGain: { value: t.yAxisGain },
      uAspect: { value: v.size[0] / v.size[1] },
      uOpacity: { value: 0 },
      uGrade: { value: 1 },
      uNight: { value: new Color(palette.night) },
      uCobalt: { value: new Color(palette.cobalt) },
    },
  });
  const mesh = new Mesh(new PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 0;
  return { mesh, material };
}

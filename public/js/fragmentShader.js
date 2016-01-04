

  varying vec2 vUv;
  uniform sampler2D tExplosion;
  varying vec3 vReflect;
  varying vec3 pos;
  varying float ao;
  varying float d;
  precision highp float;

  float PI = 3.14159265358979323846264;

  void main() {

    vec3 color = texture2D( tExplosion, vec2( 0, .85 - ao ) ).rgb;
    gl_FragColor = vec4( color.rgb, 1.0 );

  }



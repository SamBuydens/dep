'use strict';

import {$} from '../helpers/util';
let dotScreenShaderEffect, shaderPassEffect;

let myComposer;

const init = (renderer, scene, camera) => {
  myComposer = new THREE.EffectComposer( renderer );
  myComposer.addPass( new THREE.RenderPass( scene, camera ) );

  dotScreenShaderEffect = new THREE.ShaderPass( THREE.DotScreenShader );
  dotScreenShaderEffect.uniforms.scale.value = 1;
  myComposer.addPass( dotScreenShaderEffect );

  shaderPassEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
  shaderPassEffect.uniforms.amount.value = 0.015;
  shaderPassEffect.renderToScreen = true;
  myComposer.addPass( shaderPassEffect );

  $('.pitchSlider').oninput = (e) =>{
    $('.pitchAmount').value = e.currentTarget.value;
    dotScreenShaderEffect.uniforms.scale.value = 1 + e.currentTarget.value;
  };

  $('.glitchSlider').oninput = (e) =>{
    $('.glitchAmount').value = e.currentTarget.value;
    shaderPassEffect.uniforms.amount.value = 0.015 + e.currentTarget.value/1000;
  };
};

const composer = () => {
  return myComposer;
};

module.exports = {init, composer};

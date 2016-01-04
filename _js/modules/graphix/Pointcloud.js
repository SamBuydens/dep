'use strict';
export default class Pointcloud extends THREE.Points{

  constructor(value){
    super();



    this.totalSounds = value.track.length;
    this.track = value.track;
    this.sounds = [];
    this.lifeCycle = 0;

    this.currentSoundIndex = 0;

    //this.portionalWidth = (window.innerWidth/positionInformation.totalLength);
    this.soundLength = value.track[0].decay;

    this.currentSize = 1;
    this.nextSize = 4;

    this.frameRateRatio = 30/this.track[this.currentSoundIndex].decay;
    this.render();

  }

  render(){

    this.materials = [];

    let maxPoints = 8000;
    let geometry = new THREE.Geometry();
    let color;
    let size;

    for ( i = 0; i < maxPoints; i++ ) {

      var vertex = new THREE.Vector3();

      vertex.x = (Math.random()*-500)+250;

      vertex.y = (Math.random()*-500)+250;
      vertex.z = Math.random() * this.track[this.currentSoundIndex].freq;

      geometry.vertices.push( vertex );

    }

    this.parameters = [
      [[1, 1, 0.5], 5],
      [[0.95, 1, 0.5], 4],
      [[0.90, 1, 0.5], 3],
      [[0.85, 1, 0.5], 2],
      [[0.80, 1, 0.5], 1]
    ];

    for (var i = 0; i < this.parameters.length; i++ ) {

      color = this.parameters[i][0];

      //this.materials[i] = new THREE.PointsMaterial();

      //this.materials[i].needsUpdate = true;
      this.name = this.track[this.currentSoundIndex].name;

      this.rotation.x = Math.random() * this.track[this.currentSoundIndex].attack;
      this.rotation.y = Math.random() * this.track[this.currentSoundIndex].attack;
      this.rotation.z = Math.random() * this.track[this.currentSoundIndex].attack;

    }
    //let sprite1 = THREE.TextureLoader( "ownTextures/circle.png" );
    //this.material.map = sprite1;
    this.geometry = geometry;
    this.material.size = this.currentSize;

  }

  update(){
    let time = Date.now() * 0.00005;


    if(this.lifeCycle === 0){

      this.compareValues();

      let _this = this;

      setTimeout(function doSomething() {
        _this.currentSize = _this.track[_this.currentSoundIndex%_this.totalSounds].freq/100;

        _this.material.needsUpdate = true;

        _this.currentSoundIndex++;

        _this.nextSize = _this.track[_this.currentSoundIndex%_this.totalSounds].freq/100;

          //this.materials[i].color = 0x000000;


          /*
          let color = _this.parameters[0][0];
          let h = ( 360 * ( color[0] + time ) % 3600 ) / 360;
          _this.material.color.setHSL( h, color[1], color[2] );
          */

        setTimeout(doSomething, _this.soundLength);


      }, _this.soundLength);



      this.lifeCycle++;

    }

    if(this.material.size > this.nextSize){
      this.material.size -= ((this.biggestNr - this.smallestNr)*this.frameRateRatio);

    }
    if(this.material.size < this.nextSize){
      this.material.size += ((this.biggestNr - this.smallestNr)*this.frameRateRatio);

    }

    this.currentSize = this.material.size;

    this.compareValues();
  }

  updateTeller(){

  }

  compareValues(){

    let sizes = [this.currentSize, this.nextSize];

    sizes.forEach((number) =>{

      let biggestNr = sizes.find(x => {
        return x > number;
      });

      let smallestNr = sizes.find(x => {
        return x < number;
      });

      if (biggestNr) this.biggestNr = biggestNr;
      if (smallestNr) this.smallestNr = smallestNr;

    });

  }

}

'use strict';

let bottomGrid, leftGrid, rightGrid, topGrid;

const render = () => {
  bottomGrid = new THREE.GridHelper( 500, 20 );
  bottomGrid.position.z = 500;
  bottomGrid.setColors( 0xff005a, 0xff005a );

  topGrid = new THREE.GridHelper( 500, 20 );
  topGrid.position.z = 500;
  topGrid.position.y = -500;
  topGrid.setColors( 0xff005a, 0xff005a );

  leftGrid = new THREE.GridHelper( 250, 20 );
  leftGrid.position.x = 500;
  leftGrid.position.y = -250;
  leftGrid.rotation.z = Math.PI / 2;
  leftGrid.position.z = 750;
  leftGrid.setColors( 0xff005a, 0xff005a );

  rightGrid = new THREE.GridHelper( 250, 20 );
  rightGrid.position.x = -500;
  rightGrid.position.y = -250;
  rightGrid.rotation.z = Math.PI / 2;
  rightGrid.position.z = 750;
  rightGrid.setColors( 0xff005a, 0xff005a );

  return [bottomGrid, leftGrid, rightGrid, topGrid];
};

module.exports = {render};

/// --- Set up a system ---

const camera = Camera.instance

let startGame = false;
const gltfShape = new GLTFShape('models/FloorBaseGrass_02/FloorBaseGrass_02.glb')

/// --- Rotator class system ---
class RotatorSystem {
  
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    let positionE = camera.position;

    if(startGame) {

      for (let entity of this.group.entities) {

        const transform = entity.getComponent(Transform)

        if(transform.position.y > 1)
          transform.translate(Vector3.Down().scale(0.1));
        
        if(transform.position.y <= 1 && transform.position.y > 0) {
          engine.removeEntity(entity);
          spawnCube(positionE.x, 10, positionE.z);
        }

        if(checkCollision(transform.position)) {
          log("Game over")
          startGame = false
          engine.removeEntity(entity);
          addButton();
        }

      }
    
    }
    
  }
}

/// --- check collision function ---
function checkCollision(position: Vector3) {
  return position.x.toFixed(1) === camera.position.x.toFixed(1) 
  && position.z.toFixed(1) === camera.position.z.toFixed(1)
  && position.y.toFixed(1) === camera.position.y.toFixed(1);
}

/// --- Spawner function ---
function spawnCube(x: number, y: number, z: number) {
  const cube = new Entity()

  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  let box = new BoxShape()
  box.withCollisions = true
  cube.addComponent(box)

  const myMaterial = new Material()
  myMaterial.albedoColor = Color3.Random()
  myMaterial.metallic = 0.2
  myMaterial.roughness = 0.4
  cube.addComponent(myMaterial)

  engine.addEntity(cube)

  return cube
}

/// --- Text function ---
function addText(text: string) {
  const textEntity = new Entity();

  const textShape = new TextShape(text);
  textShape.fontSize = 30
  textShape.color = Color3.Blue()
  textEntity.addComponent(textShape);

  engine.addEntity(textEntity);
}

/// --- Button function ---
function addButton() {
  const buttonEntity = new Entity();
  buttonEntity.name = "BoxEntity";

  const boxEntity = new Entity();
  boxEntity.name = "BoxEntity";

  const box = new BoxShape();
  boxEntity.addComponent(box);

  boxEntity.addComponent(new Transform({ position: new Vector3(0, 0, 0.1) })).scale.set(6, 1, 0.1)

  boxEntity.addComponent(
    new OnClick(e => {
      startGame = true

      log("start game", startGame)
    })
  )

  const myMaterial = new Material()
  myMaterial.albedoColor = Color3.Blue()
  boxEntity.addComponent(myMaterial)

  boxEntity.setParent(buttonEntity)

  const textShape = new TextShape("Start Game");
  textShape.color = Color3.White()
  
  buttonEntity.addComponent(textShape);

  buttonEntity.addComponent(new Transform({ position: new Vector3(8, 1, 8) })).scale.set(1, 1, 1)

  engine.addEntity(buttonEntity);
}

/// --- Floor function ---
function addFloor() {
  const floorEntity = new Entity()
  floorEntity.name = "FloorEntity";
  
  floorEntity.addComponentOrReplace(gltfShape)
  
  floorEntity.addComponentOrReplace(new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(1, 1, 1)
  }))
  
  engine.addEntity(floorEntity)
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem())

// --- Add Start button ---
addButton();

// Floor
addFloor();
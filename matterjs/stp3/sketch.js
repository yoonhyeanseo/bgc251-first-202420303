const colors = ['#F3F3E0', '#27548A', '#183B4E', '#183B4E'];

const Engine = Matter.Engine,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

var engine, world;
var runner;
var stack;
var walls;

// add mouse control
var mouse;
var mouseConstraint;

function setup() {
  let aCanvas = createCanvas(800, 600);

  // create engine
  engine = Engine.create();
  world = engine.world;

  // create runner
  runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
    var sides = Math.round(Common.random(1, 8));

    // round the edges of some bodies
    var chamfer = null;
    if (sides > 2 && Common.random() > 0.7) {
      chamfer = {
        radius: 10,
      };
    }

    switch (Math.round(Common.random(0, 1))) {
      case 0:
        if (Common.random() < 0.8) {
          return Bodies.rectangle(
            x,
            y,
            Common.random(25, 50),
            Common.random(25, 50),
            { chamfer: chamfer }
          );
        } else {
          return Bodies.rectangle(
            x,
            y,
            Common.random(80, 120),
            Common.random(25, 30),
            { chamfer: chamfer }
          );
        }
      case 1:
        return Bodies.polygon(x, y, sides, Common.random(25, 50), {
          chamfer: chamfer,
        });
    }
  });

  Composite.add(world, stack);

  walls = [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
  ];
  Composite.add(world, walls);

  console.log(aCanvas.elt);

  // add mouse control
  mouse = Mouse.create(aCanvas.elt);
  mouse.pixelRatio = pixelDensity();
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(world, mouseConstraint);

  console.log(stack);
  console.log(world);
}

function drawBody(body) {
  beginShape();
  for (let idx = 0; idx < body.vertices.length; idx++) {
    let aVertex = body.vertices[idx];
    vertex(aVertex.x, aVertex.y);
  }
  endShape(CLOSE);
}

function draw() {
  randomSeed(0);
  background('black');
  stroke('white');
  for (let idx = 0; idx < stack.bodies.length; idx++) {
    let aBody = stack.bodies[idx];
    let colorIdx = floor(random(colors.length));
    fill(colors[colorIdx]);
    drawBody(aBody);
  }

  noFill();
  for (let idx = 0; idx < walls.length; idx++) {
    let aBody = walls[idx];
    drawBody(aBody);
  }
}

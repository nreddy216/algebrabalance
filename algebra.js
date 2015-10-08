//Please excuse the somewhat messy code. This was a test of the physics engine and it didn't fully succeed.

// Made with Matter.js - http://brm.io/matter-js/


//
// Matter module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Composite = Matter.Composite;
    MouseConstraint = Matter.MouseConstraint;
    Common = Matter.Common;
    Pair = Matter.Pair;
    Vector = Matter.Vector;
    Svg = Matter.Svg;

// create a Matter.js engine
var engine = Engine.create(document.body, {
  render: {
    options: {
      showAngleIndicator: true,
      showVelocity: true,
      showCollisions: true,
      wireframes: false
    }
  }
});



// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

//randomly chooses positive numbers for both sides, numBoxes_L is always < numBoxes_R
var numBoxes_R = Math.floor(Math.random()*8+1);
var numBoxes_L = Math.floor(Math.random()*numBoxes_R);

//array that numBoxes will be added to before being pushed to the world
stack = [];



//mystery box added
var mysteryBox = Bodies.rectangle(200, 250, 50, 50, {isStatic: false, render: {sprite: {texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/box-grape-blue.png'}}});
Body.setMass(mysteryBox, numBoxes_R - numBoxes_L);

// create a groupId to prevent bridge colliding with itself
var groupId = Body.nextGroupId();


  // create the catapult
    var catapult = Bodies.rectangle(400, 100, 300, 20, {isStatic:false});


    //balance beam bar
    var middleBar = Bodies.rectangle(400, 10, 20, 0, {isStatic: true});


//

    /**
     * Description
     * @method balanceBucket
     * @param {number} xx
     * @param {number} yy
     * @return {composite} A new composite balanceBucket
     */

     //fix the number of arguments
Composites.balanceBucket = function(xx, yy, attachBeam, axelAx) {
    var group = Body.nextGroup(true),
        rectBase = -30;

    var balanceBucket = Composite.create({ label: 'balanceBucket' }),
        body = Bodies.rectangle(xx+10, yy+200, 200, 20, {
            collisionFilter: {
                group: group
            },
            // friction: 0.01,
            chamfer: {
                radius: 4,
            mass: 1
            }
        });

    var rectA = Bodies.rectangle(xx + 0, yy + 75, 20, 20, {
        collisionFilter: {
            group: group
        }, mass: 1
    });


    var axelA = Constraint.create({
        bodyA: body,
        pointA: { x: axelAx, y: 0 },
        bodyB: rectA,
        stiffness: 1
    });

    var axelB = Constraint.create({
        bodyA: body,
        pointA: { x: attachBeam, y: 0 },
        bodyB: rectA,
        stiffness: 1
    });

    var axelC = Constraint.create({
        bodyA: catapult,
        pointA: { x: attachBeam, y: 0 },
        bodyB: rectA,
        stiffness: 0
    });



    //attaches bodies to constraints
    Composite.addBody(balanceBucket, body);
    Composite.addBody(balanceBucket, rectA);
    Composite.addConstraint(balanceBucket, axelA);
    Composite.addConstraint(balanceBucket, axelB);

    //attaches balanceBucket to balance Beam
    Composite.addConstraint(balanceBucket, axelC);


    return balanceBucket;
};


//RIGHT BALANCE
World.add(engine.world, Composites.balanceBucket(400, 300, 100, -100));

//LEFT BALANCE
World.add(engine.world, Composites.balanceBucket(400, 300, -100, 100));


allBodies = [
  // bridge,
  mysteryBox,
  catapult,
  middleBar,

  Constraint.create({ bodyA: catapult, bodyB: middleBar, isStatic:true}),


];



var minus_L = 0;

for(var i=0; i<numBoxes_L; i++){

    stack[i] = (Bodies.rectangle(minus_L+200,minus_L+250,30,30));
    Body.setMass(stack[i], 1);
    allBodies.push(stack[i]);

    minus_L -= 30;

};

plus_R = 0;

for(var i=0; i<numBoxes_R; i++){

    stack[i] = (Bodies.rectangle(plus_R+600,plus_R+250,30,30));
    Body.setMass(stack[i], 1);
    allBodies.push(stack[i]);

    plus_R += 30;
};




// add bodies to the world
World.add(engine.world, allBodies);

// add some some walls to the world
var offset = 10;
World.add(engine.world, [

  Bodies.rectangle(400, -offset, 800 + 2 * offset, 50, { isStatic: true }),
  Bodies.rectangle(400, 600 + offset, 800 + 2 * offset, 50, { isStatic: true }),
  Bodies.rectangle(800 + offset, 300, 50, 600 + 2 * offset, { isStatic: true }),
  Bodies.rectangle(-offset, 300, 50, 600 + 2 * offset, { isStatic: true })



]);

//INPUT BELOW

var writeEq = function(){

        //Writes algebraic equation in console
        console.log("x + " + numBoxes_L + " = " + numBoxes_R);

        //Writes equation in HTML
        basicEq = '<p>HINT: x + '+ numBoxes_L + ' = ' + numBoxes_R + '</p>';
        var equation = document.getElementById('equation');
        $("<p>"+basicEq+"What does x equal?</p>").appendTo("#equation");

  };


//checks whether input is correct
var isCorrect = function(){


  var typedAnswer = parseInt($('#enterAnswer').find('input[name="typedAnswer"]').val());

  console.log(typedAnswer);

  if(typedAnswer === mysteryBox.mass){
    $("<p>You're right! The Mystery Box weighs  " + mysteryBox.mass + " lbs.</p>").appendTo('#answer');
    return true;
  }
  //******CANT FIGURE OUT HOW TO CHECK FOR BLANK********
  // else if(typedAnswer.isNaN() === false){
  //   $("<p>The field is blank. Don't worry if you get it wrong, you can always try again!</p>").appendTo('#answer');
  // }
  else{
    $("<p>Nope! The Mystery Box weighs  " + mysteryBox.mass + " lbs.</p>").appendTo('#answer');
    return false;
  }

};



// run the engine
Engine.run(engine);

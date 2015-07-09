//Please excuse the awful code. I'm testing things.

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


// var Svg = {};

// // (function() {

//     /**
//      * Converts an SVG path into an array of vector points.
//      * If the input path forms a concave shape, you must decompose the result into convex parts before use.
//      * See `Bodies.fromVertices` which provides support for this.
//      * Note that this function is not guaranteed to support complex paths (such as those with holes).
//      * @method pathToVertices
//      * @param {SVGPathElement} path
//      * @param {Number} [sampleLength=15]
//      * @return {Vector[]} points
//      */
//     Svg.pathToVertices = function(path, sampleLength) {
//         // https://github.com/wout/svg.topoly.js/blob/master/svg.topoly.js
//         var i, il, total, point, segment, segments, 
//             segmentsQueue, lastSegment, 
//             lastPoint, segmentIndex, points = [],
//             length = 0, x = 0, y = 0;

//         sampleLength = sampleLength || 15;

//         var addPoint = function(px, py, pathSegType) {
//             // all odd-numbered path types are relative except PATHSEG_CLOSEPATH (1)
//             var isRelative = pathSegType % 2 === 1 && pathSegType > 1;

//             // when the last point doesn't equal the current point add the current point
//             if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
//                 if (lastPoint && isRelative) {
//                     lx = lastPoint.x;
//                     ly = lastPoint.y;
//                 } else {
//                     lx = 0;
//                     ly = 0;
//                 }

//                 var point = {
//                     x: lx + px,
//                     y: ly + py
//                 };

//                 // set last point
//                 if (isRelative || !lastPoint) {
//                     lastPoint = point;
//                 }

//                 points.push(point);

//                 x = lx + px;
//                 y = ly + py;
//             }
//         };

//         var addSegmentPoint = function(segment) {
//             var segType = segment.pathSegTypeAsLetter.toUpperCase();

//             // skip path ends
//             if (segType === 'Z') 
//                 return;

//             // map segment to x and y
//             switch (segType) {

//             case 'M':
//             case 'L':
//             case 'T':
//             case 'C':
//             case 'S':
//             case 'Q':
//                 x = segment.x;
//                 y = segment.y;
//                 break;
//             case 'H':
//                 x = segment.x;
//                 break;
//             case 'V':
//                 y = segment.y;
//                 break;
//             }

//             addPoint(x, y, segment.pathSegType);
//         };

//         // ensure path is absolute
//         _svgPathToAbsolute(path);

//         // get total length
//         total = path.getTotalLength();

//         // queue segments
//         segments = [];
//         for (i = 0; i < path.pathSegList.numberOfItems; i += 1)
//             segments.push(path.pathSegList.getItem(i));

//         segmentsQueue = segments.concat();

//         // sample through path
//         while (length < total) {
//             // get segment at position
//             segmentIndex = path.getPathSegAtLength(length);
//             segment = segments[segmentIndex];

//             // new segment
//             if (segment != lastSegment) {
//                 while (segmentsQueue.length && segmentsQueue[0] != segment)
//                     addSegmentPoint(segmentsQueue.shift());

//                 lastSegment = segment;
//             }

//             // add points in between when curving
//             // TODO: adaptive sampling
//             switch (segment.pathSegTypeAsLetter.toUpperCase()) {

//             case 'C':
//             case 'T':
//             case 'S':
//             case 'Q':
//             case 'A':
//                 point = path.getPointAtLength(length);
//                 addPoint(point.x, point.y, 0);
//                 break;

//             }

//             // increment by sample value
//             length += sampleLength;
//         }

//         // add remaining segments not passed by sampling
//         for (i = 0, il = segmentsQueue.length; i < il; ++i)
//             addSegmentPoint(segmentsQueue[i]);

//         return points;
//     };

//     var _svgPathToAbsolute = function(path) {
//         // http://phrogz.net/convert-svg-path-to-all-absolute-commands
//         var x0, y0, x1, y1, x2, y2, segs = path.pathSegList,
//             x = 0, y = 0, len = segs.numberOfItems;

//         for (var i = 0; i < len; ++i) {
//             var seg = segs.getItem(i),
//                 segType = seg.pathSegTypeAsLetter;

//             if (/[MLHVCSQTA]/.test(segType)) {
//                 if ('x' in seg) x = seg.x;
//                 if ('y' in seg) y = seg.y;
//             } else {
//                 if ('x1' in seg) x1 = x + seg.x1;
//                 if ('x2' in seg) x2 = x + seg.x2;
//                 if ('y1' in seg) y1 = y + seg.y1;
//                 if ('y2' in seg) y2 = y + seg.y2;
//                 if ('x' in seg) x += seg.x;
//                 if ('y' in seg) y += seg.y;

//                 switch (segType) {

//                 case 'm':
//                     segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
//                     break;
//                 case 'l':
//                     segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
//                     break;
//                 case 'h':
//                     segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
//                     break;
//                 case 'v':
//                     segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
//                     break;
//                 case 'c':
//                     segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
//                     break;
//                 case 's':
//                     segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
//                     break;
//                 case 'q':
//                     segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
//                     break;
//                 case 't':
//                     segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
//                     break;
//                 case 'a':
//                     segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
//                     break;
//                 case 'z':
//                 case 'Z':
//                     x = x0;
//                     y = y0;
//                     break;

//                 }
//             }

//             if (segType == 'M' || segType == 'm') {
//                 x0 = x;
//                 y0 = y;
//             }
//         }
//     };

// // })();

//    // End src/geometry/Svg.js



// //ATTEMPT AT SVG MANIPULATION

// var putSvg = function(){
//   var svg = 'images/topbar.svg';

//         // $(data).find('path').each(function(i, path) 

//         var points = Svg.pathToVertices(10, 30);
//         vertexSets.push(Vertices.scale(points, 0.4, 0.4));
        

//         World.add(_world, Body.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
//           render: { fillStyle: color, strokeStyle: color}
//                       }, true));
//         };

// putSvg();


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

// var bridge = Composites.stack(150, 300, 9, 1, 10, 10, function(x, y, column, row) {
//   return Bodies.rectangle(x, y, 50, 20, { groupId: groupId });
// });

// Composites.chain(bridge, 0.5, 0, -0.5, 0, { stiffness: 0.9 });


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
     * @param {number} width
     * @param {number} height
     * @param {number} sideWidth (for side rectangle)
     * @param {number} sideHeight (for side rectangle)
     * @return {composite} A new composite balanceBucket
     */

//BASED OFF CAR COMPOSITE - For the irregular shaped buckets on the balance


Composites.balanceBucket = function(xx, yy, width, height, sideWidth, sideHeight, attachBeam, rectYOffset, axelAx) {
    var group = Body.nextGroup(true),
        rectBase = -30;
        // rectAOffset = -width * 1.2 + rectBase,
        // rectBOffset = width * 1.2 - rectBase,
        // rectYOffset = 10;

    var balanceBucket = Composite.create({ label: 'balanceBucket' }),
        body = Bodies.rectangle(xx+10, yy+200, width, height, { 
            collisionFilter: {
                group: group
            },
            // friction: 0.01,
            chamfer: {
                radius: 4,
            mass: 1
            }
        });

    var rectA = Bodies.rectangle(xx + 0, yy + 75, sideWidth, sideHeight, { 
        collisionFilter: {
            group: group
        }, mass: 1
        // restitution: 0.5, 
        // friction: 0.9,
        // frictionStatic: 10,
        // slop: 0.5,
        // density: 0.01
    });
                
    // var rectB = Bodies.rectangle(xx + 100, yy + 100, sideWidth, sideHeight, { 
    //     collisionFilter: {
    //         group: group
    //     }
    //     // restitution: 0.5, 
    //     // friction: 0.9,
    //     // frictionStatic: 10,
    //     // slop: 0.5,
    //     // density: 0.01
    // });


   
                
    var axelA = Constraint.create({
        bodyA: body,
        pointA: { x: axelAx, y: rectYOffset },
        bodyB: rectA,
        stiffness: 1
    });
                    
    var axelB = Constraint.create({
        bodyA: body,
        pointA: { x: attachBeam, y: rectYOffset },
        bodyB: rectA,
        stiffness: 1
    });

    var axelC = Constraint.create({
        bodyA: catapult,
        pointA: { x: attachBeam, y: 0 },
        bodyB: rectA,
        stiffness: 0
    });



    
    Composite.addBody(balanceBucket, body);
    Composite.addBody(balanceBucket, rectA);
    //Composite.addBody(balanceBucket, rectB);
    Composite.addConstraint(balanceBucket, axelA);
    Composite.addConstraint(balanceBucket, axelB);
    
    //attaches balanceBucket to balance Beam
    Composite.addConstraint(balanceBucket, axelC);


    return balanceBucket;
};


//Bucket
// var scale = 0.8;

//xx, yy, width, height, sideWidth, sideHeight, attachBeam, rectYOffset, axelAx

//RIGHT BALANCE
World.add(engine.world, Composites.balanceBucket(400, 300, 200, 20, 20, 20, 100, 0, -100));


//World.add(engine.world, Composites.car(150, 100, 100 * scale, 40 * scale, 30 * scale));

//LEFT BALANCE
World.add(engine.world, Composites.balanceBucket(400, 300, 200, 20, 20, 20, -100, 0, 100));


// var balanceConstraint = Constraint.create({ bodyA: catapult, pointB: {x:250, y:300}});

allBodies = [
  // bridge,
  mysteryBox,
  catapult,
  middleBar,

  Constraint.create({ bodyA: catapult, bodyB: middleBar, isStatic:true}),

  
  // Constraint.create({ bodyA: catapult, bodyB: middleBar, isStatic:false })
  //middle point of pivot
  // Composite.addConstraint(mysteryBox, balanceConstraint)
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
        
        
        
        //Writes equation in console
        console.log("x + " + numBoxes_L + " = " + numBoxes_R);

        basicEq = '<p>x + '+ numBoxes_L + ' = ' + numBoxes_R + '</p>';

        //WHY ISN'T JQUERY WORKING HERE? 

        // $(basicEq).appendTo('#equation');
        // $(function () {
        //   $('<p>'+basicEq+'</p>').appendTo('#equation');
        // });

        var equation = document.getElementById('equation');
        // equation.append(basicEq);
        
        // $(basicEq).appendTo('#equation');
        // $(function () {
        //   $('<p>'+basicEq+'</p>').appendTo('#equation');
        // });
       
      
  };


    writeEq();


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




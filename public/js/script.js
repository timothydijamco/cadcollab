var key = Math.round(Math.random()*9999);
var name = key;

var socket = io();
// Set up stages
var stageWidth = $("#topViewContainer").width();
var stageHeight = $("#topViewContainer").height();
var topViewStage = new Konva.Stage({
   container: 'topViewContainer',
   width: stageWidth,
   height: stageHeight
});
var isometricViewStage = new Konva.Stage({
   container: "isometricViewContainer",
   width: stageWidth,
   height: stageHeight
});
var frontViewStage = new Konva.Stage({
   container: "frontViewContainer",
   width: stageWidth,
   height: stageHeight
});
var rightViewStage = new Konva.Stage({
   container: "rightViewContainer",
   width: stageWidth,
   height: stageHeight
});

// Set up layers
var topViewLayer = new Konva.Layer();
var isometricViewLayer = new Konva.Layer();
var frontViewLayer = new Konva.Layer();
var rightViewLayer = new Konva.Layer();
topViewStage.add(topViewLayer);
frontViewStage.add(frontViewLayer);
rightViewStage.add(rightViewLayer);

// Elements
var elements = [];
function findElement(elementName) {
   for (var i = 0; i < elements.length; i++) {
      if (elements[i].name == elementName) {
         return elements[i];
      }
   }
}

// Test
var testMetal= new Element("testElement", "AlumC_2_25");
var testMetal2 = new Element("testElement2", "AlumC_2_25");
var testMotor = new Element("testMotor", "Motor393");
var testWheel = new Element("testWheel", "OmniWheel");
var testAxle = new Element("testAxle", "Driveshaft");
elements.push(testMetal);
elements.push(testMetal2);
elements.push(testMotor);
elements.push(testWheel);
elements.push(testAxle);
setTimeout(function() {
   updateZIndices();
},500);


socket.on('move', function(data) { // If we get this event, then the owner of the shape has dragged the shape
   var element = findElement(data.elementName);
   element.owner = data.senderKey;
   element.ownerName = data.senderName;

   if (element.owner != key) {
      switch (data.side) {
         case "top":
            element.position.x = data.pos.x;
            element.position.y = stageHeight - data.pos.y;

            element.front.updatePos();
            element.right.updatePos();
            break;
         case "front":
            element.position.x = data.pos.x;
            element.position.z = stageHeight - data.pos.y;

            element.top.updatePos();
            element.right.updatePos();
            break;
         case "right":
            element.position.y = data.pos.x + element.right.shape.width();
            element.position.z = stageHeight - data.pos.y;

            element.top.updatePos();
            element.front.updatePos();
            break;
      }
      element[data.side].shape.x(data.pos.x);
      element[data.side].shape.y(data.pos.y);
      updateZIndices();

      if (element.ownerName == null) {
         element.ownerName = data.senderName;
      }
      element.updateAllNametags();
   }

   topViewLayer.batchDraw();
   frontViewLayer.batchDraw();
   rightViewLayer.batchDraw();
});
socket.on('moveEnd', function(data) {// If we get this event, then the legal owner of the shape stopped dragging
   var element = findElement(data.elementName);
   element.owner = -1;
   element.ownerName = null;
   element.updateAllNametags();
   topViewLayer.batchDraw();
   frontViewLayer.batchDraw();
   rightViewLayer.batchDraw();
});

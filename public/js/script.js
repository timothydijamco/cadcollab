var key = Math.round(Math.random()*9999);
var name = key;

var socket = io();
// Set up stages
var topViewStage = new Konva.Stage({
   container: 'container',
   width: 600,
   height: 400
});
var isometricViewStage = new Konva.Stage({
   container: "isometricViewContainer",
   width: 600,
   height: 400
});
var frontViewStage = new Konva.Stage({
   container: "frontViewContainer",
   width: 600,
   height: 400
});
var rightViewStage = new Konva.Stage({
   container: "rightViewContainer",
   width: 600,
   height: 400
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
var testElement = new Element("testElement", "AlumC_2_25");
elements.push(testElement);
//var myNametag = new Nametag(name);
//myNametag.group.hide();


// Events from others
//socket.on('moveStart', function(data) { // If we get this event, then someone legally took ownership of shape
   //var element = findElement(data.shapeId); // Find shape
   //topViewLayer.draw();
   //element.owner = data.senderKey;
   //data.element.owner = data.senderKey;
//});
socket.on('move', function(data) { // If we get this event, then the owner of the shape has dragged the shape
   // var element = findElement(data.shapeId); // Find shape
   // element.shape.x(data.pos.x);
   // element.shape.y(data.pos.y);
   //
   // if (element.ownerNametag == null) {
   //    element.ownerNametag = new Nametag(data.senderName);
   //    element.ownerNametag.group.show();
   // }
   // if (element.shape.getClassName() == "Circle") {
   //    element.ownerNametag.group.x(data.pos.x - element.ownerNametag.background.width()/2);
   //    element.ownerNametag.group.y(data.pos.y - element.shape.height()/2 - element.ownerNametag.background.height() - 10);
   // } else {
   //    element.ownerNametag.group.x(data.pos.x + (element.shape.width() - element.ownerNametag.background.width())/2);
   //    element.ownerNametag.group.y(data.pos.y - element.ownerNametag.background.height() - 10);
   // }
   // element.statedPos = data.pos;
   // topViewLayer.batchDraw();
   // element.owner = data.senderKey;
   var element = findElement(data.elementName);
   element.owner = data.senderKey;
   element.ownerName = data.senderName;

   if (element.owner != key) {
      switch (data.side) {
         case "top":
            element.position.x = data.pos.x;
            element.position.y = data.pos.y;

            element.front.updatePos();
            element.right.updatePos();
            break;
         case "front":
            element.position.x = data.pos.x;
            element.position.z = data.pos.y;

            element.top.updatePos();
            element.right.updatePos();
            break;
         case "right":
            element.position.y = data.pos.x;
            element.position.z = data.pos.y;

            element.top.updatePos();
            element.front.updatePos();
            break;
      }
      element[data.side].shape.x(data.pos.x);
      element[data.side].shape.y(data.pos.y);

      if (element.ownerName == null) {
         element.ownerName = data.senderName;
      }
      element.updateAllNametags();
   }

   //element.statedPos = data.pos;
   topViewLayer.batchDraw();
   frontViewLayer.batchDraw();
   rightViewLayer.batchDraw();
});
socket.on('moveEnd', function(data) {// If we get this event, then the legal owner of the shape stopped dragging
   // var element = findElement(data.shapeId); // Find shape
   // element.ownerNametag.group.hide();
   // element.ownerNametag = null;
   // topViewLayer.draw();
   // element.owner = -1; // Set owner to no owner

   var element = findElement(data.elementName);
   element.owner = -1;
   element.ownerName = null;
   element.updateAllNametags();
   topViewLayer.batchDraw();
   frontViewLayer.batchDraw();
   rightViewLayer.batchDraw();
});

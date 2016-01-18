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

// Elements
var elements = [];
function findElement(shapeId) {
   for (var i = 0; i < elements.length; i++) {
      if (elements[i].shape.getId() == shapeId) {
         return elements[i];
      }
   }
}

// Test
var testElement = new Element(new Konva.Circle({
   x: 50,
   y: 50,
   radius: 20,
   fill: 'red',
   stroke: 'black',
   strokeWidth: 3,
   id: 'testShape'
}));
var testElement2 = new Element(new Konva.Rect({
   x: 100,
   y: 120,
   width: 38,
   height: 80,
   fill: '#7766DD',
   stroke: 'blue',
   strokeWidth: 1,
   id: 'testShape2'
}));
elements.push(testElement);
elements.push(testElement2);

var myNametag = new Nametag(name);
myNametag.group.hide();

topViewLayer.draw();

// Events from others
socket.on('moveStart', function(data) { // If we get this event, then someone legally took ownership of shape
   var element = findElement(data.shapeId); // Find shape
   if (element.owner == key) {
      element.ownerNametag = myNametag;
   } else {
      console.log("moveStart from " + data.senderName);
      element.ownerNametag = new Nametag(data.senderName);
   }
   element.ownerNametag.group.show();
   topViewLayer.draw();
   element.owner = data.senderKey;
});
socket.on('move', function(data) { // If we get this event, then the owner of the shape has dragged the shape
   var element = findElement(data.shapeId); // Find shape
   element.shape.x(data.pos.x);
   element.shape.y(data.pos.y);

   if (element.shape.getClassName() == "Circle") {
      element.ownerNametag.group.x(data.pos.x - element.ownerNametag.background.width()/2);
      element.ownerNametag.group.y(data.pos.y - element.shape.height()/2 - element.ownerNametag.background.height() - 10);
   } else {
      element.ownerNametag.group.x(data.pos.x + (element.shape.width() - element.ownerNametag.background.width())/2);
      element.ownerNametag.group.y(data.pos.y - element.ownerNametag.background.height() - 10);
   }
   element.statedPos = data.pos;
   topViewLayer.batchDraw();
   element.owner = data.senderKey;
});
socket.on('moveEnd', function(data) {// If we get this event, then the legal owner of the shape stopped dragging
   var element = findElement(data.shapeId); // Find shape
   element.ownerNametag.group.hide();
   topViewLayer.draw();
   element.owner = -1; // Set owner to no owner
});

function buildSide(parent, side, image_prefix_side) {
   var image = new Image();
   image.src = "img/"+image_prefix_side+"_a.png";
   image.onload = function() {
      console.log(stageWidth/6000);
      parent[side] = new Side(new Konva.Image({
         x: 10,
         y: 10,
         image: image,
         width: (this.width*stageWidth)/6000,
         height: (this.height*stageWidth)/6000,
         id: "" + Math.round(Math.random()*999999)
      }), side, parent);
      console.log("x: " + parent[side].shape.x() + ", y: " + parent[side].shape.y());
      console.log("h: " + parent[side].shape.height() + ", w: " + parent[side].shape.width());
   }
}

var Element = function(name, image_prefix) {
   this.name = name;
   this.owner = -1;
   this.ownerName;
   this.position = {x: 10, y: stageHeight-10, z: stageHeight-10};

   this.top, this.front, this.right;
   buildSide(this, "top", image_prefix+"_top");
   buildSide(this, "front", image_prefix+"_front");
   buildSide(this, "right", image_prefix+"_side");

   this.updateAllPos = function() {
      this.top.updatePos();
      this.front.updatePos();
      this.right.updatePos();
   }

   this.updateAllNametags = function() {
      this.top.updateNametag();
      this.front.updateNametag();
      this.right.updateNametag();
   }
}
var limitedFrequencyEmit = new LimitedFrequencyEmit(25);
var Side = function(konvaObj, side, parent) {
   this.element = parent;
   console.log("creating Side: " + side + parent.name);
   this.shape = konvaObj;
   this.side = side; // top, front, or right

   this.shape.element = this.element;
   this.shape.side = this.side;

   switch (this.side) {
      case "top":
         this.layer = topViewLayer;
         break;
      case "front":
         this.layer = frontViewLayer;
         break;
      case "right":
         this.layer = rightViewLayer;
         break;
   }
   this.ownerNametag = new Nametag(this.layer);
   this.ownerNametag.group.hide();

   this.layer.add(this.shape);
   this.layer.draw();

   // End constructor

   this.updatePos = function() {
      switch (this.side) {
         case "top":
            this.shape.x(this.element.position.x);
            this.shape.y(stageHeight - this.element.position.y);
            //this.shape.setZIndex(this.element.position.z);
            break;
         case "front":
            this.shape.x(this.element.position.x);
            this.shape.y(stageHeight - this.element.position.z);
            //this.shape.setZIndex(this.element.position.y);
            break;
         case "right":
            this.shape.x(this.element.position.y-this.shape.width());
            this.shape.y(stageHeight - this.element.position.z);
            //this.shape.setZIndex(this.element.position.x+this.element.front.shape.width());
            break;
      }
      this.layer.draw();
   };
   setTimeout(function() {
      console.log("yes.");
      this.updatePos();
   }.bind(this), 100);

   this.updateNametag = function() {
      if (this.element.ownerName) {
         this.ownerNametag.updateName(this.element.ownerName);
         this.ownerNametag.group.show();
         this.ownerNametag.group.x(this.shape.x() + (this.shape.width() - this.ownerNametag.background.width())/2);
         this.ownerNametag.group.y(this.shape.y() - this.ownerNametag.background.height() - 10);
      } else {
         this.ownerNametag.group.hide();
      }
   }

   this.shape.setAttr('draggable', true);
   this.shape.setAttr('dragBoundFunc', function(pos) {
      //var element = findElement(this.getId());
      if (this.element.owner == key || this.element.owner == -1) {
         this.element.owner = key;
         this.element.updateAllNametags();
         switch (this.side) {
            case "top":
               this.element.position.x = pos.x;
               this.element.position.y = stageHeight - pos.y;

               this.element.front.updatePos();
               this.element.right.updatePos();
               frontViewLayer.batchDraw();
               rightViewLayer.batchDraw();
               break;
            case "front":
               this.element.position.x = pos.x;
               this.element.position.z = stageHeight - pos.y;

               this.element.top.updatePos();
               this.element.right.updatePos();
               topViewLayer.batchDraw();
               rightViewLayer.batchDraw();
               break;
            case "right":
               this.element.position.y = pos.x + this.width();
               this.element.position.z = stageHeight - pos.y;

               this.element.top.updatePos();
               this.element.front.updatePos();
               topViewLayer.batchDraw();
               frontViewLayer.batchDraw();
               break;
         }
         limitedFrequencyEmit.tryEmit('move', {senderKey: key, senderName: name, elementName: this.element.name, pos: pos, side: side});
         return pos;
      } else { // Otherwise, set the shape position to the whatever the owner says the position is
         return {x: this.x(), y: this.y()};
      }
   });

   this.shape.on('dragend', function() {
      //var element = findElement(this.getId());
      if (this.element.owner == key) { // If we own shape
         socket.emit('moveEnd', {senderKey: key, senderName: name, elementName: this.element.name});
      }
   });
}

function LimitedFrequencyEmit(interval) {
   this.interval = interval
   this.lastCall = 0;

   this.tryEmit = function(name, data) {
      var now = Date.now();
      if (this.lastCall + this.interval < now) {
         this.lastCall = now;
         socket.emit(name,data);
         updateZIndices();
      }
   }
}

function updateZIndices() {
   var topOrder = [];
   var frontOrder = [];
   var rightOrder = [];
   for (var i = 0; i < elements.length; i++) {
      topOrder.push(i);
      frontOrder.push(i);
      rightOrder.push(i);
   }
   for (var i = 1; i < topOrder.length; i++) {
      for (var j = i; j > 0; j--) {
         if (elements[topOrder[j]].position.z < elements[topOrder[j-1]].position.z) {
            var tempLeft = topOrder[j-1];
            topOrder[j-1] = topOrder[j];
            topOrder[j] = tempLeft;
         } else {
            break;
         }
      }
   }
   for (var i = 1; i < frontOrder.length; i++) {
      for (var j = i; j > 0; j--) {
         if (elements[frontOrder[j]].position.y-elements[frontOrder[j]].top.shape.height() > elements[frontOrder[j-1]].position.y-elements[frontOrder[j-1]].top.shape.height()) {
            var tempLeft = frontOrder[j-1];
            frontOrder[j-1] = frontOrder[j];
            frontOrder[j] = tempLeft;
         } else {
            break;
         }
      }
   }
   for (var i = 1; i < rightOrder.length; i++) {
      for (var j = i; j > 0; j--) {
         if (elements[rightOrder[j]].position.x+elements[rightOrder[j]].top.shape.width() < elements[rightOrder[j-1]].position.x+elements[rightOrder[j-1]].top.shape.width()) {
            var tempLeft = rightOrder[j-1];
            rightOrder[j-1] = rightOrder[j];
            rightOrder[j] = tempLeft;
         } else {
            break;
         }
      }
   }
   for (var i = 0; i < topOrder.length; i++) {
      elements[topOrder[i]].top.shape.setZIndex(i+2);
   }
   for (var i = 0; i < frontOrder.length; i++) {
      elements[frontOrder[i]].front.shape.setZIndex(i+2);
   }
   for (var i = 0; i < rightOrder.length; i++) {
      elements[rightOrder[i]].right.shape.setZIndex(i+2);
   }
}

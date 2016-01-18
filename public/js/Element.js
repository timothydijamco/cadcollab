var Element = function(konvaObj) {
   this.shape = konvaObj;
   this.owner = -1;
   this.ownerNametag;
   this.statedPos = {x: 0, y: 0};
   topViewLayer.add(this.shape);

   this.shape.setAttr('draggable', true);
   this.shape.setAttr('dragBoundFunc', function(pos) {
      var element = findElement(this.getId());
      if (element.owner == key || element.owner == -1) {
         socket.emit('move', {senderKey: key, senderName: name, pos: pos, shapeId: element.shape.getId()});
         return pos;
      } else { // Otherwise, set the shape position to the whatever the owner says the position is
         return element.statedPos;
      }
   });

   this.shape.on('dragstart', function() {
      var element = findElement(this.getId());
      if (element.owner == key || element.owner == -1) { // If we own shape or no one owns shape
         element.owner = key;
         socket.emit('moveStart', {senderKey: key, senderName: name, shapeId: element.shape.getId()});
      }
   });
   this.shape.on('dragend', function() {
      var element = findElement(this.getId());
      if (element.owner == key) { // If we own shape
         socket.emit('moveEnd', {senderKey: key, senderName: name, shapeId: element.shape.getId()});
      }
   });
}

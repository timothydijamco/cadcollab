var Nametag = function(layer) {
   this.text = new Konva.Text({
      x: 0,
      y: 2,
      width: 70,
      text: "",
      fontSize: 15,
      fontFamily: 'Verdana',
      align: "center",
      fill: "white"
   });
   this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: 70,
      height: 21,
      fill: 'black',
      opacity: 0.5
   });
   this.group = new Konva.Group({
      x: 0,
      y: 0
   });
   this.group.add(this.background);
   this.group.add(this.text);
   layer.add(this.group);

   // End constructor
   this.updateName = function(name) {
      this.text.setAttr("text", name);
   }
}

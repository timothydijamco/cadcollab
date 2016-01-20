var Nametag = function(layer) {
   console.log(layer);
   this.text = new Konva.Text({
      x: 0,
      y: 0,
      text: "",
      fontSize: 15,
      fontFamily: 'Verdana',
      fill: "white"
   });
   this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: 40,
      height: 17,
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

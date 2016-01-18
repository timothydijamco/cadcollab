var Nametag = function(name) {
   this.text = new Konva.Text({
      x: 0,
      y: 0,
      text: name,
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
   topViewLayer.add(this.group);
}

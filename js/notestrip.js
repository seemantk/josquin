function NoteStrip() {
  /*
  ** Private Variables
  */
  var canvases = d3.map()
    , data
    , width
    , height
    , x = d3.scaleLinear()
    , y = d3.scaleBand()
    , colorScale
    , noteWidth = 10
    , noteHeight = 10
    , cornerRadius = 5
    , target // default target on screen on which to copy
  ;
  /*
  ** Main Function Object
  */
  function my() {
      width = noteWidth * data.scorelength[0];
      height = noteHeight * (data.maxpitch.b7 - data.minpitch.b7);
      x
          .domain([0, data.scorelength[0]])
          .range([0, width])
      ;
      y
          .domain(d3.range(data.minpitch.b7, data.maxpitch.b7 + 1))
          .rangeRound([height, 0])
      ;

      d3.selectAll("canvas")
          .data(data.partdata, function(d) { return d.partindex; })
        .enter().each(function(d) {
            var cnv = d3.select(document.createElement("canvas"))
                .attr("width", width)
                .attr("height", height)
              .node()
            ;
            draw(cnv, d);
            canvases.set(data.partnames[d.partindex], cnv);
        })
      ;
  } // Main Function Object

  /*
  ** Helper Functions
  */
  function draw(cnv, voice) {
      var ctx = cnv.getContext('2d', { preserveDrawingBuffer: true })
        , color = colorScale(data.partnames[voice.partindex])
      ;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = rgba(color, 0.4);
      ctx.strokeStyle = rgba(color, 1);
      ctx.lineJoin = "round";
      ctx.lineWidth = cornerRadius;
      voice.notedata.forEach(function(d) {
          var rx = x(d.starttime[0]) + cornerRadius/2
            , ry = y(d.pitch.b7) + cornerRadius/2
            , rw = noteWidth * d.duration[0] - cornerRadius
            , rh = noteHeight - cornerRadius
          ;
          //  From: http://jsfiddle.net/robhawkes/ghcjt/
          ctx.fillRect(rx, ry, rw, rh);
          ctx.strokeRect(rx, ry, rw, rh);
        })
      ;
  } // draw()

  function rgba(color, opacity) {
      var rgb = d3.rgb(color);
      return 'rgba('
        + rgb.r + ',' + rgb.g + ',' + rgb.b + ','
        + (opacity ? '0.5' : '0.9')
        +')'
      ;
  } // rgba()

  function render(voices) {
      voices.forEach(function(v) {
          var ctx = target.getContext('2d', { preserveDrawingBuffer: true });
          ctx.drawImage(
              canvases.get(v)
              , 0, 0, width, height
              , margin.left, margin.top
              , target.width - margin.left - margin.right
              , target.height - margin.top - margin.bottom
            )
          ;
        })
      ;
  } // render()

  /*
  ** API: Getter/Setter Functions
  */
  my.data = function(value) {
      if(!arguments.length) return data;
      data = value;
      return my;
    } // my.data()
  ;

  /*
  ** API: Getter/Setter Functions
  */
  my.colorScale = function (value){
      if(!arguments.length) return colorScale;
      colorScale = value;
      return my;
    } // my.colorScale()
  ;
  my.canvas = function (value){ // name makes more sense for public part
      if(!arguments.length) return target; // name makes more sense for pvt
      target = value;
      return my;
    } // my.canvas()
  ;
  my.render = function (){
      var opt = arguments[0] || {};
      render(opt.voices || data.partnames);
      return my;
    } // my.render()
  ;
  // This is always the last thing returned
  return my;
} // NoteStrip()

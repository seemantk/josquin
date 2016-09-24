function NoteStrip() {
  /*
  ** Private Variables
  */
  var canvases = {}
    , data
    , width
    , height
    , x = d3.scaleLinear()
    , y = d3.scaleBand()
    , colors
    , noteWidth = 10
    , noteHeight = 10
    , cornerRadius = 5
    , target // default target on screen on which to copy
  ;
  /*
  ** Main Function Object
  */
  function my() {
      x
          .domain([0, data.scorelength[0]])
          .range([0, noteWidth * scorelength[0]])
      ;
      y
          .domain(d3.range([data.minpitch.b7, data.maxpitch.b7]))
          .rangeRound([0, noteHeight * (data.maxpitch.b7 - data.minpitch.b7)])
      ;
      width = x.range()[1];
      height = y.range()[1];

      if(!d3.keys(canvases).length) {
          data.partnames.forEach(function(voice) {
              var cnv = document.createElement("canvas");
              cnv.width = width;
              cnv.height = height;
              var ctx = cnv.getContext('2d', { preserveDrawingBuffer: true });
              canvases[voice] = ctx;
            })
          ;
      }
  } // Main Function Object

  /*
  ** Helper Functions
  */
  function draw() {
      context.forEach(function(ctx, index) {
          var color = colorScale(data.partnames[index]);
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = rgba(color, 0.5);
          ctx.strokeStyle = rgba(color, 1)
          ctx.lineJoin = "round";
          ctx.lineWidth = cornerRadius;
          data.partdata[index].forEach(function(d) {
              rx = x(d.time);
              ry = y(d.pitch);
              rw = noteWidth * d.duration;
              //  From: http://jsfiddle.net/robhawkes/ghcjt/
              ctx.strokeRect(
                  rx + (cornerRadius/2), ry + (cornerRadius/2)
                , rw - cornerRadius, noteHeight - cornerRadius
              );
              ctx.fillRect(
                  rx + (cornerRadius/2), ry + (cornerRadius/2)
                , rw - cornerRadius, noteHeight - cornerRadius
              );
          })
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

  function render(context, voices, extent) {
      voices.forEach(function(voice) {
          context.drawImage(
              canvases[voice]
            , extent[0]
            , extent[1]
          );
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
  my.colors = function (value){
      if(!arguments.length) return colors;
      colors = value;
      return my;
    } // my.colorScale()
  ;
  my.target = function (value){
      if(!arguments.length) return target;
      target = value;
      return my;
    } // my.target()
  ;
  my.render() {
      var target = arguments[0] || target
        , opt = arguments[1] || {}
        , voices = opt.voices || data.partnames
        , extent = opt.extent || {}
        , extent.x = opt.extent.x || x.domain()
        , extent.y = opt.extent.y || y.domain()
      ;
      render(target, voices, extent);
      return my;
    } // my.render()
  ;
  // This is always the last thing returned
  return my;
} // NoteStrip()

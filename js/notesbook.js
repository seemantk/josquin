function NotesBook() {
  /*
  ** Private Variables
  */
  var svg, data
    , width
    , height
    , perspectives = ["full", "zoom"]
    , yScale = d3.scaleBand()
    , colorScale
    , dispatch
    , tooltip
    , canvases = []
    , separate = false
    , showExtremeNotes = false
  ;

  /*
  ** Main Function Object
  */
  function my(selection) {
      svg = selection;
      data = svg.datum();
      svg.selectAll(".notes-g")
          .data(data)
        .enter().append("g")
          .each(function(d) {
              var self = d3.select(this);
              canvases.push({
                    key: d.key
                  , canvas: NotesCanvas()
                      .colorScale(colorScale)
                      .showExtremeNotes(showExtremeNotes)
                  , selection: self
              });
              self
                  .call(canvases[canvases.length - 1].canvas)
              ;
            })
      ;
      yScale
          .domain(data.map(function(d) { return d.key; }))
          .rangeRound([0, height])
      ;
  } // my() - Main function object

  /*
  ** Helper Functions
  */
  function hilite(arg) {
      var emphasize = arg && arg.emphasize;

      canvases.forEach(function(c) {
          c.canvas.hilite(arg);
        })
      ;
  } // hilite()

  function update() {
      var transforms = { true: 0, false: 0 }
        , h = separate ? yScale.bandwidth() : height
      ;
      canvases.forEach(function(c) {
          transforms.true = yScale(c.key);
          c.canvas
              .height(h)
              .update()
          ;
          c.selection
            .transition()
              .attr("transform", "translate(0," +  transforms[separate] + ")")
          ;
        })
      ;
  } // update()


  /*
  ** API (Getter/Setter) Functions
  */
  my.tooltip = function(value) {
      if(!arguments.length) return tooltip;

      tooltip = value;
      return my;
    } // my.tooltip()
  ;
  my.colorScale = function(value) {
      if(arguments.length === 0) return colorScale;
      colorScale = value;
      return my;
    } // my.colorScale()
  ;
  my.width = function(value) {
      if(arguments.length === 0) return width;

      width = value;

      return my;
    } // my.width()
  ;
  my.height = function(value) {
      if(arguments.length === 0) return height;

      height = value;

      yScale.rangeRound([height, 0]);

      return my;
    } // my.height()
  ;
  ;
  my.connect = function(value) {
      if(!arguments.length) return dispatch;

      dispatch = value;
      return my;
    } // my.connect()
  ;
  my.zoom = function(value, stop) {
      if(!arguments.length) return zoom;

      canvases.forEach(function(c) {
          c.canvas.zoom(value, stop);
      });
      return my;
    } // my.zoom()
  ;
  my.hilite = function(value) {
      if(!arguments.length)
          hilite();
      else
          hilite(value);

      return my;
    } // my.hilite()
  ;
  my.separate = function(value) {
      if(!arguments.length) return separate;

      separate = value;
      update();

      return my;
    } // my.separate()
  ;

  my.showExtremeNotes = function(value) {
      if(!arguments.length)
          return showExtremeNotes;
      else {
          showExtremeNotes = value;
          canvases.forEach(function(c) {
              c.canvas.showExtremeNotes(value);
          });
      }

      return my;
    } // my.showExtremeNotes()
  ;

  // This is always the last thing returned
  return my;
} // NotesBook()

function NotesBook() {
  /*
  ** Private Variables
  */
  var container, svg, canvas, artist
    , data
    , width
    , height
    , margin = { top: 20, right: 20, bottom: 20, left: 20 }
    , scale = {
          voice: d3.scaleBand()
          , barlines: d3.scaleLinear()
        }
    , domain = { x: [], y: [] } // Store the aggregate domains for all strips
    , tooltip = d3.tip()
          .attr("class", "d3-tip")
          .html(function(d) { return d.note; })
    , canvases = []
    , display = {
          separate: false // show each note strip separately
          , hilite:   false // one set of notes is visible
          , zoom:     false // indicates an active brush
          , extremes: false // hilite the maximum and minimum pitches
        }
    , barlinesAxis = d3.axisTop()
    , barlines
    , bars
    , measuresAxis = d3.axisBottom()
    , measures
    , mensurationCodes = {
            "O": ""
          , "O|": ""
          , "O|.": ""
          , "C.": ""
          , "C": ""
          , "Cr": ""
          , "C|.": ""
          , "C|": ""
          , "C|r": ""
        }
    , mensurationsAxis = d3.axisTop()
    , mensurations
    , dispatch
  ;

  /*
  ** Main Function Object
  */
  function my() {
      canvas = container.selectAll("canvas")
          .data([1], function(d) { return d; })
        .enter().append("canvas")
      ;
      svg = container.selectAll("svg")
          .data([1], function(d) { return d; })
        .enter().append("svg")
      ;
      var g = svg.selectAll("g").data([1]);
      g = g.enter().append("g").merge(g);
      bars = data.barlines.map(function(b) { return b.time[0]; });

      domain.x = [0, data.scorelength[0]];
      domain.y = d3.range(
            data.minpitch.b7
          , data.maxpitch.b7
        )
      ;
      scale.voice.domain(data.partnames);
      scale.barlines.domain(domain.x);

      size();

      g.attr("transform", "translate("+ margin.left +","+ margin.top +")");
      height = height - margin.top - margin.bottom;
      width = width - margin.left - margin.right;

      barlinesAxis
          .scale(scale.barlines)
          .tickValues(bars)
          .tickSize(-height);
      ;
      barlines = g
        .append("g")
          .attr("class", "barlines")
          .call(barlinesAxis)
      ;
      measuresAxis
          .scale(scale.barlines)
          .tickSize(0) // no ticklines only tick labels
      ;
      measures = g
        .append("g")
          .attr("class", "measures")
          .attr("transform", "translate(0," + height + ")")
          .call(measuresAxis)
      ;
      mensurationsAxis
          .scale(scale.barlines)
          .tickSize(0)
      ;
      mensurations = g
        .append("g")
          .attr("class", "mensuration")
          .call(mensurationsRender)
      ;
      g
        .append("g")
          .attr("class", "notesbook")
        .selectAll(".notes-g")
          .data(data.notes.entries())
        .enter().append("g")
          .each(function(d) {
              var self = d3.select(this).call(tooltip);
              // canvases
              //     .push({
              //           key: d.key
              //         , canvas: NotesCanvas()
              //             .extremes(display.extremes)
              //             .tooltip(tooltip)
              //             .width(width)
              //             .height(height)
              //             .showReflines(canvases.length === 0)
              //         , selection: self
              //       })
              // ;
              // self
              //     .call(canvases[canvases.length - 1].canvas)
              // ;
            })
      ;
      update();
  } // my() - Main function object

  /*
  ** Helper Functions
  */
  function size() {
    width = parseInt(container.style("width"));
    height = parseInt(container.style("height"));
    scale.voice.rangeRound([0, height]);
    canvas
        .attr("width", width)
        .attr("height", height)
    ;
    svg
        .attr("width", width)
        .attr("height", height)
    ;
    scale.voice.rangeRound([0, height]);
    scale.barlines.range([0, width]);
  } // size()

  function update() {
      var matched = -1;
      // canvases.forEach(function(c, i) {
      //     var transform = 0
      //       , h = height
      //       , z = display.zoom || domain
      //       , hilited = (c.key === display.hilite)
      //     ;
      //     if(display.hilite) {
      //         // only change if this is a match
      //         matched = hilited ? i : matched;
      //         if(display.separate) {
      //             if(matched !== i) { // we're not the matched one
      //                 h = 0;
      //                 transform = (matched === -1)
      //                   ? 0      // above the yet to be found matched frame,
      //                   : height // or below the already found one
      //                 ;
      //             }
      //         }
      //     } else { // if no hilite
      //         if(display.separate) {
      //             h = scale.voice.bandwidth();
      //             transform = scale.voice(c.key);
      //         }
      //     }
      //     c.canvas
      //         .height(h)
      //         .zoom(z)
      //         .state(hilited || !display.hilite)
      //         .showReflines(display.separate ? (hilited || !display.hilite) : (i === 0))
      //         .update()
      //     ;
      //     c.selection
      //       .transition()
      //         .attr("transform", "translate(0," + transform + ")")
      //     ;
      //   })
      ;
      artist.canvas(canvas.node()).render();
      barlinesAxis
          .scale(scale.barlines)
          .tickValues(bars)
      ;
      barlines.call(barlinesAxis);
      measures.call(measuresAxis.scale(scale.barlines));
  } // update()

  function mensurationsRender(selection) {
      selection
          .call(mensurationsAxis)
        .selectAll(".tick")
          .each(function(d, i) {
              var self = d3.select(this)
                , sym = data.barlines[i].mensuration
              ;
              self.select("text")
                  .text(mensurationCodes[sym] || null)
              ;
            })
      ;
  } // mensurationsRender()


  /*
  ** API (Getter/Setter) Functions
  */
  my.width = function() {
      return width;
    } // my.width()
  ;
  my.height = function() {
      return height;
    } // my.height()
  ;
  my.full = function(value) {
      if(!arguments.length) return scale;

      canvases.forEach(function(c) {
          c.canvas.zoom(value).snap();
      });

      return my;
    } // my.full()
  ;
  my.margin = function(value) {
      if(!arguments.length) return margin;

      margin = value;

      return my;
    } // my.margin()
  ;
  my.connect = function(value) {
      if(!arguments.length) return dispatch;

      dispatch = value;
      return my;
    } // my.connect()
  ;
  my.zoom = function(value) {
      display.zoom = value;
      display.zoom.x = display.zoom.x || domain.x;
      display.zoom.y = display.zoom.y || domain.y;
      scale.barlines.domain(display.zoom.x);
      barlines.call(barlinesAxis.scale(scale.barlines));
      measures.call(measuresAxis.scale(scale.barlines));

      if(display.separate && display.hilite)
          display.zoom.y = null;

      canvases.forEach(function(c) { c.canvas.zoom(display.zoom).snap(); });

      return my;
    } // my.zoom()
  ;
  my.hilite = function(value) {
      display.hilite = (value && value.emphasize) || false;
      update();

      return my;
    } // my.hilite()
  ;
  my.separate = function(value) {
      if(!arguments.length) return display.separate;

      display.separate = value || false;
      update();

      return my;
    } // my.separate()
  ;
  my.reset = function() {
      canvases.forEach(function(c) {
          c.canvas.reset();
      });
      return my;
    } // my.reset()
  my.extremes = function(value) {
      if(!arguments.length) return display.extremes;

      display.extremes = value;
      canvases.forEach(function(c) {
          c.canvas.extremes(value);
      });

      return my;
    } // my.extremes()
  ;
  my.container = function (value){
      if(arguments.length === 0) return container;
      container = value;
      return my;
    } // my.container()
  ;
  my.data = function (value){
      if(arguments.length === 0) return data;
      data = value;
      return my;
    } // my.data()
  ;
  my.artist = function (value){
      if(!arguments.length) return artist;
      artist = value;
      return my;
    } // my.artist()
  ;
  my.resize = function () {
      size();
      update();
      return my;
    } // my.resize();
  ;
  // This is always the last thing returned
  return my;
} // NotesBook()

function NotesNav() {
    /*
    ** Private Variables - only used inside this object
    */
    var container
      , data
      , width
      , height
      , margin = { top: 20, right: 20, bottom: 20, left: 20 }
      , x, y
      , artist
      , canvas
      , brush =  {
              selection: null
            , widget: d3.brushX()
                    .handleSize(10)
                    .on("brush", brushed)
                    .on("end", brushend)
          }
      , dispatch
    ;

    /*
    ** Main function Object
    */
    function my() {
        size(); // set the height and width
        canvas = container.selectAll("canvas")
            .data([1], function(d) { return d; })
          .enter().append("canvas")
            .attr("width", width)
            .attr("height", height)
          .node()
        ;
        console.log(canvas)
        artist.canvas(canvas).render();

        var svg = container.selectAll("svg")
            .data([1], function(d) { return d; })
          .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
        ;
        var g = svg.merge(svg).append("g");
        g.attr("transform", "translate("+ margin.left +","+ margin.top +")");

        g.selectAll("g")
            .data(["brush"])
          .enter().append("g")
            .attr("class", function(d) { return d; })
        ;
        width  = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        brush.widget.extent([[0, 0], [width, height]]);

        brush.selection = g.select(".brush")
            .call(brush.widget)
        ;
        // brush.selection.call(brush.widget.move, canvas.widget.x().range())
        // ;
        brush.selection.selectAll("rect")
            .attr("y", 0)
            .attr("height", height)
        ;
    } // my() - Main Function Object

    /*
    ** Helper Functions
    */
    function brushend() { return brushed(true); }

    function brushed(ended) {
      return; // TODO

        var extent = d3.event && d3.event.selection
            ? d3.event.selection.map(Math.round).map(canvas.widget.x().invert)

            : false
        ;
        if(!dispatch)
            return;

        dispatch.call(
            "zoom"
          , this
          , {
                x: extent
              , ended: ended || false
            }
        );
    } // brushed()

    function size() {
      width = parseInt(container.style("width"));
      height = parseInt(container.style("height"));
    } // size()

    function update() {
        console.log(arguments.length);
    } // update()

    function move() {
        brush.selection
            .call(brush.widget.move(
                  [0, 0]
                , [height * canvas.widget.ratio(), height]
              ))
        ;
    } // resize()

    /*
    ** API - Getters/Setters
    */
    my.height = function() {
        return height;
      } // my.height()
    ;
    my.width = function () {
        return width;
      } // my.width()
    ;
    my.margin = function (value) {
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
    my.full = function(value) {
        if(!arguments.length) return scale;

        scale = value;
        canvas.widget.zoom(scale).snap();
        return my;
      } // my.full()
    ;
    my.extent = function(value) {
        if(!value) return;
        return; // TODO
        var t = d3.transition()
          , extent = value.map(canvas.widget.x())
        ;
        brush.selection
          .transition(t)
            .call(brush.widget.move, extent)
        ;
      } // my.extent()
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

    // This is ALWAYS the last thing returned
    return my;
} // NotesNav()

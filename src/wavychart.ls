window.wavychart = ({host = void, width = 400, height = 300, data = [[[]]], wavy = 1, curvy = 10, spiky = 2, colors = ['#000000'], thickness = 2}, {}) ->

    const MARGIN_X = 30
    const MARGIN_Y = 30

    # extends the Math object to support gaussian random number generator
    Math.nrand = ->
        do
            x1  = 2 * Math.random! - 1
            x2  = 2 * Math.random! - 1
            rad = x1 * x1 + x2 * x2
        while rad >= 1 or rad == 0
     
        c = Math.sqrt(-2 * Math.log(rad) / rad)
        x1 * c;


    # calculates a cubic bezier curve from point (from-x, from-y) to (to-x, to-y) with
    # control points (ctrl-a-x, ctrl-a-y) and (ctrl-b-x, ctrl-b-y) and returns the requested    
    # number of points on it
    get_bezier = (from-x, from-y, to-x, to-y, ctrl-a-x, ctrl-a-y, ctrl-b-x, ctrl-b-y, points) ->
        t = 0.0
        
        ret = []
        
        while t <= 1.0
            q1 = t * t * t * -1 + t * t * 3 + t * - 3 + 1
            q2 = t * t * t * 3 + t * t * -6 + t * 3
            q3 = t * t * t * -3 + t * t * 3
            q4 = t * t * t

            qx = q1 * from-x + q2 * ctrl-a-x + q3 * ctrl-b-x + q4 * to-x;
            qy = q1 * from-y + q2 * ctrl-a-y + q3 * ctrl-b-y + q4 * to-y;

            plotx = Math.round qx
            ploty = Math.round qy

            ret.push [plotx, ploty]

            t = t + (1 / points)
        ret


    # given an array of points ([x, y]), randomizes each x, with an amount of
    # displacement specified by curvyness 
    randomize-points = (points, curvyness) ->
        map (-> [it[0] += Math.round(Math.nrand! * curvyness), it[1] += Math.round(Math.nrand! * curvyness)]), points


    # like randomize_point but leaves the first and last point untouched
    randomize-body = (points, curvyness) ->
        new-points = randomize-points points[1 to points.length - 2], curvyness
        [(head points)] ++ new-points ++ [(last points)]


    # remaps val (that has an expected range of low1 to high1) into a target range of low2 to high2
    remap-range = (val, low1, high1, low2, high2) ->
        low2 + (val - low1) * (high2 - low2) / (high1 - low1)


    # returns a SVG path string from point[0] through all the other points mapped as a catmull-rom spline
    raphael-catmull-rom = (points) ->
        fold ((acc, x) -> acc + "#{x[0]} #{x[1]} "), "M #{ points[0][0] } #{ points[0][1] } R ", points        


    paper = Raphael host
    
    unfolded-x = concat-map (-> map ((itt) -> itt[0]), it), data
    unfolded-y = concat-map (-> map ((itt) -> itt[1]), it), data
    max-x = maximum unfolded-x
    max-y = maximum unfolded-y
    min-x = minimum unfolded-x
    min-y = minimum unfolded-y

    for dataset in data        
        color = colors.splice(0, 1)
        points = []
        from-x = remap-range dataset[0][0], min-x, max-x, MARGIN_X, width  - MARGIN_X
        from-y = remap-range dataset[0][1], min-y, max-y, MARGIN_Y, height - MARGIN_Y
        
        for point in dataset[1 to]
            x        = remap-range point[0], min-x, max-x, MARGIN_X, width  - MARGIN_X
            y        = remap-range point[1], min-y, max-y, MARGIN_Y, height - MARGIN_Y
            ctrl-a-x = from-x + ((x - from-x) / spiky)
            ctrl-a-y = from-y
            ctrl-b-x = x - ((x - from-x) / spiky)
            ctrl-b-y = y


            points = randomize-body (get_bezier from-x, from-y, x, y, ctrl-a-x, ctrl-a-y, ctrl-b-x, ctrl-b-y, curvy), wavy

            raphpath = raphael-catmull-rom points           
            
            path-glow = paper.path raphpath
            path-glow.attr {stroke: '#ffffff', 'stroke-width': thickness + 4}
            path = path-glow.clone!
            path.attr {stroke: color, 'stroke-width': thickness}

            from-x = x
            from-y = y


    paper.wavyline = (from-x, from-y, to-x, to-y) ->
        points   = randomize-body (get_bezier from-x, from-y, to-x, to-y, from-x, from-y, to-x, to-y, curvy), wavy
        raphpath = raphael-catmull-rom points
        path     = paper.path raphpath
        path.attr {stroke: '#000000', 'stroke-width': thickness}
        

    # add cartesian frame
    # y-axis 
    from-x = MARGIN_X / 2
    from-y = MARGIN_Y / 2
    to-x   = from-x
    to-y   = height - from-y

    paper.wavyline from-x, from-y, to-x, to-y   

    # add cartesian frame
    # x-axis 
    from-x = MARGIN_X / 2
    from-y = to-y
    to-x   = width  - from-x
    to-y   = from-y

    paper.wavyline from-x, from-y, to-x, to-y   

    paper



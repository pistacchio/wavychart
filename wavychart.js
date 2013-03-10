if (typeof window == 'undefined' || window === null) {
  require('prelude-ls').installPrelude(global);
} else {
  prelude.installPrelude(window);
}
(function(){
  var slice$ = [].slice;
  window.wavychart = function(arg$){
    var host, ref$, width, height, data, wavy, curvy, spiky, colors, thickness, MARGIN_X, MARGIN_Y, get_bezier, randomizePoints, randomizeBody, remapRange, raphaelCatmullRom, paper, unfoldedX, unfoldedY, maxX, maxY, minX, minY, i$, len$, dataset, color, points, fromX, fromY, j$, len1$, point, x, y, ctrlAX, ctrlAY, ctrlBX, ctrlBY, raphpath, pathGlow, path, toX, toY;
    host = (ref$ = arg$.host) != null ? ref$ : void 8, width = (ref$ = arg$.width) != null ? ref$ : 400, height = (ref$ = arg$.height) != null ? ref$ : 300, data = (ref$ = arg$.data) != null
      ? ref$
      : [[[]]], wavy = (ref$ = arg$.wavy) != null ? ref$ : 1, curvy = (ref$ = arg$.curvy) != null ? ref$ : 10, spiky = (ref$ = arg$.spiky) != null ? ref$ : 2, colors = (ref$ = arg$.colors) != null
      ? ref$
      : ['#000000'], thickness = (ref$ = arg$.thickness) != null ? ref$ : 2;
    MARGIN_X = 30;
    MARGIN_Y = 30;
    Math.nrand = function(){
      var x1, x2, rad, c;
      do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
      } while (rad >= 1 || rad === 0);
      c = Math.sqrt(-2 * Math.log(rad) / rad);
      return x1 * c;
    };
    get_bezier = function(fromX, fromY, toX, toY, ctrlAX, ctrlAY, ctrlBX, ctrlBY, points){
      var t, ret, q1, q2, q3, q4, qx, qy, plotx, ploty;
      t = 0.0;
      ret = [];
      while (t <= 1.0) {
        q1 = t * t * t * -1 + t * t * 3 + t * -3 + 1;
        q2 = t * t * t * 3 + t * t * -6 + t * 3;
        q3 = t * t * t * -3 + t * t * 3;
        q4 = t * t * t;
        qx = q1 * fromX + q2 * ctrlAX + q3 * ctrlBX + q4 * toX;
        qy = q1 * fromY + q2 * ctrlAY + q3 * ctrlBY + q4 * toY;
        plotx = Math.round(qx);
        ploty = Math.round(qy);
        ret.push([plotx, ploty]);
        t = t + 1 / points;
      }
      return ret;
    };
    randomizePoints = function(points, curvyness){
      return map(function(it){
        return [it[0] += Math.round(Math.nrand() * curvyness), it[1] += Math.round(Math.nrand() * curvyness)];
      }, points);
    };
    randomizeBody = function(points, curvyness){
      var newPoints;
      newPoints = randomizePoints(slice$.call(points, 1, points.length - 2 + 1 || 9e9), curvyness);
      return [head(points)].concat(newPoints, [last(points)]);
    };
    remapRange = function(val, low1, high1, low2, high2){
      return low2 + (val - low1) * (high2 - low2) / (high1 - low1);
    };
    raphaelCatmullRom = function(points){
      return fold(function(acc, x){
        return acc + (x[0] + " " + x[1] + " ");
      }, "M " + points[0][0] + " " + points[0][1] + " R ", points);
    };
    paper = Raphael(host);
    unfoldedX = concatMap(function(it){
      return map(function(itt){
        return itt[0];
      }, it);
    }, data);
    unfoldedY = concatMap(function(it){
      return map(function(itt){
        return itt[1];
      }, it);
    }, data);
    maxX = maximum(unfoldedX);
    maxY = maximum(unfoldedY);
    minX = minimum(unfoldedX);
    minY = minimum(unfoldedY);
    for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
      dataset = data[i$];
      color = colors.splice(0, 1);
      points = [];
      fromX = remapRange(dataset[0][0], minX, maxX, MARGIN_X, width - MARGIN_X);
      fromY = remapRange(dataset[0][1], minY, maxY, MARGIN_Y, height - MARGIN_Y);
      for (j$ = 0, len1$ = (ref$ = slice$.call(dataset, 1)).length; j$ < len1$; ++j$) {
        point = ref$[j$];
        x = remapRange(point[0], minX, maxX, MARGIN_X, width - MARGIN_X);
        y = remapRange(point[1], minY, maxY, MARGIN_Y, height - MARGIN_Y);
        ctrlAX = fromX + (x - fromX) / spiky;
        ctrlAY = fromY;
        ctrlBX = x - (x - fromX) / spiky;
        ctrlBY = y;
        points = randomizeBody(get_bezier(fromX, fromY, x, y, ctrlAX, ctrlAY, ctrlBX, ctrlBY, curvy), wavy);
        raphpath = raphaelCatmullRom(points);
        pathGlow = paper.path(raphpath);
        pathGlow.attr({
          stroke: '#ffffff',
          'stroke-width': thickness + 4
        });
        path = pathGlow.clone();
        path.attr({
          stroke: color,
          'stroke-width': thickness
        });
        fromX = x;
        fromY = y;
      }
    }
    paper.wavyline = function(fromX, fromY, toX, toY){
      var points, raphpath, path;
      points = randomizeBody(get_bezier(fromX, fromY, toX, toY, fromX, fromY, toX, toY, curvy), wavy);
      raphpath = raphaelCatmullRom(points);
      path = paper.path(raphpath);
      return path.attr({
        stroke: '#000000',
        'stroke-width': thickness
      });
    };
    fromX = MARGIN_X / 2;
    fromY = MARGIN_Y / 2;
    toX = fromX;
    toY = height - fromY;
    paper.wavyline(fromX, fromY, toX, toY);
    fromX = MARGIN_X / 2;
    fromY = toY;
    toX = width - fromX;
    toY = fromY;
    paper.wavyline(fromX, fromY, toX, toY);
    return paper;
  };
}).call(this);

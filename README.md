wavychart
=========

A Livescript / Javascript library to generate charts in the style of xkcd
-------------------------------------------------------------------------

### Result

wavychart users [Raphaël](http://raphaeljs.com) to generate a a weighted line chart in the style of [xkcs's](http://xkcd.com/1064/) from  bidimensional data sets.
The chart is calculated with cubic bezier curves whose points are randomly displaced with a gaussian bell of chance and the *wavy* effect is obtained by interpolating the points with a Catmull-Rom spline.

The results is something like this that can be further extended by accessing the created Raphael object:

![wavychart screenshot](https://github.com/pistacchio/wavychart/raw/master/img/sample-chart.png) 

The returned Raphaël <code>paper</code> object is extended with a <code>paper.wavyline(fromX, fromY, toX, toY)</code> method that you can use to add your custom wavy lines to the chart.

### Usage

#### Dependencies

Before including in your page <code>wavychart.js</code>, include also:

* [prelude.ls](http://gkz.github.com/prelude-ls/#)
* [Raphaël](http://raphaeljs.com)

#### Options

Call <code>wavychart()</code> with the following options:

<table>
	<tr>
		<td>host</td>
		<td>A javascript object that will contain the Raphaël canvas</td>
	</tr>
	<tr>
		<td>width</td>
		<td>Width of the Raphaël canvas. Default is 400</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Height of the Raphaël canvas. Default is 300</td>
	</tr>
	<tr>
		<td>data</td>
		<td>An array of datasets. Each dataset is an array of point. Each point is an array with the x value and the y value.</td>
	</tr>
	<tr>
		<td>wavy</td>
		<td>Together with the curvy option, controls the appearance of the wavy lines. Default is 1</td>
	</tr>
	<tr>
		<td>curvy</td>
		<td>Together with the curvy option, controls the appearance of the wavy lines. Default is 10</td>
	</tr>
	<tr>
		<td>spiky</td>
		<td>Controls the placement of countrol points for the bezier curves. Default is 2</td>
	</tr>
	<tr>
		<td>colors</td>
		<td>An aray of colors to draw the charts. Default is black</td>
	</tr>
	<tr>
		<td>thickness</td>
		<td>Stroke weight of the charts. Default is 2k</td>
	</tr>
</table>

### Example

The following example generates the chart dipicted above

<pre><code>

<!doctype html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>wavychart</title>
	    <script type="text/javascript" src="prelude.js"></script>
	    <script type="text/javascript" src="raphael.js"></script>
	    <script type="text/javascript" src="wavychart.js"></script>

	</head>
	<body>
	    <div id="chart"></div>

	    <script type="text/javascript">
	        var canvas = document.getElementById('chart');
	        wavychart({host: canvas,
	                   data:   [[ [1, 60],
	                              [2, 20],
	                              [3, 50],
	                              [4, 10],
	                              [5, 100] ],
	                            [ [1, 20],
	                              [2, 200],
	                              [3, 70],
	                              [4, 10],
	                              [5, 70],
	                              [6, 90],
	                              [7, 70], ]],
	                    colors:   ['#E3000C', '#5FBAE3']});
	    </script>
	</body>
</html>	

</code></pre>
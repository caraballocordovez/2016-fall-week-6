console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g') //The selector keeps pointing the last element that is appended. If you use the variable plot, you're visualizing on g.
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv("../data/world_bank_2012.csv", parse, function(err, rows){
	console.log(err)
	console.table(rows);

	/* var minX = d3.min(rows, function(q){return q.gdpPerCap;});
		maxX = d3.max(rows, function(q){return q.gdpPerCap;});

	console.log(minX, maxX);*/

	var extent = d3.extent(rows, function(q){return q.gdpPerCap;}); // d3 function to find the minimum and maximum values in an array

	console.log(extent)

	var scaleX = d3.scaleLinear()
		.domain(extent) // You put the minimum and maximum values of the X axis. That's what extent provides, but you could also use minX, maxX
		.range([0, w]);
	var scaleY = d3.scaleLinear()
		.domain([0, 100])
		.range([h, 0]) // We flip the scale, so larger values are displayed on the top and viceversa. By default, the 0 is on the upper left corner, so higher values would be shown on the bottom of the canvas.

		//Before rows.forEach we can create the axis to visually represent the scale we're using. We did this at the end of the class, when we had already visualized the values.
	var axisX = d3.axisBottom()
		.scale(scaleX);

	var axisNodeX = plot.append("g").attr("class", "axis")
		/* .attr("transform", "translate (0, h)"; */
		// axisX(axisNodeX);
		axisNodeX.call(axisX);

	var axisY = d3.axisLeft()
		.scale(scaleY);

	var axisNodeY = plot.append("g").attr("class", "axis")
		axisNodeY.call(axisY);

		rows.forEach(function(country, i){ //both arguments are placeholders, the i is just the index.
			
			/* plot.append("circle")
			.attr("cx", scaleX(country.gdpPerCap)) //scaleX transform the highest values of an array and transform them into a smaller value scaled into the canvas. You have to define scaleX first. 
			.attr("cy", scaleY(country.pctUrban))
			.attr("r", 10)
			.style("fill-opacity", .7); */ //This works. It was the first part of the exercise. 

			var node = plot.append("g") // Queremos ponerle texto a cada círculo, entonces creamos un elemento en el que vamos a crear el círculo y el texto independientes. 
				.attr("transform", "translate("+scaleX(country.gdpPerCap) + "," +scaleY(country.pctUrban) +")");

			node.append("circle") //We created the elements inside g.
				.attr("r", 10)
				.style("fill-opacity", .1);

			node.append("text").text(country.countryCode);

}) //be careful

}
);

function parse(d){ //The argument d (a placeholder) stands for each individual row of the table. 
	
	if(d["Urban population (% of total)"]==".." || d["GDP per capita, PPP (constant 2011 international $)"]=="..") return; //This was written after the next return where we changed the names and turned strings into numbers. What we're doing here is saying: If any element in this object is .. (not a number) you reject the row entirely. It's called a no-op. You do it to avoid visualizing elements that cannot be visualized because they have invalid values. The last return in this line kills the function, and don't affect the next part of the function. See the screenshot of before and after doing this line. 

	return{
		country: d["Country Name"], //We're changing the name of the old columns. Instead of Column Name, the new table will have a column called country.
		countryCode: d["Country Code"],
		pctPrimaryCompletion: d["Primary completion rate, total (% of relevant age group)"]==".."?undefined:+d["Primary completion rate, total (% of relevant age group)"],
		gdpPerCap: d["GDP per capita, PPP (constant 2011 international $)"]==".."?undefined:+d["GDP per capita, PPP (constant 2011 international $)"],
		pctUrban: d["Urban population (% of total)"]==".."?undefined:+d["Urban population (% of total)"],	
	}
}


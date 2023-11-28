var width = 1200; // The width of the svg is a global variable
var height = 800; // The height of the svg is a global variable

var fdata; // The formatted data is a global variable
var rendered_year = 0;
var playing = false;

// Setting the Y axis
var yAxis = d3.scaleLinear()
	.domain([0, 90])
	.range([650, 0])

// Setting the X axis
var xAxis = d3.scaleLog()
	.base(10)
	.range([0, 1000])
	.domain([100, 150000])

var area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);

// TODO Ordinal scale for colors for example: d3.scaleOrdinal(d3.schemePastel1)
//var continentColor = d3.scaleOrdinal(d3.schemePastel1);


var svg = d3.select("#svg_chart")
.append("svg")
    .attr("width", 1350)
	.attr("height", 850)
	.style("background", "#daefe3")
	.style("stroke", "#0c0843")
.append("g")
.attr("transform", "translate(" + 100 + ", " + 50 + ")")

	 
var x_axis_create = d3
  .axisBottom(xAxis)
  .tickValues([1, 10, 100, 1000, 10000, 100000])
  .tickFormat(d3.format('$,.0f'))

var y_axis_create = d3
  .axisLeft(yAxis)
  .tickFormat(d => +d);


svg.append("g")
  .attr("class", "xaxis")
  .attr("transform", "translate(" + 100 + ", " + 700 + ")")
  .attr("text-anchor", "middle")
  .attr("font-size","20px")
  .call(x_axis_create)

svg.append("g")
	.attr("class", "yaxis")
	.attr("transform", "translate(" + 100 + ", " + 50 + ")")
    .call(y_axis_create)
  

svg.append("text")
  .attr("class", "GDP_label")
  .attr("x", 625)
  .attr("y", 750)
  .attr("text-anchor", "middle")
  .attr("stroke","steelblue") 
  .attr("stroke-width","1px")
  .attr("font-size","20px")
  .attr("font-style","italic")
  .text("GDP per Capita");



svg.append("text")
  .attr("class", "Life_label")
  .attr("x", -(325))
  .attr("y", 50)
  .attr("text-anchor", "middle")
  .attr("stroke","steelblue") 
  .attr("stroke-width","1px")
  .attr("font-size","20px")
  .attr("font-style","italic")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy"); 

 

var canvas_group = svg.append("g")
  .attr("transform", "translate(" + 100 + ", " + 50 + ")")

svg.append("rect")
  .attr("width", 50)
  .attr("height", 20)
  .attr("fill", "green")
  .attr("transform", "translate(" + 1150 + ", " + 50 + ")")

svg.append("rect")
  .attr("width", 50)
  .attr("height", 20)
  .attr("fill", "yellow")
  .attr("transform", "translate(" + 1150 + ", " + 90 + ")")

svg.append("rect")
  .attr("width", 50)
  .attr("height", 20)
  .attr("fill", "blue")
  .attr("transform", "translate(" + 1150 + ", " + 130 + ")")

svg.append("rect")
  .attr("width", 50)
  .attr("height", 20)
  .attr("fill", "red")
  .attr("transform", "translate(" + 1150 + ", " + 170 + ")")

svg.append("text")
  .attr("class", "aa")
  .attr("x", 1115)
  .attr("y", 65)
  .attr("text-anchor", "middle") 
  .attr("stroke-width","1px")
  .attr("font-size","20px")
  .text("Europe: ");

svg.append("text")
  .attr("class", "aa")
  .attr("x", 1115)
  .attr("y", 105)
  .attr("text-anchor", "middle") 
  .attr("stroke-width","1px")
  .attr("font-size","20px")
  .text("Asia: ");

svg.append("text")
  .attr("class", "aa")
  .attr("x", 1100)
  .attr("y", 145)
  .attr("text-anchor", "middle") 
  .attr("stroke-width","1px")
  .attr("font-size","20px")
  .text("Americas: ");

svg.append("text")
  .attr("class", "aa")
  .attr("x", 1115)
  .attr("y", 185)
  .attr("text-anchor", "middle") 
  .attr("stroke-width","1px")
  .attr("font-size","20px")
  .text("Africa: ");  
var yearlbl = canvas_group.append("text")
  .attr("class", "yearlbl")
  .attr("x", 850)
  .attr("y", 500)
  .attr("text-anhor", "middle")
  .attr("font-size","30px")
  .attr("font-style","italic")
  .text("")
//	.text('');
  // Reading the input data

var continentColor = d3.scaleOrdinal(["red", "blue", "yellow", "green"]);
var continents = ["europe", "asia", "americas", "africa"];

d3.json("data.json").then(function (data) {

	// Console log the original data
	console.log(data);

	// Cleanup data
	fdata = data.map(function (year_data) {
		// retain the countries for which both the income and life_exp is specified
		return year_data["countries"].filter(function (country) {
			var existing_data = (country.income && country.life_exp);
			return existing_data
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	// Console log the formatted data
	console.log(fdata);

	// invoke the circle that draws the scatterplot
	// the argument corresponds to the year
	draw_circles(0);
})

// setting the callback function when the slider changes
d3.select("#slider").on("input", render);

// callback function to render the scene when the slider changes
function render() {

	// extracting the value of slider
	var slider_val = d3.select("#slider").property("value");
	
	// rendered_year is the global variable that stores the current year
	// get the rendered_year from the slider (+ converts into integer type)
	rendered_year = +slider_val

	// Call rendering function
	draw_circles(rendered_year)
}

function getcontinent(continentdata)
{
	return continentdata
}

function filtering(datas, selectedradio)
{
	selectedcontinent = datas.map(function(d){
		return d.filter(item=>{ return item.continent == selectedradio});
	});
	
	return getcontinent(selectedcontinent)
}

var tip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

function draw_circles(year) {
	
  var data = fdata;

  var ele = document.getElementsByName('continents'); 

    if(ele[0].checked)
  {
	  var selectionradio ="all"
  }

  if(ele[1].checked)
  {
	  var selectionradio ="europe"
  }

  if(ele[2].checked)
  {
	  var selectionradio ="asia"
  }

  if(ele[3].checked)
  {
	  var selectionradio ="americas"
  }

  if(ele[4].checked)
  {
	  var selectionradio ="africa"
  }

    // filter data based on selected continent
    if (selectionradio != "all")
    {
    	var continent_data = filtering(fdata, selectionradio);
		data = continent_data;
    }

	console.log(year);
	svg.selectAll("circle")
	.data(data[year], function(d)
		{
			return d.country;
		});

	var trans = d3.transition()
		.style("background-color", "#CCFFFF")
			.duration(50);

	// TODO all your rendering D3 code here
		
	svg.selectAll("circle")
	.data(data[year], d=> d.country)
	.exit()
	.remove();
	
	svg.selectAll("circle")
	.data(data[year], d=> d.country)
	.enter()
	.append("circle")
	.attr("fill", d => continentColor(d.continent))
	.merge(	svg.selectAll("circle")
	.data(data[year], d=> d.country))
	.transition(trans)
	.attr("cx", d => xAxis(d.income))
	.attr("cy", d=> yAxis(d.life_exp))
	.attr("r", d=> Math.sqrt(area(d.population/Math.PI)));
	yearlbl.text(1800 + year);
    // this variable gets set only through the button 
	// therefore step is called in a loop only when play is pressed
	// step is not called when slider is changed
	if (playing)
        setTimeout(step, 50)
}


// callback function when the button is pressed
function play() {

	if (d3.select("button").property("value") == "Play") {
		d3.select("button").text("Pause")
        d3.select("button").property("value", "Pause")
        playing = true
        step()
	}
	else {
		d3.select("button").text("Play")
        d3.select("button").property("value", "Play")
        playing = false
	}
}

// callback function when the button is pressed (to play the scene)
function step() {
	
	// At the end of our data, loop back
	
	rendered_year = (rendered_year < 214) ? rendered_year + 1 : 0
	document.getElementById('slider').value = rendered_year;
	draw_circles(rendered_year)
}

function reset()
{
    window.location.reload();
}

//https://medium.com/codecakes/handling-radio-buttons-in-d3-js-9c6245c6157
//https://github.com/shaonkabir8/countryList/blob/abedc6f49694d995366624d11e89242b87dd429d/assets/js/currency.js
//https://github.com/d3/d3-transition
//https://github.com/zyz19940824/exerciseportfolio/blob/66f0adb634b20b025a6cd0ec703e5fa4a4145c86/area-chart.html 
//https://codepen.io/klattman/pen/BOJWyX
//https://stackoverflow.com/questions/13203897/d3-nested-appends-and-data-flow
//https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation
//http://bl.ocks.org/nikhilNathwani/5dca6c63a53934185d05
//https://www.geeksforgeeks.org/how-to-get-value-of-selected-radio-button-using-javascript/
//https://saschaklatt.dev/my-work/d3-gapminder-visualization
//https://www.codeproject.com/Articles/1089925/Build-a-Demographic-Data-Visualization-Tool-Based
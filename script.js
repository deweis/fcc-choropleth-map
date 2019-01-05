/* https://www.youtube.com/watch?v=G-VggTK-Wlg */

/* https://codepen.io/eday69/pen/eLeegZ?editors=0101 */

/*
education = {
  area_name: "Autauga County",
  bachelorsOrHigher: 21.9,
  fips: 1001,
  state: "AL"
}

counties = {
  id: 1001
}
*/

/****
 * - Finetune Layout
 * - Add array with empty fields for db style data storage
 * - Put examples to browser bookmarks and clean the code
 * - Finetune Layout
 */

// create an svg element
const svg = d3
  .select('#chartContainer')
  .append('svg')
  .attr('id', 'chart')
  .attr('class', 'svg')
  .attr(
    'viewBox',
    `45 -60 800 750`
  ) /* I have no clue how exactly these figures work?? ..but it's perfectly responsive. Figured them out by trial and error in combination with the .container styling in css */
  .attr('preserveAspectRatio', 'xMidYMid meet');

// async load the data (topojson file)
d3.queue()
  .defer(
    d3.json,
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
  )
  .defer(
    d3.json,
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
  )
  .await(ready);

// create a path (geoPath)
const path = d3.geoPath();

// add the map to the svg and fill the data in
function ready(error, counties_data, education_data) {
  //console.log(data);
  if (error) {
    console.log(error);
  }

  // topojson.feature converts our RAW geo data into usable geo data
  const counties = topojson.feature(
    counties_data,
    counties_data.objects.counties
  ).features;

  const states = topojson.feature(counties_data, counties_data.objects.states)
    .features;

  // the coloring
  const colors = [
    '#90caf9', // blue lighten-3
    '#64b5f6', // blue lighten-2
    '#42a5f5', // blue lighten-1
    '#2196f3', // blue
    '#1e88e5', // blue darken-1
    '#1976d2', // blue darken-2
    '#1565c0', // blue darken-3
    '#0d47a1' // blue darken-4
  ];

  const minEdu = d3.min(education_data, d => d.bachelorsOrHigher);
  const maxEdu = d3.max(education_data, d => d.bachelorsOrHigher);

  const colorScale = d3
    .scaleQuantize()
    .domain([minEdu, maxEdu])
    .range(colors);

  // Define the tooltip div --> Thanks http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  const divTooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  // Add the counties (I.e. whenever I want to draw a shape I use path's)
  svg
    .append('g')
    .selectAll('path')
    .data(counties)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    //.attr('stroke', '#bdbdbd') // The lines - grey lighten-1
    //.attr('fill', '#fafafa') // The background - grey lighten-5
    .style('fill', d =>
      colorScale(education_data.find(x => x.fips === d.id).bachelorsOrHigher)
    )
    .attr('data-fips', d => d.id)
    .attr(
      'data-education',
      d => education_data.find(x => x.fips === d.id).bachelorsOrHigher
    )
    .on('mouseover', d => {
      const county_name = education_data.find(x => x.fips === d.id).area_name;
      const edu = education_data.find(x => x.fips === d.id).bachelorsOrHigher;

      divTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('data-education', edu);

      divTooltip
        .html(`${county_name}, ND: ${edu}%`)
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 35 + 'px')
        .style('background', 'grey');

      /*const formatTime = d3.timeFormat('%M:%S');
      const doped = d[2] === '' ? '' : `<br><br>${d[2]}`;
      const well = d[2] === '' ? '<br><br>Well, seems he had a good doctor..😉' : '';

      divTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('data-year', d[0]);

      divTooltip
        .html(
          `
          ${d[3]}: ${d[4]}<br>
          Year: ${d[0]},  Time: ${formatTime(d[1])}
          ${doped}
          ${well}
          `
        )
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 35 + 'px')
        .style('background', doped ? '#ffcdd2' : '#c8e6c9'); //  Doping: Yes: red lighten-4 / No: green lighten-4*/
    })
    .on('mouseout', d => {
      /* Hide the tooltip when hovering out */
      divTooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

  // Add the states
  svg
    .append('g')
    .selectAll('path')
    .data(states)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('stroke', '#f5f5f5') /* grey lighten-4 */
    .attr('fill', 'none');

  // Add the legend
  const linear = d3
    .scaleQuantize()
    //.scaleLinear() ?? How to add the right coloring?
    .domain([minEdu, maxEdu])
    .range(colors);

  svg
    .append('g')
    .attr('class', 'legendLinear')
    .attr('id', 'legend')
    .attr('transform', 'translate(30, 640)');

  const legendLinear = d3
    .legendColor()
    //.labelFormat(d3.format('.0s')) ?? d3.format is a mysterium.. How to add the percentage string?
    .labelFormat((d, i) => `${d.toFixed()}%`)
    .shapeWidth(110)
    .cells(8)
    .orient('horizontal')
    .scale(linear);

  svg.select('.legendLinear').call(legendLinear);
}

/*
Examples Check:
- https://www.google.com/search?client=firefox-b-ab&q=d3+Choropleth+map

Results:
- https://www.youtube.com/watch?v=OoZ0LWD9KUs
- https://bl.ocks.org/JulienAssouline/1ae3480c5277e2eecd34b71515783d6f
- http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328
- https://beta.observablehq.com/@mbostock/d3-choropleth
- https://bost.ocks.org/mike/map/

TBD:
- Check on examples
- Fetch the data
- Check responsiveness on grid solution: https://stackoverflow.com/a/9539361

*/

/* Fetch the data 
d3.json(
  'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',
  function(error, us) {
    if (error) console.log(error);
    console.log('US', us);
  }
);

d3.json(
  'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
  function(error, educationData) {
    if (error) console.log(error);
    console.log('Education', educationData);
  }
);
*/

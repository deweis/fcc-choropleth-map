/**
 * Create and append the svg element
 */
const svg = d3
  .select('#chartContainer')
  .append('svg')
  .attr('id', 'chart')
  .attr('class', 'svg')
  /* No clue how exactly these figures work?? ..but it's perfectly responsive. Figured them out by trial and error in combination with the .container styling in css */
  .attr('viewBox', `45 -60 800 750`)
  .attr('preserveAspectRatio', 'xMidYMid meet');

/**
 * Async load the data geo and education data
 */
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

/**
 * create a path (geoPath) - Needed to draw shapes
 */
const path = d3.geoPath();

/**
 * Main function triggered when data load is ready
 * Responsible to draw all data within the svg
 */
function ready(error, counties_data, education_data) {
  if (error) {
    console.log(error);
  }

  /* Note: topojson.feature converts the RAW geo data into usable geo data */
  const counties = topojson.feature(
    counties_data,
    counties_data.objects.counties
  ).features;

  const states = topojson.feature(counties_data, counties_data.objects.states)
    .features;

  /* The coloring */
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

  /**
   * Define the tooltip DIV
   * Thanks for the input: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
   */
  const divTooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  /**
   * Store the data in an array with fips as index, so it can be linked to the location data (I.e. counties)
   * Thanks for the input: https://codepen.io/eday69/pen/eLeegZ?editors=0011
   */
  let education = [];

  education_data.forEach(x => {
    education[x.fips] = {
      edu: x.bachelorsOrHigher,
      county: x.area_name
    };
  });

  /**
   * Draw the data into the svg - Add the counties first
   */
  svg
    .append('g')
    .selectAll('path')
    .data(counties)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .style('fill', d => colorScale(education[d.id].edu))
    .attr('data-fips', d => d.id)
    .attr('data-education', d => education[d.id].edu)
    .on('mouseover', d => {
      divTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('data-education', education[d.id].edu);

      divTooltip
        .html(`${education[d.id].county} - ${education[d.id].edu}%`)
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 35 + 'px');
    })
    .on('mouseout', d => {
      /* Hide the tooltip when hovering out */
      divTooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

  /**
   * Add the states
   */
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

  /**
   * Add the legend
   */
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

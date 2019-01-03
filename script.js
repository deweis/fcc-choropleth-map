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

  // Add the counties (I.e. whenever I want to draw a shape I use path's)
  svg
    .append('g')
    .selectAll('path')
    .data(counties)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('stroke', '#bdbdbd') // The lines - grey lighten-1
    .attr('fill', '#fafafa') // The background - grey lighten-5
    .attr('data-fips', d => d.id)
    .attr(
      'data-education',
      d => education_data.find(x => x.fips === d.id).bachelorsOrHigher
    );

  // Add the states
  svg
    .append('g')
    .selectAll('path')
    .data(states)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('stroke', '#9e9e9e') // grey
    .attr('fill', 'none');
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

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

/* Add the SVG */
const svg = d3
  .select('#chartContainer')
  .append('svg')
  .attr('id', 'chart')
  .attr('class', 'svg');

/* Fetch the data */
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

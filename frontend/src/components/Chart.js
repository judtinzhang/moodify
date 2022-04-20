import CanvasJSReact from '../canvasjs.react';
import React from 'react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = (props) => {
      const options = {
        title: {
          text: "Statistics"
        },
        data: [{				
                  type: "column",
                  dataPoints: props.props
         }]
     }
          
     return (
        <div>
          <CanvasJSChart options = {options}
          />
        </div>
      );
  }

  export default Chart
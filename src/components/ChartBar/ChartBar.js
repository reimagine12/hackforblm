import React from 'react';
import './ChartBar.css';
import { Rnd } from 'react-rnd';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { max, barColors } from '../../config.js';

function ChartBar(props) {
  const { data, increaseBudget, decreaseBudget, order } = props;
  const state = {
    dragging: false,
    lastMouseY: null,
    updatedValue: data.amount
  };

  // Police bar doens't get interactions
  const interactions = order !== 0;

  const getHeight = () => state.updatedValue/max * 100 + '%';

  const updateHeight = (delta) => {
    const domElement = document.getElementById(`chartBar-${data.id}`);
    const dollarsPerPixel = Math.floor(max / domElement.clientHeight);
    const changeInDollars = Math.abs(delta.height * dollarsPerPixel);
    if (delta.height > 0) {
      increaseBudget(changeInDollars, data.id);
      decreaseBudget(changeInDollars, 0);
    } else {
      decreaseBudget(changeInDollars, data.id);
      increaseBudget(changeInDollars, 0, data.id);
    }
  };

  function simpleNum() {
    let a = state.updatedValue;

    if (a > 999999999) {
      let y = a * .000000001;
      let num = y.toFixed(1);

      return `${num} Billion`;
    } else {
      let z = a * .000001
      let sum = z.toFixed(1);
      
      return `${sum} Million`;
    }
  }

  const ChartTooltip = withStyles({
    tooltip: {
      backgroundColor: barColors[order],
      color: barColors[order] === 'black' ? '#ffffff' : '#000000',
      maxWidth: 220,
      padding: '15px',
      fontSize: '0.75rem',
      fontWeight: 700,
      border: '1px solid #000000',
      "@media (min-width:768px)": {
        display: 'none',
      },
    },
    arrow: {
      "&::before": {
        border: '1px solid #000000',
        backgroundColor: barColors[order],
        boxSizing: "border-box"
      }
    }
  })(Tooltip);

  return (
    <div className='chartBar' id={`chartBar-${data.id}`}>
      <div className='chartBar-label'>{data.label} <br /> ${simpleNum()}</div>
      <ChartTooltip 
        arrow
        placement='top'  
        title={
          <React.Fragment>
            {data.label} <br />
            ${simpleNum()}
          </React.Fragment>
          }>
        <Rnd className='chartBar-color'
          style={{
            backgroundColor: barColors[order]
          }} 
          default={{
            width: 30,
            height: 100,
          }}
          size={{ width: 30,  height: getHeight() }}
          onResizeStop={interactions ? (e, direction, ref, delta) => {
            updateHeight(delta);
          } : null}
        />
      </ChartTooltip>
    </div>
  );
}

export default ChartBar;

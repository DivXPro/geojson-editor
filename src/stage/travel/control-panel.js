import React from 'react';
import styled from 'styled-components';
import { Slider } from 'antd';

const StyledControlPanel = styled.div.attrs({
  className: 'control-panel'
})`
  display: flex;
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 1000;
  width: 600px;
  height: 60px;
  background-color: rgba(60,60,60,0.7);
  align-items: center;
  padding: 20px;
  .control-panel__play {
    width: 42px;
    height: 28px;
    display: flex;
    align-items: center;
    background-color: gray;
    justify-content: center;
    margin-right: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  .slider {
    width: 100%;
  }
`;

function Player(props) {
  return (
    <div className="control-panel__play" onClick={props.togglePlay}>
      {
        props.play ?
        (<svg width="12px" height="12px" class="data-ex-icons-pause " fill="white" viewBox="0 0 64 64">
          <path d="M23.015 56h-9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2zm29-2V10a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v44a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2z" />
        </svg>) :
        (<svg width="12px" height="12px" class="data-ex-icons-play " fill="white" viewBox="0 0 64 64">
          <path d="M15.625 7.434l36.738 23.378a2 2 0 0 1 0 3.375L15.625 57.566c-1.997 1.27-4.61-.164-4.61-2.531V9.965c0-2.368 2.613-3.802 4.61-2.531z" />
        </svg>)
      }
    </div>
  )
}

function ControlPlanel(props) {
  return <StyledControlPanel>
    <Player play={props.play} togglePlay={props.togglePlay} />
    <Slider className="slider" value={Math.round(props.current / props.length * 100, 2)} onChange={props.handleSliderChange} />
  </StyledControlPanel>;
}

export default ControlPlanel;
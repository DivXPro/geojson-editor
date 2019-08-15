import React from 'react';
import styled from 'styled-components';
import { Slider } from 'antd';
import SvgIcon from '@/components/commons/svg-icon';

const StyledControlPanel = styled.div.attrs({
  className: 'control-panel'
})`
  display: flex;
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  width: 600px;
  height: 80px;
  background-color: lightgray;
  align-items: center;
  padding: 20px;
  .control-panel__play {
    width: 42px;
    height: 28px;
    display: flex;
    align-items: center;
    background-color: gray;
    justify-content: center;
    &:hover {
      cursor: pointer;
    }
    margin-right: 20px;
  }
  .slider {
    width: 100%;
  }
`;

function Player(props) {
  const name = () => {
    return props.play ? 'pause' : 'play';
  }
  return (
    <div className="control-panel__play" onClick={props.togglePlay}>
      <SvgIcon name={name(props.play)}></SvgIcon>
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
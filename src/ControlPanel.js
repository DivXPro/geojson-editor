import React from 'react';
import styled from 'styled-components';
import ToggleButton from './ToggleButton';

const Panel = styled.div`
  width: 50px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 3px;
  position: absolute;
  z-index: 1000;
  top: 40px;
  left: 20px;
  box-shadow: 0 0 5px #333;
  padding: 10px;
  position: relative;
  font-size: .9rem;
  box-sizing: border-box;
`;


function ControlPlanel(props) {
  const toggleButtons = props.toggles.map(toggle => <ToggleButton key={toggle.text} data={toggle} mode={props.mode}/>);

  return <Panel>
    {toggleButtons}
  </Panel>;
}

export default ControlPlanel;
import React from 'react';
import styled from 'styled-components';
import ToggleButton from './ToggleButton';

const Panel = styled.div`
  width: 50px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  z-index: 1000;
  top: 40px;
  left: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  transition: left 250ms ease 0s, right 250ms ease 0s;
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
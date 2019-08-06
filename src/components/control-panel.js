import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToggleButton from './toggle-button';

const Panel = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1000;
  top: 40px;
  left: 20px;
  font-size: .9rem;
  box-sizing: border-box;
`;


function ControlPlanel(props) {
  const toggleButtons = props.toggles.map(toggle => <ToggleButton key={toggle.text} data={toggle} mode={props.mode}/>);

  return (
    <Panel>
      {toggleButtons}
    </Panel>
  );
}

ControlPlanel.propTypes = {
  toggles: PropTypes.object,
  mode: PropTypes.string
};

export default ControlPlanel;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SvgIcon from '@/components/commons/svg-icon';

const PanelHeaderBottom = styled.div.attrs({
  className: 'side-panel-header-bottom'
})`
  background-color: rgb(41, 50, 60);
  padding: 0 16px;
  display: flex;
  min-height: 30px;
`;

const PanelTab = styled.div.attrs({
  className: 'side-panel-tab'
})`
  align-items: flex-end;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.active ? 'white' : 'transparent'};
  color: ${props =>
    props.active ? 'white' : 'rgb(106, 116, 133)'};
  fill: ${props =>
    props.active ? 'white' : 'rgb(106, 116, 133)'};
  display: flex;
  justify-content: center;
  margin-right: 12px;
  padding-bottom: 6px;
  width: 30px;
  :hover {
    cursor: pointer;
    color: white;
    fill: white;
  }
`;

function PanelToggle (props) {
  return (
    <PanelHeaderBottom>
      {props.panels && props.panels.map(panel => (
        <PanelTab
          key={panel.id}
          active={props.activePanel === panel.id}
          onClick={() => props.togglePanel(panel.id)}
        >
          <SvgIcon name={panel.icon}></SvgIcon>
        </PanelTab>
      ))}
    </PanelHeaderBottom>
  );
}

PanelToggle.propTypes = {
  panels: PropTypes.array,
  activePanel: PropTypes.string,
  togglePanel: PropTypes.func
}

export default PanelToggle;

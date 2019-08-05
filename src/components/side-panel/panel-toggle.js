
import React, { useState } from 'react';
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
    color: ${props => 'white'};
  }
`;

function PanelToggle (props) {
  const [activePanel] = useState(props.activePanel);
  return (
    <PanelHeaderBottom>
      {props.panels.map(panel => (
        <PanelTab
          key={panel.id}
          active={activePanel === panel.id}
          onClick={() => props.togglePanel(panel.id)}
        >
          <SvgIcon name={panel.icon}></SvgIcon>
        </PanelTab>
      ))}
    </PanelHeaderBottom>
  );
}

export default PanelToggle;

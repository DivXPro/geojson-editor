import React from 'react';
import styled from 'styled-components';
import PanelToggle from './panel-toggle';

const StyledPanelHeader = styled.div`
  padding: 10px 16px;
  background-color: rgb(41, 50, 60);
  .logo-title {
    font-size: 14px;
    font-weight: 600;
    color: rgb(31, 186, 214);
    letter-spacing: 1.17px;
  }
`;



function PanelHeader(props) {

  return (
    <React.Fragment>
      <StyledPanelHeader>
        <div className="logo-title">GeoJSON Editor</div>
      </StyledPanelHeader>
      <PanelToggle
        activePanel={props.activePanel}
        panels={props.panels}
        togglePanel={props.togglePanel}
      />
    </React.Fragment>
  );
}

export default PanelHeader;

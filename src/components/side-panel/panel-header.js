import React from 'react';
import styled from 'styled-components';
import PanelToggle from './panel-toggle';

const StyledPanelHeader = styled.div`
  padding: 10px 16px;
  background-color: rgb(41, 50, 60);
  display: flex;
  justify-content: space-between;
  .logo-title {
    font-size: 14px;
    font-weight: 600;
    color: rgb(31, 186, 214);
    letter-spacing: 1.17px;
    align-items: center;
    padding: 5px;
  }
  .action {
    font-size: 14px;
    text-align: center;
    color: rgb(106, 116, 133);
    margin-left: 4px;
    width: 30px;
    border-radius: 2px;
    padding: 5px;
    :hover {
      cursor: pointer;
      color: rgb(211, 216, 224);
    }
  }
`;



function PanelHeader(props) {

  return (
    <React.Fragment>
      <StyledPanelHeader>
        <div className="logo-title">GeoJSON Editor</div>
        <div className="action" onClick={props.exportGeoJson}>导出</div>
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

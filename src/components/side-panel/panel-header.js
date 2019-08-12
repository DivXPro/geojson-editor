import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PanelToggle from './panel-toggle';
import SetupProfile from '../setup/setup-profile';

const StyledPanelHeader = styled.div.attrs({
  className: 'panel-header'
})`
  padding: 10px 16px;
  background-color: rgb(41, 50, 60);
  display: flex;
  justify-content: space-between;
  .panel-header__logo-title {
    font-size: 14px;
    font-weight: 600;
    color: rgb(31, 186, 214);
    letter-spacing: 1.17px;
    align-items: center;
    padding: 5px;
  }
  .panel-header__action {
    font-size: 14px;
    text-align: center;
    color: rgb(106, 116, 133);
    margin-left: 4px;
    width: 40px;
    border-radius: 2px;
    padding: 5px;
    :hover {
      cursor: pointer;
      color: rgb(211, 216, 224);
    }
  }
`;


function PanelHeader(props) {
  const [showSetup, setShowSetup] = useState(false);

  return (
    <React.Fragment>
      <StyledPanelHeader>
        <div className="panel-header__logo-title">{props.title}</div>
        <div className="panel-header__action" onClick={e => setShowSetup(true)}>设置</div>
      </StyledPanelHeader>
      <PanelToggle
        activePanel={props.activePanel}
        panels={props.panels}
        togglePanel={props.togglePanel}
      />
      <SetupProfile visible={showSetup} finish={e => setShowSetup(false)} />
    </React.Fragment>
  );
}

PanelHeader.propTypes = {
  activePanel: PropTypes.string,
  togglePanel: PropTypes.func
}

export default PanelHeader;

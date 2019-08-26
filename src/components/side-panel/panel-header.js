import React from 'react';
import { Dropdown } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PanelToggle from './panel-toggle';
import SvgIcon from '@/components/commons/svg-icon';

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

  return (
    <React.Fragment>
      <StyledPanelHeader>
        <div className="panel-header__logo-title">{props.title}</div>
        <div className="panel-header__action">
          <Dropdown overlay={props.menu} trigger={['click']}>
            <div>
              <SvgIcon fill="rgb(106,116,133)" hoverFill="white" name="more"></SvgIcon>
            </div>
          </Dropdown>
        </div>
      </StyledPanelHeader>
      <PanelToggle
        activePanel={props.activePanel}
        panels={props.panels}
        togglePanel={props.togglePanel}
      />
    </React.Fragment>
  );
}

PanelHeader.propTypes = {
  activePanel: PropTypes.string,
  togglePanel: PropTypes.func
}

export default PanelHeader;

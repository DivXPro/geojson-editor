import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Styled from 'styled-components';
import SvgIcon from '../commons/svg-icon';
import '@/styles/control-panel.scss';

const StyledToggleButton = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(106, 116, 133);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 6px 12px 0px;
  transition: all 0.4s ease 0s;
  border-radius: 20px;
  border-width: 0px;
  color: rgb(255, 255, 255);
  fill: rgb(255, 255, 255);
  width: 40px;
  height: 40px;
  margin: 4px 0;
  &.active {
    background-color: rgb(160, 167, 180);
  }
  :hover {
    cursor: pointer;
    background-color: rgb(160, 167, 180);
  }
`

function ToggleButton(props) {
  return (
    <StyledToggleButton className={classNames({active: props.data.mode === props.mode})} onClick={props.data.handle}>
      <SvgIcon name={props.data.icon} />
    </StyledToggleButton>
  );
}

ToggleButton.propTypes = {
  mode: PropTypes.string,
  data: PropTypes.object
};

export default ToggleButton;
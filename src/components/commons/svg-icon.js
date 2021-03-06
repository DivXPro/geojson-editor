import React from "react";
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const defaultStyle = {
  width: '30px',
  height: '30px',
  padding: '7px',
  fill: '#fff',
  hoverFill: '#fff',
}

function SvgIcon(props) {
  const StyledSvgIcon = Styled.svg`
    width: ${props.width || defaultStyle.width};
    height: ${props.width || defaultStyle.height};
    padding: ${props.padding || defaultStyle.padding};
    fill: ${props.fill || defaultStyle.fill};
    &:hover {
      fill: ${props.hoverFill || defaultStyle.hoverFill};
      cursor: ${props.cursor};
    }
  `;
  const { name } = props;
  return (
    <StyledSvgIcon>
      <use xlinkHref={"#icon-" + name} />
    </StyledSvgIcon>
  );
};

SvgIcon.propTypes = {
  name: PropTypes.string,
  fill: PropTypes.string,
}
export default SvgIcon;
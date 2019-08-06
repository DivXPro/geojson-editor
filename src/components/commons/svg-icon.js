import React from "react";
import PropTypes from 'prop-types';
import '@/styles/svg.scss';

function SvgIcon(props) {
  const { name, fill } = props;
  return (
    <svg className="small-icon">
      <use xlinkHref={"#" + name} fill={fill} />
    </svg>
  );
};

SvgIcon.propTypes = {
  name: PropTypes.string,
  fill: PropTypes.string,
}
export default SvgIcon;
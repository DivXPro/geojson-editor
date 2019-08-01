import React from "react";
import '@/styles/svg.scss';

function SvgIcon(props) {
  const { name, fill } = props;
  return (
    <svg className="small-icon">
      <use xlinkHref={"#" + name} fill={fill} />
    </svg>
  );
};

export default SvgIcon;
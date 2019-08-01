import React from 'react';
import SvgIcon from './components/commons/svg-icon';
import '@/styles/controlPanel.scss';


function ToggleButton(props) {
  function style() {
    return props.mode === props.data.mode ? 'toggle-button active' : 'toggle-button';
  }
  return <div className={style()} onClick={props.data.handle}>
    <SvgIcon name={props.data.icon} />
  </div>;
}

export default ToggleButton;
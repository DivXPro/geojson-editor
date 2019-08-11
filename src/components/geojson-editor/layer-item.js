import React, { useState } from 'react';
import Styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { SketchPicker } from 'react-color';
import { setLayer } from '@/store/actions/geojson-editor';
import SvgIcon from '../commons/svg-icon';

const StyledLayerItem = Styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 2px 16px;
  height: 28px;
  .thumbnail {
    width: 20px;
    height: 12px;
    border-radius: 2px;
    margin-right: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .name {
    flex-grow: 1;
    font-size: 12px;
    font-weight: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .popover {
    position: absolute;
    z-index: 100,
  }
  .cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &:nth-child(2n) {
    background-color: #3a3a3b;
  }
  .operator {
    display: flex;
    alignItems: center;
  }
`;
function LayerItem(props) {
  const dispatch = useDispatch();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const handlePickColor = (color) => {
    dispatch(
      setLayer(Object.assign({}, props.layer, {
        color: color.hex,
        getFillColor: [color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a * 100],
      }))
    );
    setDisplayColorPicker(false);
  }
  const toggleLayerDisplay = () => {
    dispatch(setLayer(Object.assign({}, props.layer, { hidden: !props.layer.hidden })));
  }
  const handleClose = () => {
    setDisplayColorPicker(false);
  }
  const handleClick = () => {
    setDisplayColorPicker(true);
  }

  return <StyledLayerItem>
    <div className="thumbnail" style={{ backgroundColor: props.layer.color || '#000' }} onClick={handleClick.bind(this)}></div>
    <div className="name">{props.layer.name}</div>
      {
        displayColorPicker ? 
          <div className="popover">
            <div className="cover" onClick={handleClose} />
            <SketchPicker color={props.layer.color} onChange={handlePickColor.bind(this)} />
          </div> :
          null
      }
    <div onClick={toggleLayerDisplay.bind(this)} className="operator">
      <SvgIcon fill="rgb(106,116,133)" hoverFill="white" cursor="pointer" name={ props.layer.hidden ? 'hidden': 'view_simple' } />
    </div>
    <div onClick={toggleLayerDisplay.bind(this)} className="operator">
      <SvgIcon fill="rgb(106,116,133)" hoverFill="#ff4d4f" cursor="pointer" name="delete" />
    </div>
  </StyledLayerItem>
}

export default LayerItem;
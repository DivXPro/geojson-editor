import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import { Input, Menu, Dropdown } from 'antd';
import exportJson from '@/utils/export-json';
import { setLayer, removeLayer, setLayerName, setCurrentLayer } from '@/store/actions/geojson-editor';
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
    margin: 0 10px;
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
  const [editName, setEditName] = useState(false);

  const { currentLayerId } = useSelector(state => ({
    currentLayerId: state.currentLayerId,
  }));

  useEffect(() => {
    if (editName) {
      nameEditRef.focus()
    }
  });


  const menu = () => (
    <Menu>
      <Menu.Item key="0" onClick={handleCurrent}>
        <span>编辑当前层</span>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleExport}>
        <span>导出</span>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleRemoveLayer}>
        <span>删除</span>
      </Menu.Item>
    </Menu>
  );

  let nameEditRef = null;

  const handleCurrent = () => {
    dispatch(setCurrentLayer(props.layer.uid));
  }

  const handlePickColor = (color) => {
    dispatch(
      setLayer(Object.assign({}, props.layer, {
        color: color.hex,
        getLineColor: [color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a * 100],
        getFillColor: [color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a * 100],
      }))
    );
    setDisplayColorPicker(false);
  }

  const handleEditName = () => {
    setEditName(true);
  }

  const handleChangeName = (name) => {
    dispatch(setLayerName(props.layer.uid, name));
  }

  const toggleLayerDisplay = () => {
    dispatch(setLayer(Object.assign({}, props.layer, { hidden: !props.layer.hidden })));
  }

  const handleRemoveLayer = () => {
    dispatch(removeLayer(props.layer.uid));
  }

  const handleClose = () => {
    setDisplayColorPicker(false);
  }
  const handleClick = () => {
    setDisplayColorPicker(true);
  }

  const handleExport = () => {
    exportJson(`${props.layer.name || 'layer'}.geojson`, JSON.stringify(props.layer.data));
  }

  const isCurrentLayer = () => {
    return currentLayerId === props.layer.uid;
  }

  return <StyledLayerItem>
    <div onClick={toggleLayerDisplay.bind(this)} className="operator">
      <SvgIcon fill="rgb(106,116,133)" hoverFill="white" cursor="pointer" name={props.layer.hidden ? 'hidden' : 'view_simple'} />
    </div>
    <div className="thumbnail" style={{ backgroundColor: props.layer.color || '#000' }} onClick={handleClick.bind(this)}></div>
    <Input style={{ height: '18px', display: editName ? 'block' : 'none' }} ref={input => nameEditRef = input} value={props.layer.name} onChange={e => handleChangeName(e.target.value)} onPressEnter={() => setEditName(false)} onBlur={() => setEditName(false)} />
    <div style={{ display: editName ? 'none' : 'block', fontWeight: isCurrentLayer() ? 'bolder' : 'lighter' }} className="name" onDoubleClick={handleEditName}>{props.layer.name}</div>
    {
      displayColorPicker ? 
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker color={props.layer.color} onChange={handlePickColor.bind(this)} />
        </div> :
        null
    }
    <Dropdown overlay={menu} trigger={['click']}>
      <span><SvgIcon fill="rgb(106,116,133)" cursor="pointer" name="more" /></span>
    </Dropdown>
  </StyledLayerItem>
}

export default LayerItem;
import React, { useState } from 'react';
import Styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Modal, Radio, Menu, Dropdown } from 'antd';
import { addLayer } from '@/store/actions/geojson-editor';
import LayerItem from './layer-item';
import { next } from '@/mapbox/next';
import { getDatasetList } from '@/mapbox/dataset';
import { loadDataset } from '@/store/actions/geojson-editor';
import { makeGeoJsonLayer } from '@/utils/layer';

const StyledLayerManager = Styled.section`
  background: rgb(36, 39, 48);
  min-height 480px;
  .button {
    align-items: center;
    background-color: rgb(106, 116, 133);
    color: rgb(255, 255, 255);
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    font-weight: 500;
    -webkit-box-pack: center;
    justify-content: center;
    letter-spacing: 0.3px;
    line-height: 14px;
    text-align: center;
    vertical-align: middle;
    min-width: 105px;
    opacity: 1;
    pointer-events: all;
    border-radius: 2px;
    outline: 0px;
    padding: 9px 12px;
    transition: all 0.4s ease 0s;
    margin: 16px;
  }
`

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function nextUrl(link) {
  const reg = /^<https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*>; rel="next"$/i;
  const linkReg = /https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*/i
  return reg.test(link) ? link.match(linkReg)[0] : null;
}

function LayerList(props) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [chosed, setChosed] = useState(null);

  const { layers } = useSelector(state => ({
    layers: state.layers,
  }));
  const loadDatasets = async (url) => {
    const { data, headers } = url ? await next(url) : await getDatasetList();
    const nextUri = nextUrl(headers.link);
    if (nextUri) {
      const nextData = await loadDatasets(nextUrl(headers.link));
      data.datasets.push(...nextData.datasets);
    }
    return data;
  }
  const importGeoJSON = (file) => {
    const reader = new FileReader();
    const nameArr = file.name.split('.');
    nameArr.pop();
    const name = nameArr.join('.');
    reader.readAsText(file);
    reader.onload = (e) => {
      const layer = makeGeoJsonLayer({
        name,
        data: JSON.parse(e.target.result),
        pickable: false,
        stroked: false,
        filled: true,
        extruded: false,
        lineWidthScale: 1,
        lineWidthMinPixels: 2,
        lineWidthMaxPixels: 3,
        getFillColor: [],
        getRadius: 100,
        getLineWidth: 1,
        getElevation: 30,
        hidden: false,
      });
      dispatch(addLayer(layer));
    }
  }
  const createLayer = () => {
    const layer = makeGeoJsonLayer({
      name: 'untitled',
      data: { "type": "FeatureCollection", "features": [] },
      pickable: false,
      stroked: false,
      filled: true,
      extruded: false,
      lineWidthScale: 1,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      getFillColor: [],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
      hidden: false,
    });
    dispatch(addLayer(layer));
  }
  const importDataset = () => {
    dispatch(loadDataset(chosed.id, chosed.name))
    setVisible(false);
  }
  const handleImport = async () => { 
    const sets = await loadDatasets();
    setDatasets(sets);
    setVisible(true);
  }

  const menu = () => (
    <Menu>
      <Menu.Item key="0" onClick={createLayer}>
        <span>新建图层</span>
      </Menu.Item>
      <Menu.Item key="1">
        <Upload customRequest={e => importGeoJSON(e.file)} showUploadList={false} accept=".geojson,.json">
          <div className="button">导入GeoJSON</div>
        </Upload>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleImport}>
        <span>导入Dataset</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledLayerManager>
      <Dropdown overlay={menu} trigger={['click']}>
        <div className="button">新图层</div>
      </Dropdown>
      {layers.map(layer => (<LayerItem key={layer.id} layer={layer} />))}
      <Modal title="导入Dataset" visible={visible} onOk={importDataset} onCancel={e => setVisible(false)}>
        <Radio.Group value={chosed} onChange={e => setChosed(e.target.value)}>
          {datasets.map(set => (
            <Radio style={radioStyle} key={set.id} value={set}>
              {set.name}
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </StyledLayerManager>
  )
}

export default LayerList;
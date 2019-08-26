import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import JSZip from 'jszip';
import { Menu } from 'antd';
import PanelHeader from '../side-panel/panel-header';
import FeatureProfile from './feature-profile';
import LayerManager from './layer-manager';
import { StyledSidePanel, StyledSideContainer} from '../side-panel/side-panel';
import Property from './property';
import SetupProfile from '../setup/setup-profile';
import { exportFile } from '@/utils/export-json';

function SideBar (props) {
  const panels = [
    { id: 'layers', icon: 'layers' },
    { id: 'feature', icon: 'geo_feature' },
  ];

  const [activePanel, setActivePanel] = useState(panels[0].id);
  const [showSetup, setShowSetup] = useState(false);
  const { layers } = useSelector(state => ({
    layers: state.layers,
  }));

  function togglePanel(id) {
    setActivePanel(id);
  }

  function exportZip() {
    const zip = new JSZip();
    const zfiles = zip.folder('geojson');
    layers.forEach(layer => {
      zfiles.file(`${layer.name}.geojson`, JSON.stringify(layer.data));
    });
    zip.generateAsync({ type: "blob" }).then(content => {
      exportFile('geojson.zip', content)
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div onClick={e => setShowSetup(true)}>设置</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={exportZip.bind(this)}>打包导出</div>
      </Menu.Item>
    </Menu>
  );


  const headerProps = {
    panels,
    activePanel,
    togglePanel,
    title: 'GeoJSON Editor',
    menu,
  }

  return (
    <StyledSideContainer>
      <StyledSidePanel>
        <PanelHeader {...headerProps}></PanelHeader>
        {activePanel === 'feature' && <FeatureProfile content={Property}></FeatureProfile>}
        {activePanel === 'layers' && <LayerManager></LayerManager>}
      </StyledSidePanel>
      <SetupProfile visible={showSetup} finish={e => setShowSetup(false)} />
    </StyledSideContainer>
  )
}

export default SideBar;

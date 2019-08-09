import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import exportJson from '@/utils/export-json';
import PanelHeader from '../side-panel/panel-header';
import FeatureProfile from './feature-profile';
import LayerManager from './layer-manager';
import StyledSidePanel from '../side-panel/side-panel';
import JsonEditor from './json-editor';

function SideBar (props) {
  const { geometry } = useSelector(state => ({
    geometry: state.geometry
  }));
  
  const panels = [
    { id: 'feature', icon: 'geo_feature' },
    { id: 'layers', icon: 'layers' },
  ];

  const [activePanel, setActivePanel] = useState(panels[0].id);

  function togglePanel(id) {
    setActivePanel(id);
  }

  function exportGeometry() {
    exportJson('marker.geojson', JSON.stringify(geometry));
  }

  const headerProps = {
    panels,
    activePanel,
    togglePanel,
    title: 'GeoJSON Editor',
    action: '导出',
    onAction: exportGeometry.bind(this),
  }

  return (
    <StyledSidePanel>
      <PanelHeader {...headerProps}></PanelHeader>
      {activePanel === 'feature' && <FeatureProfile content={JsonEditor}></FeatureProfile>}
      {activePanel === 'layers' && <LayerManager></LayerManager>}
    </StyledSidePanel>
  )
}

export default SideBar;

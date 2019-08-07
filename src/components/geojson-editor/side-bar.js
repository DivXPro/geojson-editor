import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import PanelHeader from '../side-panel/panel-header';
import FeatureProfile from '../side-panel/feature-profile';
import LayerList from '../side-panel/layer-list';
import StyledSidePanel from '../side-panel/side-panel';
import exportJson from '@/utils/export-json';


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
    exportJson(JSON.stringify(geometry));
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
      {activePanel === 'feature' && <FeatureProfile></FeatureProfile>}
      {activePanel === 'layers' && <LayerList></LayerList>}
    </StyledSidePanel>
  )
}

export default SideBar;

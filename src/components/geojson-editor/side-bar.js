import React, { useState } from 'react';
import PanelHeader from '../side-panel/panel-header';
import FeatureProfile from './feature-profile';
import LayerManager from './layer-manager';
import StyledSidePanel from '../side-panel/side-panel';
import JsonEditor from './json-editor';
import Property from './property';

function SideBar (props) {
  const panels = [
    { id: 'layers', icon: 'layers' },
    { id: 'feature', icon: 'geo_feature' },
  ];

  const [activePanel, setActivePanel] = useState(panels[0].id);

  function togglePanel(id) {
    setActivePanel(id);
  }

  const headerProps = {
    panels,
    activePanel,
    togglePanel,
    title: 'GeoJSON Editor',
  }

  return (
    <StyledSidePanel>
      <PanelHeader {...headerProps}></PanelHeader>
      {activePanel === 'feature' && <FeatureProfile content={Property}></FeatureProfile>}
      {activePanel === 'layers' && <LayerManager></LayerManager>}
    </StyledSidePanel>
  )
}

export default SideBar;

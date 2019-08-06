import React, { useState } from 'react';
import styled from 'styled-components';
import PanelHeader from './panel-header';
import FeatureProfile from './feature-profile';
import LayerList from './layer-list';

const StyledSideBar = styled.div`
  position: absolute;
  z-index: 1000;
  top: 40px;
  right: 20px;
  width: 300px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  transition: left 250ms ease 0s, right 250ms ease 0s;
  background: white;
`;


function SideBar (props) {
  const panels = [
    { id: 'feature', icon: 'geo_feature' },
    { id: 'layers', icon: 'layers' },
  ];

  const [activePanel, setActivePanel] = useState(panels[0].id);

  function togglePanel(id) {
    setActivePanel(id);
  }


  return (
    <StyledSideBar className="side-bar">
      <PanelHeader panels={panels} activePanel={activePanel} togglePanel={togglePanel}></PanelHeader>
      {activePanel === 'feature' && <FeatureProfile></FeatureProfile>}
      {activePanel === 'layers' && <LayerList></LayerList>}
    </StyledSideBar>
  )
}

export default SideBar;

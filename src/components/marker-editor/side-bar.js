import React from 'react';
import { useSelector } from 'react-redux';

import exportJson from '@/utils/export-json';
import PanelHeader from '../side-panel/panel-header';
import StyledSidePanel from '../side-panel/side-panel';

function SideBar(props) {
  const { markers } = useSelector(state => ({
    markers: state.markers
  }));

  const headerProps = {
    title: 'Marker Editor',
    action: '导出',
    onAction: exportMarkers.bind(this),
  }

  function exportMarkers() {
    exportJson(JSON.stringify(markers));
  }

  return (
    <StyledSidePanel>
      <PanelHeader {...headerProps}></PanelHeader>
    </StyledSidePanel>
  )
}

export default SideBar;

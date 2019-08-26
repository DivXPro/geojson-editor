import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Immutable from 'immutable';
import exportJson from '@/utils/export-json';
import PanelHeader from '../side-panel/panel-header';
import { StyledSidePanel, StyledSideContainer } from '../side-panel/side-panel';
import { setCurrentMarker } from '@/store/actions/marker-editor';
import MarkerProfile from './marker-profile';

function SideBar(props) {
  const { markers } = useSelector(state => ({
    markers: state.markers
  }));
  const dispatch = useDispatch();

  const headerProps = {
    title: 'Marker Editor',
    action: '导出',
    onAction: exportMarkers.bind(this),
  }

  function exportMarkers() {
    exportJson('maker.json', JSON.stringify(markers));
  }

  function handleSetCurrentMarkKV(key, value) {
    dispatch(setCurrentMarker(Immutable.set(this.props.currentMarker, key, value)));
  }

  return (
    <StyledSideContainer>
      <StyledSidePanel>
        <PanelHeader {...headerProps}></PanelHeader>
        <MarkerProfile onChange={handleSetCurrentMarkKV.bind(this)} />
      </StyledSidePanel>
    </StyledSideContainer>
  )
}

export default SideBar;

import React from 'react';
import MapGL from 'react-map-gl';
import { connect } from 'react-redux'
import DeckGL from '@deck.gl/react';
import uuidv4 from 'uuid/v4';
import Immutable from 'immutable';
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import { GlobalHotKeys } from 'react-hotkeys';

import { addMarker, setCurrentMarker } from '@/store/actions/marker-editor';
import MarkerProperties from './marker-properties';
import iconAtlas from '../../icon-atlas.png';
import { Modal } from 'antd';

const keyMap = {
  SHIFT_DOWN: { sequence: 'shift', action: 'keydown' },
  SHIFT_UP: { sequence: 'shift', action: 'keyup' },
  ALT_DOWN: { sequence: 'alt', action: 'keydown' },
  ALT_UP: { sequence: 'alt', action: 'keyup' },
  ENTER: 'enter',
  DEL: ['del', 'backspace']
};

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
};

function mapStateToProps(state) {
  return {
    markers: state.markers,
    baseGeom: state.baseGeom,
    currentMarker: state.currentMarker,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addMarker: marker => dispatch(addMarker(marker)),
    setCurrentMarker: marker => dispatch(setCurrentMarker(marker))
  }
}

export class MarkerEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointsRemovable: true,
      viewport: props.viewport,
    }
  }

  renderStaticMap(viewport: Object) {
    return <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw'}
    />;
  }

  get baseLayer() {
    return new GeoJsonLayer({
      id: 'geojson-layer',
      data: this.baseGeom,
      pickable: false,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 6,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      getFillColor: [160, 160, 180, 200],
      getRadius: 100,
      getLineWidth: 2,
      getElevation: 30,
    });
  }

  handleAddMarker() {
    this.props.addMarker(this.props.currentMarker);
  }

  handleSetCurrentMarkKV(key, value) {
    this.props.setCurrentMarker(Immutable.set(this.props.currentMarker, key, value));
  }

  handleDeckClick({ coordinate, index }) {
    if (index === -1) {
      const defaultMarker = {
        id: uuidv4(),
        icon: 'marker',
        coordinates: coordinate,
      }
      this.props.setCurrentMarker(defaultMarker);
      Modal.confirm({
        title: 'New Marker',
        icon: null,
        content: <MarkerProperties marker={defaultMarker} onChange={this.handleSetCurrentMarkKV.bind(this)} />,
        onOk: this.handleAddMarker.bind(this),
      });
    }
  }

  render() {
    const markerLayer = new IconLayer({
      id: 'marker-layer',
      data: this.props.markers,
      pickable: true,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      iconAtlas: iconAtlas,
      iconMapping: ICON_MAPPING,
      getIcon: d => d.icon,
      sizeScale: 15,
      getPosition: d => d.coordinates,
      getSize: d => 3,
      getColor: d => [144, 140, 0],
      // onHover: ({ object, x, y }) => {
      //   const tooltip = `${object.name}\n${object.address}`;
      //   /* Update tooltip
      //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      //   */
      // }
    });
  
    const handleKeyPress = {
      // SHIFT_DOWN: this.shiftDownHandle.bind(this),
      // ALT_DOWN: this.altDownHandle.bind(this),
      // ALT_UP: this.altUpHandle.bind(this),
      // DEL: this.delHandle.bind(this),
      // ENTER: this.enterHandle.bind(this)
    };

    return (
      <React.Fragment>
        <GlobalHotKeys keyMap={keyMap} handlers={handleKeyPress}>
          <DeckGL
            width="100%"
            height="100%"
            initialViewState={this.state.viewport}
            onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
            // getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
            onClick={this.handleDeckClick.bind(this)}
            pickingRadius={5}
            layers={[markerLayer, this.baseLayer]}
            controller={true}>
            {this.renderStaticMap(this.state.viewport)}
          </DeckGL>
        </GlobalHotKeys>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerEditor);
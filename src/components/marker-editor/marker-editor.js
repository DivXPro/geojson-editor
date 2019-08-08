import React from 'react';
import MapGL from 'react-map-gl';
import { connect } from 'react-redux'
import { Modal } from 'antd';
import DeckGL from '@deck.gl/react';
import uuidv4 from 'uuid/v4';
import Immutable from 'immutable';
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import { GlobalHotKeys } from 'react-hotkeys';

import { addMarker, setMarker, setCurrentMarker, setMode } from '@/store/actions/marker-editor';
import MarkerProperties from './marker-properties';
import iconAtlas from '../../icon-atlas.png';
import ControlPlanel from '@/components/control-panel/control-panel';


const VIEW_MODE = 'VIEW_MODE';
const ADD_MARKER_MODE = 'ADD_MARKER_MODE';

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
    mode: state.mode,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addMarker: marker => dispatch(addMarker(marker)),
    setMarker: marker => dispatch(setMarker(marker)),
    setCurrentMarker: marker => dispatch(setCurrentMarker(marker)),
    setMode: mode => dispatch(setMode(mode)),
  }
}

export class MarkerEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointsRemovable: true,
      viewport: props.viewport,
      interactive: true,
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

  get markers() {
    return this.props.markers.map(marker => {
      if (this.props.currentMarker && marker.id === this.props.currentMarker.id) {
        return Object.assign({}, marker, { '_picked': true });
      }
      return marker;
    })
  }

  handleAddMarker() {
    this.props.addMarker(this.props.currentMarker);
  }

  handleSetMarker() {
    this.props.setMarker(this.props.currentMarker);
  }

  handleSetCurrentMarkKV(key, value) {
    this.props.setCurrentMarker(Immutable.set(this.props.currentMarker, key, value));
  }

  handleMarkerPicker({ index, object }) {
    this.props.setCurrentMarker(object);
    Modal.confirm({
      title: 'Edit Marker',
      icon: null,
      content: <MarkerProperties marker={object} onChange={this.handleSetCurrentMarkKV.bind(this)} />,
      onOk: this.handleSetMarker.bind(this),
    });
  }

  createMarker(coordinates) {
    if (this.props.mode === ADD_MARKER_MODE) {
      const defaultMarker = {
        id: uuidv4(),
        icon: 'marker',
        coordinates,
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

  handleMarkerDrag({ coordinate, object }) {
    this.props.setMarker(Immutable.set(object, 'coordinates', coordinate));
  }

  toggleInteractive(interactive: boolean) {
    this.setState({ interactive });
  }

  handleDeckClick({ coordinate, index }) {
    if (index === -1) {
      this.createMarker(coordinate)
    }
  }
  

  render() {
    const markerLayer = new IconLayer({
      id: 'marker-layer',
      data: this.markers,
      pickable: true,
      iconAtlas: iconAtlas,
      iconMapping: ICON_MAPPING,
      getIcon: d => d.icon,
      sizeScale: 15,
      getPosition: d => d.coordinates,
      getSize: d => 3,
      getColor: d => d['_picked'] ? [44, 140, 0] : [144, 140, 0],
      onClick: this.handleMarkerPicker.bind(this),
      onDrag: this.handleMarkerDrag.bind(this),
      onDragStart: this.toggleInteractive.bind(this, false),
      onDragEnd: this.toggleInteractive.bind(this, true),
    });

    const toggles = [
      {
        text: 'View',
        icon: 'view_simple',
        mode: VIEW_MODE,
        handle: this.props.setMode.bind(this, VIEW_MODE)
      },
      {
        text: 'Add Mark',
        icon: 'pin_sharp_plus',
        mode: ADD_MARKER_MODE,
        handle: this.props.setMode.bind(this, ADD_MARKER_MODE)
      }
    ];
  
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
            controller={this.state.interactive}>
            {this.renderStaticMap(this.state.viewport)}
          </DeckGL>
        </GlobalHotKeys>
        <ControlPlanel toggles={toggles} />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerEditor);
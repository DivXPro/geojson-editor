import React from 'react';
import DeckGL from '@deck.gl/react';
import { fromJS } from 'immutable';
import MapGL from 'react-map-gl';
import { HotKeys } from 'react-hotkeys';
import { EditableGeoJsonLayer } from 'nebula.gl';

import exportJson from '@/utils/export-json';
import ControlPlanel from './control-panel';
import SliderBar from './slider-bar';

const DRAW_LINE_STRING = 'drawLineString';
const DRAW_PROLYGON = 'drawPolygon';
const DRAW_POINT = 'drawPoint';
const DRAW_CIRCLE_FROM_CENTER = 'drawCircleFromCenter';
const MODIFY_MODE = 'modify';
const EXTRUDE_MODE = 'extrude';
const SCALE_MODE = 'scale';
const ROTATE_MODE = 'rotate';
const TRANSLATE_MODE = 'translate';
const VIEW_MODE = 'view';

const keyMap = {
  SHIFT_DOWN: { sequence: 'shift', action: 'keydown' },
  SHIFT_UP: { sequence: 'shift', action: 'keyup' },
  ALT_DOWN: { sequence: 'alt', action: 'keydown' },
  ALT_UP: { sequence: 'alt', action: 'keyup' },
  ENTER: 'enter',
  DEL: ['del', 'backspace']
};


export default class GeoJsonEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeatureIndexes: [],
      geo: {
        type: 'FeatureCollection',
        features: [
          { "type": "Feature", "properties": {}, "geometry": { "type": "LineString", "coordinates": [[-122.40880966186523, 37.783536601521924], [-122.43893623352051, 37.779669924659004], [-122.43515968322752, 37.7624370109886], [-122.42348670959471, 37.77180027337861], [-122.4250316619873, 37.778584505321376], [-122.42314338684082, 37.778652344496926], [-122.42357254028322, 37.77987343901049], [-122.41198539733887, 37.78109451335266]] } },
        ]
      },
      mode: VIEW_MODE,
      pointsRemovable: true,
      viewport: props.viewport,
      currentIndex: null,
    }
  }

  shiftDownHandle(e) {
    // TODO:
  }

  enterHandle(e) {
    if (this.state.mode !== VIEW_MODE) {
      this.setViewMode();
    }
  }

  altDownHandle(e) {
    this.setMode(DRAW_LINE_STRING);
  }

  altUpHandle(e) {
    this.setViewMode();
  }

  delHandle(e) {
    console.log(e, 'del handle');
  }

  setMode(mode) {
    this.setState({ mode });
  }

  setViewMode() {
    this.setState({
      mode: VIEW_MODE,
      selectedFeatureIndexes: [],
      currentIndex: null
    });
  }

  setDrawMode(mode) {
    this.setState({
      mode,
      selectedFeatureIndexes: [],
      currentIndex: null
    });
  }

  setEditMode(mode) {
    this.setState({ mode });
  }

  setCurrentGeoJson(geojson: string, index: string) {
    const geoImmutable = fromJS(this.state.geo);
    this.setState({
      geo: geoImmutable.set('features', geoImmutable.get('features').set(index, JSON.parse(geojson))).toJS()
    });
  }

  exportGeoJson() {
    exportJson(JSON.stringify(this.state.geo));
  }

  renderStaticMap(viewport: Object) {
    return <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    />;
  }

  get currentGeoJson() {
    return this.state.geo.features[this.state.currentIndex];
  }

  handleDeckClick(e) {
    if (this.state.mode === MODIFY_MODE) {
      if (e.index === -1 && e.object == null)
      this.setViewMode();
    }
  }
  

  render() {
    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'draw-layer',
      data: this.state.geo,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      mode: this.state.mode,
      pickable: true,
      autoHighlight: true,
      lineWidthScale: 6,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      onHover: ({ object, x, y, coordinate }) => {
        // const index = this.state.geo.features.findIndex(d => d === object);
      },
      onClick: ({ object, x, y, coordinate }) => {
        const index = this.state.geo.features.findIndex(d => d === object);
        if (this.state.mode === VIEW_MODE) {
          this.setState({
            selectedFeatureIndexes: [index],
            currentIndex: index,
            mode: TRANSLATE_MODE
          })
        }
      },
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          return;
        }
        if (editType === 'addFeature' && this.state.mode !== 'duplicate') {
          featureIndexes = featureIndexes || editContext.featureIndexes;
          updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
        }
        this.setState({
          geo: updatedData,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      }
    });

    const handleKeyPress = {
      SHIFT_DOWN: this.shiftDownHandle.bind(this),
      ALT_DOWN: this.altDownHandle.bind(this),
      ALT_UP: this.altUpHandle.bind(this),
      DEL: this.delHandle.bind(this),
      ENTER: this.enterHandle.bind(this)
    };

    const toggles = [
      {
        text: 'View',
        icon: 'view_simple',
        mode: VIEW_MODE,
        handle: this.setViewMode.bind(this)
      },
      {
        text: 'LineString',
        icon: 'arrow_right',
        mode: DRAW_LINE_STRING,
        handle: this.setDrawMode.bind(this, DRAW_LINE_STRING)
      },
      {
        text: 'Polygon',
        icon: 'sharp',
        mode: DRAW_PROLYGON,
        handle: this.setDrawMode.bind(this, DRAW_PROLYGON)
      },
      {
        text: 'Point',
        icon: 'pin_sharp_plus',
        mode: DRAW_POINT,
        handle: this.setDrawMode.bind(this, DRAW_POINT)
      },
      {
        text: 'CircleFromCenter',
        icon: 'plus_circle',
        mode: DRAW_CIRCLE_FROM_CENTER,
        handle: this.setDrawMode.bind(this, DRAW_CIRCLE_FROM_CENTER)
      },
      {
        text: 'Movement',
        icon: 'arrow_all',
        mode: TRANSLATE_MODE,
        handle: this.setEditMode.bind(this, TRANSLATE_MODE)
      },
      {
        text: 'Modify',
        icon: 'arrow_right_corner',
        mode: MODIFY_MODE,
        handle: this.setEditMode.bind(this, MODIFY_MODE)
      },
      {
        text: 'Rotate',
        icon: 'arrow_repeat',
        mode: ROTATE_MODE,
        handle: this.setEditMode.bind(this, ROTATE_MODE)
      },
      // {
      //   text: 'Extrude',
      //   icon: 'arrow_repeat',
      //   mode: EXTRUDE_MODE,
      //   handle: this.setEditMode.bind(this, EXTRUDE_MODE)
      // },
      {
        text: 'Scale',
        icon: 'resize',
        mode: SCALE_MODE,
        handle: this.setEditMode.bind(this, SCALE_MODE)
      },
      {
        text: 'download',
        icon: 'cloud_down',
        handle: this.exportGeoJson.bind(this)
      }
    ];
    
    return <React.Fragment>
      <HotKeys keyMap={keyMap}>
        <HotKeys handlers={handleKeyPress}>
          <DeckGL
            width="100%"
            height="100%"
            initialViewState={this.props.viewport}
            onViewStateChange={({viewState}) => this.setState({ viewport: viewState })}
            // getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
            onClick={this.handleDeckClick.bind(this)}
            pickingRadius={5}
            layers={[editableGeoJsonLayer]}
            controller={true}>
            {this.renderStaticMap(this.state.viewport)}
          </DeckGL>
        </HotKeys>
      </HotKeys>
      <ControlPlanel toggles={toggles} mode={this.state.mode} />
      <SliderBar index={this.state.currentIndex} geojson={this.currentGeoJson} setCurrentGeoJson={this.setCurrentGeoJson.bind(this)}></SliderBar>
    </React.Fragment>;
  }
}


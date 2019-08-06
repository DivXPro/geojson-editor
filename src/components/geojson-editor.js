import React from 'react';
import DeckGL from '@deck.gl/react';
import { fromJS } from 'immutable';
import MapGL from 'react-map-gl';
import { GlobalHotKeys } from 'react-hotkeys';
import { EditableGeoJsonLayer } from 'nebula.gl';
import { GeoJsonLayer } from '@deck.gl/layers';

import exportJson from '@/utils/export-json';
import cutGeometry from '@/utils/cutGeometry';
import ControlPlanel from './control-panel';
import SideBar from './side-panel/side-bar';

const DRAW_LINE_STRING = 'drawLineString';
const DRAW_POLYGON = 'drawPolygon';
const DRAW_POINT = 'drawPoint';
const DRAW_CIRCLE_FROM_CENTER = 'drawCircleFromCenter';
const MODIFY_MODE = 'modify';
const EXTRUDE_MODE = 'extrude';
const SPLIT_MODE = 'split'
const SCALE_MODE = 'scale';
const ROTATE_MODE = 'rotate';
const TRANSLATE_MODE = 'translate';
const VIEW_MODE = 'view';
const CUT_MODE = 'cut';

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
        features: []
      },
      baseGeom: {
        type: 'FeatureCollection',
        features: []
      },
      mode: VIEW_MODE,
      pointsRemovable: true,
      viewport: props.viewport,
      currentIndex: null,
    }
  }

  get currentGeoJson() {
    return this.state.geo.features[this.state.currentIndex];
  }

  shiftDownHandle(e) {
    // TODO:
  }

  enterHandle() {
    if (this.state.mode !== VIEW_MODE) {
      this.setViewMode();
    }
  }

  altDownHandle() {
    this.setMode(DRAW_LINE_STRING);
  }

  altUpHandle() {
    this.setViewMode();
  }

  delHandle() {
    if (this.state.selectedFeatureIndexes.length > 0) {
      this.state.selectedFeatureIndexes.forEach(idx => {
        this.removeFeature(idx);
      });
      this.setState({
        selectedFeatureIndexes: [],
        currentIndex: null
      });
    }
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
    if (this.state.selectedFeatureIndexes.length > 0) {
      this.setState({ mode });
    }
  }

  // 切割模式
  setCutMode() {
    this.setState({
      selectedFeatureIndexes: [],
      mode: CUT_MODE
    });
  }

  setBaseGeom(baseGeom) {
    this.setState({
      baseGeom
    });
  }

  setCurrentGeoJson(geojson: string, index: string) {
    const geoImmutable = fromJS(this.state.geo);
    this.setState({
      geo: geoImmutable.set('features', geoImmutable.get('features').set(index, JSON.parse(geojson))).toJS()
    });
  }

  removeFeature(index: number) {
    const geoImmutable = fromJS(this.state.geo);
    this.setState({
      geo: geoImmutable.set('features', geoImmutable.get('features').remove(index)).toJS()
    });
  }

  // 导出GeoJson格式文件
  exportGeoJson() {
    exportJson(JSON.stringify(this.state.geo));
  }

  handleDeckClick(e) {
    if (
      this.state.mode !== DRAW_LINE_STRING &&
      this.state.mode !== DRAW_POLYGON &&
      this.state.mode !== DRAW_CIRCLE_FROM_CENTER &&
      this.state.mode !== DRAW_POINT &&
      this.state.mode !== CUT_MODE &&
      this.state.mode !== SPLIT_MODE
    ) {
      if (e.index === -1 && e.object == null) {
        this.setState({
          currentIndex: null,
          selectedFeatureIndexes: [],
          mode: VIEW_MODE
        });
      }
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
      data: this.state.baseGeom,
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

  render() {
    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'draw-layer',
      data: this.state.geo,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      mode: this.state.mode === CUT_MODE ? DRAW_POLYGON : this.state.mode,
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
        if (this.state.mode === VIEW_MODE || this.state.mode === TRANSLATE_MODE) {
          this.setState({
            selectedFeatureIndexes: [index],
            currentIndex: index,
            mode: TRANSLATE_MODE
          });
        }
      },
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          return;
        }
        if (editType === 'addFeature') {
          if (this.state.mode === CUT_MODE) {
            updatedData = cutGeometry(updatedData, updatedData.features[featureIndexes[0]]);
            updatedSelectedFeatureIndexes = [];
            this.setState({
              geo: updatedData,
              selectedFeatureIndexes: updatedSelectedFeatureIndexes,
              mode: VIEW_MODE
            });
            return;
          } else if (this.state.mode !== 'duplicate') {
            featureIndexes = featureIndexes || editContext.featureIndexes;
            updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
          }
        }
        this.setState({
          geo: updatedData,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes,
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
        mode: DRAW_POLYGON,
        handle: this.setDrawMode.bind(this, DRAW_POLYGON)
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
      {
        text: 'Scale',
        icon: 'resize',
        mode: SCALE_MODE,
        handle: this.setEditMode.bind(this, SCALE_MODE)
      },
      {
        text: 'Split',
        icon: 'focus_horizontal',
        mode: SPLIT_MODE,
        handle: this.setEditMode.bind(this, SPLIT_MODE)
      },
      {
        text: 'Cut',
        icon: 'exclude',
        mode: CUT_MODE,
        handle: this.setCutMode.bind(this)
      }
    ];
    
    return <React.Fragment>
      <GlobalHotKeys keyMap={keyMap} handlers={handleKeyPress}>
        <DeckGL
          width="100%"
          height="100%"
          initialViewState={this.props.viewport}
          onViewStateChange={({viewState}) => this.setState({ viewport: viewState })}
          // getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          onClick={this.handleDeckClick.bind(this)}
          pickingRadius={5}
          layers={[editableGeoJsonLayer, this.baseLayer]}
          controller={true}>
          {this.renderStaticMap(this.state.viewport)}
        </DeckGL>
      </GlobalHotKeys>
      <ControlPlanel toggles={toggles} mode={this.state.mode} />
      <SideBar
        index={this.state.currentIndex}
        feature={this.currentGeoJson}
        setCurrentGeoJson={this.setCurrentGeoJson.bind(this)}
        setBaseGeom={this.setBaseGeom.bind(this)}
        exportGeoJson={this.exportGeoJson.bind(this)}
      />
    </React.Fragment>;
  }
}


import React from 'react';
import DeckGL from '@deck.gl/react';
import MapGL from 'react-map-gl';
import uuidv4 from 'uuid/v4';
import { GlobalHotKeys } from 'react-hotkeys';
import { connect } from 'react-redux'
import { EditableGeoJsonLayer } from 'nebula.gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { setGeometry, setSelectFeatureIndexes, setMode, removeFeature, loadDataset, addFeature } from '@/store/actions/geojson-editor';
import cutGeometry from '@/utils/cut-geometry';
import SideBar from './side-bar';
import ControlPlanel from '@/components/control-panel/control-panel';

const DRAW_LINE_STRING = 'drawLineString';
const DRAW_POLYGON = 'drawPolygon';
const DRAW_90_DEGREE_POLYGON = 'draw90DegreePolygon'
const DRAW_POINT = 'drawPoint';
const DRAW_CIRCLE_FROM_CENTER = 'drawCircleFromCenter';
const MODIFY_MODE = 'modify';
const SPLIT_MODE = 'split'
const SCALE_MODE = 'scale';
const ROTATE_MODE = 'rotate';
const TRANSLATE_MODE = 'translate';
const VIEW_MODE = 'view';
const CUT_MODE = 'cut';

const keyMap = {
  SHIFT: 'shift',
  ALT_DOWN: { sequence: 'alt', action: 'keydown' },
  CTRL_AND_C: ['ctrl+c', 'command+c'],
  CTRL_AND_V: ['ctrl+v', 'command+v'],
  ALT_UP: { sequence: 'alt', action: 'keyup' },
  ENTER: 'enter',
  DEL: ['del', 'backspace']
};

function mapStateToProps(state) {
  return {
    geometry: state.geometry,
    mode: state.mode,
    selectedFeatureIndexes: state.selectedFeatureIndexes,
    layers: state.layers,
    currentLayerId: state.currentLayerId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setGeometry: geometry => dispatch(setGeometry(geometry)),
    setSelectFeatureIndexes: indexes => dispatch(setSelectFeatureIndexes(indexes)),
    setMode: mode => dispatch(setMode(mode)),
    removeFeature: index => dispatch(removeFeature(index)),
    loadDataset: datasetId => dispatch(loadDataset(datasetId)),
    addFeature: features => dispatch(addFeature(features)),
  }
}

export class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointsRemovable: true,
      viewport: props.viewport,
      copyFeatures: null
    }
  }

  get geometry() {
    return this.props.geometry;
  }

  get mode() {
    return this.props.mode;
  }

  get selectedFeatureIndexes() {
    return this.props.selectedFeatureIndexes;
  }


  enterHandle() {
    if (this.mode !== VIEW_MODE) {
      this.setViewMode();
    }
  }

  altDownHandle() {
    this.props.setMode(DRAW_LINE_STRING);
  }

  altUpHandle() {
    this.setViewMode();
  }

  shiftHandle() {
    if (this.mode === DRAW_POLYGON) {
      this.props.setMode(DRAW_90_DEGREE_POLYGON);
    } else if (this.mode === DRAW_90_DEGREE_POLYGON) {
      this.props.setMode(DRAW_POLYGON);
    }
  }

  ctrlAndCHandle() {
    this.copyFeature();
  }

  ctrlAndVHandle() {
    this.pasteFeature();
  }

  copyFeature() {
    if (this.selectedFeatureIndexes.length > 0 && this.currentLayer) {
      const features = this.currentLayer.data.features.filter((f, fidx) => this.selectedFeatureIndexes.findIndex(idx => idx === fidx) > -1);
      this.setState({
        copyFeatures: features.map(f => ({ ...f, id: uuidv4()}))
      });
    }
  }

  pasteFeature() {
    if (this.state.copyFeatures != null && this.state.copyFeatures.length > 0) {
      this.props.addFeature(this.state.copyFeatures)
    }
  }

  delHandle() {
    if (this.selectedFeatureIndexes.length > 0) {
      this.selectedFeatureIndexes.forEach(idx => {
        this.props.removeFeature(idx);
      });
      this.setState({
        selectedFeatureIndexes: [],
      });
    }
  }

  setViewMode() {
    this.props.setMode(VIEW_MODE);
    this.props.setSelectFeatureIndexes([])
  }

  setDrawMode(mode) {
    this.props.setMode(mode);
    this.props.setSelectFeatureIndexes([])
  }

  setEditMode(mode) {
    if (this.selectedFeatureIndexes.length > 0) {
      this.props.setMode(mode);
    }
  }

  // 切割模式
  setCutMode() {
    this.props.setMode(CUT_MODE);
    this.props.setSelectFeatureIndexes([]);
  }

  removeFeatureByIndex(index: number) {
    this.props.removeFeature(index);
  }

  handleDeckClick(e) {
    if (
      [DRAW_LINE_STRING, DRAW_POLYGON, DRAW_90_DEGREE_POLYGON, DRAW_CIRCLE_FROM_CENTER, DRAW_POINT, CUT_MODE, SPLIT_MODE].findIndex(m => m === this.mode) === -1
    ) {
      if (e.index === -1 && e.object == null) {
        this.props.setSelectFeatureIndexes([]);
        this.props.setMode(VIEW_MODE);
      }
    }
  }

  renderStaticMap(viewport: Object) {
    return <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v10"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw'}
    />;
  }

  get layers() {
    return this.props.layers.filter(layer => !layer.hidden && layer.id !== this.props.currentLayerId).map(layer => new GeoJsonLayer(layer));
  }

  get currentLayer() {
    return this.props.layers.find(layer => layer.id === this.props.currentLayerId);
  }

  render() {
    const editableGeoJsonLayer = new EditableGeoJsonLayer(Object.assign({}, this.currentLayer, {
      selectedFeatureIndexes: this.selectedFeatureIndexes,
      mode: this.mode === CUT_MODE ? DRAW_POLYGON : this.mode,
      lineWidthScale: 2,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 2,
      pickable: true,
      onHover: ({ object, x, y, coordinate }) => {
        // const index = this.state.geo.features.findIndex(d => d === object);
      },
      onClick: ({ object, x, y, coordinate }) => {
        const index = this.currentLayer.data.features.findIndex(d => d === object);
        if (this.mode === VIEW_MODE || this.mode === TRANSLATE_MODE) {
          this.props.setSelectFeatureIndexes([index]);
          this.props.setMode(TRANSLATE_MODE);
        }
      },
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        let updatedSelectedFeatureIndexes = this.selectedFeatureIndexes;
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          return;
        }
        if (editType === 'addFeature') {
          if (this.mode === CUT_MODE) {
            updatedData = cutGeometry(updatedData, updatedData.features[featureIndexes[0]]);
            updatedSelectedFeatureIndexes = [];
            this.props.setMode(VIEW_MODE);
            updatedData.features = updatedData.features.map(f => f.id ? f : Object.assign({}, f, { id: uuidv4() }));
            this.props.setGeometry(updatedData)
            this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
            return;
          } else if (this.mode !== 'duplicate') {
            featureIndexes = featureIndexes || editContext.featureIndexes;
            updatedSelectedFeatureIndexes = [...this.props.selectedFeatureIndexes, ...featureIndexes];
          }
        }
        updatedData.features = updatedData.features.map(f => f.id ? f : Object.assign({}, f, { id: uuidv4() }));
        this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
        this.props.setGeometry(updatedData);
      }
    }));

    const handleKeyPress = {
      SHIFT: this.shiftHandle.bind(this),
      CTRL_AND_C: this.ctrlAndCHandle.bind(this),
      CTRL_AND_V: this.ctrlAndVHandle.bind(this),
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
        mode: [DRAW_POLYGON, DRAW_90_DEGREE_POLYGON],
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
            layers={[editableGeoJsonLayer, ...this.layers]}
            controller={true}>
            {this.renderStaticMap(this.state.viewport)}
          </DeckGL>
        </GlobalHotKeys>
        <ControlPlanel toggles={toggles} />
        <SideBar />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor);
import React from 'react';
import { MapView } from '@deck.gl/core'
import DeckGL from '@deck.gl/react';
import MapGL from 'react-map-gl';
import uuidv4 from 'uuid/v4';
import { GlobalHotKeys } from 'react-hotkeys';
import { connect } from 'react-redux'
import { EditableGeoJsonLayer } from 'nebula.gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import cutGeometry from '@/utils/cut-geometry';
import ControlPlanel from '@/components/control-panel/control-panel';
import { setGeometry, setSelectFeatureIndexes, setMode, removeFeature, loadDataset, addFeature, addDrawHistory } from '@/store/actions/geojson-editor';
import SideBar from './side-bar';

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
  SHIFT_DOWN: { sequence: 'shift', action: 'keydown' },
  SHIFT_UP: { sequence: 'shift', action: 'keyup' },
  CTRL_AND_C: ['ctrl+c', 'command+c'],
  CTRL_AND_V: ['ctrl+v', 'command+v'],
  ALT_DOWN: { sequence: 'alt', action: 'keydown' },
  ALT_UP: { sequence: 'alt', action: 'keyup' },
  ENTER: 'enter',
  DEL: ['del', 'backspace']
};

function mapStateToProps(state) {
  return {
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
    addDrawHistory: history => dispatch(addDrawHistory(history)),
  }
}

export class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointsRemovable: true,
      viewport: props.viewport,
      copyFeatures: null,
      prevMode: null,
      tempData: null,
    }
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

  makeHistory(layerId, type, historyIds, prevFeatures, nextFeatures) {
    const deleteActions = historyIds.delete ? historyIds.delete.map(id => (
      {
        id,
        action: 'delete',
        prev: prevFeatures.find(f => f.id === id),
        next: null,
      }
    )) : undefined;
    const modifyActions = historyIds.modify ? historyIds.modify.map(id => ({
      id,
      action: 'modify',
      prev: prevFeatures.find(f => f.id === id),
      next: nextFeatures.find(f => f.id === id),
    })) : undefined;
    const addActions = historyIds.add ? historyIds.add.map(id => ({
      id,
      action: 'add',
      prev: null,
      next: nextFeatures.find(f => f.id === id),
    })) : historyIds.add;
    return {
      layerId,
      type,
      deleteActions,
      modifyActions,
      addActions,
    };
  }

  altDownHandle() {
    if (this.mode === TRANSLATE_MODE) {
      this.setState({ 
        prevMode: this.mode
      });
      this.props.setMode(MODIFY_MODE);
    }
  }

  altUpHandle() {
    if (this.state.prevMode != null) {
      this.props.setMode(this.state.prevMode);
      this.setState({
        prevMode: null
      });
    }
  }

  shiftHandle() {
    if (this.mode === DRAW_POLYGON) {
      this.props.setMode(DRAW_90_DEGREE_POLYGON);
    } else if (this.mode === DRAW_90_DEGREE_POLYGON) {
      this.props.setMode(DRAW_POLYGON);
    }
  }

  shiftDownHandle() {
    if (this.mode === TRANSLATE_MODE) {
      this.setState({
        prevMode: this.mode
      });
      this.props.setMode(ROTATE_MODE);
    }
  }

  shiftUpHandle() {
    if (this.state.prevMode != null) {
      this.props.setMode(this.state.prevMode);
      this.setState({
        prevMode: null
      });
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

  setTempData(type, data) {
    if (this.state.tempData == null) {
      this.setState({ 
        tempData: {
          type,
          data,
        }
      });
    }
  }

  clearTempData() {
    if (this.state.tempData) {
      this.setState({ tempData: null });
    }
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
      mapboxApiAccessToken="pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw"
    />;
  }

  get layers() {
    return this.props.layers
    .filter(layer => !layer.hidden && layer.id !== this.props.currentLayerId)
    .map(layer => new GeoJsonLayer(layer));
  }

  get currentLayer() {
    return this.props.layers.find(layer => layer.id === this.props.currentLayerId);
  }

  onEdit = ({ updatedData, editType, featureIndexes, editContext }) => {
    let updatedSelectedFeatureIndexes = this.selectedFeatureIndexes;
    if (editType === 'removePosition' && !this.state.pointsRemovable) {
      return;
    }
    updatedData.features = updatedData.features.map(f => f.id ? f : Object.assign({}, f, { id: uuidv4() }));
    if (editType === 'addFeature') {
      if (this.mode === CUT_MODE) {
        const sharp = updatedData.features[featureIndexes[0]];
        updatedData.features.splice(featureIndexes[0], 1);
        const { geometry, actionIds } = cutGeometry(updatedData, sharp);
        updatedSelectedFeatureIndexes = [];
        this.props.setMode(VIEW_MODE);
        const actions = this.makeHistory(
          this.props.currentLayerId,
          'maskFeature',
          actionIds,
          this.currentLayer.data.features, geometry.features,
        );
        this.props.addDrawHistory(actions);
        // this.props.setGeometry(geometry)
        this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
        return;
      }
      const actionIds = {
        add: updatedData.features
          .filter((f, idx) => featureIndexes.some(i => i === idx))
          .map(f => f.id),
      };
      const actions = this.makeHistory(
        this.props.currentLayerId,
        editType, actionIds,
        this.currentLayer.data.features,
        updatedData.features
      );
      this.props.addDrawHistory(actions);
      this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
      // this.props.setGeometry(Object.assign({}, updatedData));
    } else if (['translated', 'addPosition', 'finishMovePosition', 'rotated', 'scaled', 'split'].some(t => t === editType)) {
      this.clearTempData();
      const actionIds = {
        'modify': updatedData.features
          .filter((f, idx) => featureIndexes.some(i => i === idx))
          .map(f => f.id),
      };
      const actions = this.makeHistory(
        this.props.currentLayerId,
        editType,
        actionIds,
        this.currentLayer.data.features,
        updatedData.features
      );
      this.props.addDrawHistory(actions);
      this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
      // this.props.setGeometry(Object.assign({}, updatedData));
    } else {
      this.setTempData(editType, this.currentLayer.data);
      this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
      // this.props.setGeometry(Object.assign({}, updatedData));
    }

    // this.props.addDrawHistory(this.makeHistory(editType, this.props.currentLayerId, featureIndexes, updatedData.features));
    // this.props.setSelectFeatureIndexes(updatedSelectedFeatureIndexes);
    // this.props.setGeometry(Object.assign({}, updatedData));
  }

  render() {
    const editableGeoJsonLayer = (this.currentLayer && !this.currentLayer.hidden) ? new EditableGeoJsonLayer(Object.assign({}, this.currentLayer, {
      id: this.currentLayer.id,
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
      onEdit: this.onEdit.bind(this),
    })): null;
    const handleKeyPress = {
      CTRL_AND_C: this.ctrlAndCHandle.bind(this),
      CTRL_AND_V: this.ctrlAndVHandle.bind(this),
      ALT_DOWN: this.altDownHandle.bind(this),
      ALT_UP: this.altUpHandle.bind(this),
      SHIFT_DOWN: this.shiftDownHandle.bind(this),
      SHIFT_UP: this.shiftUpHandle.bind(this),
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

    const layers = editableGeoJsonLayer ? [editableGeoJsonLayer, ...this.layers] : this.layers;
    return (
      <React.Fragment>
        <GlobalHotKeys keyMap={keyMap} handlers={handleKeyPress}>
          <DeckGL
            width="100%"
            height="100%"
            initialViewState={this.state.viewport}
            onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
            getCursor={editableGeoJsonLayer ? editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer) : undefined}
            onClick={this.handleDeckClick.bind(this)}
            pickingRadius={5}
            layers={layers}
            views={[
              new MapView({
                controller: { doubleClickZoom: false }
              })
            ]}>
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
import Immutable from 'immutable';
import uuidv4 from 'uuid/v4';
import {
  SET_GEOMETRY,
  SET_SELECT_FEATURE_INDEXES,
  ADD_FEATURE,
  SET_FEATURE,
  SET_MODE,
  ADD_LAYER,
  SET_LAYER,
  REMOVE_LAYER,
  REMOVE_FEATURE,
} from '../actions/geojson-editor';

const defaultLayer = {
  id: uuidv4(),
  name: 'untitled',
  data: {
    type: 'FeatureCollection',
    features: []
  },
  pickable: true,
  autoHighlight: true,
  color: '#fbe4e6',
  getFillColor: [251, 228, 230, 100],
  lineWidthScale: 6,
  lineWidthMinPixels: 2,
  lineWidthMaxPixels: 3,
};

const initState = {
  geometry: {
    type: 'FeatureCollection',
    features: []
  },
  layers: [defaultLayer],
  currentLayerId: defaultLayer.id,
  selectedFeatureIndexes: [],
  mode: 'view',
};

function geometryApp(state = initState, action) {
  switch (action.type) {
    case SET_GEOMETRY:
      return Immutable.set(state, 'layers', setLayerData(state.layers, state.currentLayerId, action.geometry));
      // return Immutable.set(state, 'geometry', action.geometry);
    case ADD_FEATURE:
      return Immutable.set(
        state,
        'geometry',
        addFeature(state.geometry, action.feature),
      );
    case SET_SELECT_FEATURE_INDEXES:
      return Immutable.set(state, 'selectedFeatureIndexes', action.indexes);
    case SET_FEATURE:
      return Immutable.set(state, 'layers', setFeature(state.layers, state.currentLayerId, action.index, action.feature));
    case REMOVE_FEATURE:
      return Immutable.set(state, 'layers', removeFeature(state.layers, state.currentLayerId, action.index));
    case SET_MODE:
      return Immutable.set(state, 'mode', action.mode);
    case ADD_LAYER:
      return Immutable.set(state, 'layers', addLayer(state.layers, action.layer));
    case SET_LAYER:
      return Immutable.set(state, 'layers', setLayer(state.layers, action.layer));
    case REMOVE_LAYER:
      return Immutable.set(state, 'layers', removeLayer(state.layers, action.id));
    default:
      return state;
  }
}

function addFeature(geometry, feature) {
  return Immutable.set(
    geometry,
    'features',
    Immutable.set(geometry.features, geometry.features.length, feature),
  );
}

function setFeature(layers, id, index, feature) {
  const layerIndex = layers.find(l => l.id === id);
  return Immutable.set(
    layers,
    layerIndex,
    Immutable.set(layers[layerIndex], 'data', Immutable.set(layers[layerIndex].data, 'features', Immutable.set(layers[layerIndex].data.features, index, feature))),
  );
}

function removeFeature(layers, id, index) {
  const layerIndex = layers.findIndex(l => l.id === id);
  return Immutable.set(
    layers,
    layerIndex,
    Immutable.set(layers[layerIndex], 'data', Immutable.set(layers[layerIndex].data, 'features', Immutable.remove(layers[layerIndex].data.features, index))),
  )
}

function addLayer(layers, layer) {
  if (layers.findIndex(l => l.id === layer.id) === -1) {
    return Immutable.set(layers, layers.length, layer);
  }
}

function setLayer(layers, layer) {
  const index = layers.findIndex(l => l.id === layer.id);
  if (index > -1) {
    return Immutable.set(layers, index, layer);
  }
}

function setLayerData(layers, id, data) {
  const index = layers.findIndex(l => l.id === id);
  return setLayer(layers, Immutable.set(layers[index], 'data', data))
}

function removeLayer(layers, id) {
  const index = layers.findIndex(l => l.id === id);
  if (index > -1) {
    return Immutable.remove(layers, index);
  }
}

export default geometryApp;
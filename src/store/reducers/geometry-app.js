import Immutable from 'immutable';
import uuidv4 from 'uuid/v4';
import {
  SET_CURRENT_LAYER,
  SET_GEOMETRY,
  SET_SELECT_FEATURE_INDEXES,
  ADD_FEATURE,
  SET_FEATURE,
  SET_MODE,
  ADD_LAYER,
  SET_LAYER,
  SET_LAYER_NAME,
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
  color: '#F5A623',
  getFillColor: [245, 166, 35, 100],
  lineWidthScale: 2,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: 2,
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
    case SET_CURRENT_LAYER:
      return setCurrentLayer(state, action.id);
    case SET_GEOMETRY:
      return Immutable.set(state, 'layers', setLayerData(state.layers, state.currentLayerId, action.geometry));
    case ADD_FEATURE:
      return Immutable.set(state, 'layers', addFeature(state.layers, state.currentLayerId, action.feature));
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
    case SET_LAYER_NAME:
      return Immutable.set(state, 'layers', setLayerName(state.layers, action.id, action.name));
    case REMOVE_LAYER:
      return Immutable.set(state, 'layers', removeLayer(state.layers, action.id));
    default:
      return state;
  }
}

function setCurrentLayer(state, id) {
  const newLayerIndex = state.layers.findIndex(l => l.id === id);
  const oldLayerIndex = state.layers.findIndex(l => l.id === state.currentLayerId);
  const newLayer = geojson2Edit(state.layers[newLayerIndex]);
  const oldLayer = edit2Geojson(state.layers[oldLayerIndex]);
  const layers = Immutable.fromJS(state.layers).set(newLayerIndex, newLayer).set(oldLayerIndex, oldLayer);
  return Immutable.fromJS(state)
    .set('layers', layers)
    .set('currentLayerId', newLayer.id)
    .toJS();
}

function edit2Geojson(layer) {
  return {
    id: uuidv4(),
    sourceId: layer.sourceId,
    name: layer.name,
    data: layer.data,
    pickable: true,
    autoHighlight: false,
    stroked: false,
    filled: true,
    extruded: false,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 3,
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
    hidden: false,
    color: layer.color || '#000',
    getFillColor: layer.getFillColor || [],
  };
}

function geojson2Edit(layer) {
  return {
    id: uuidv4(),
    sourceId: layer.sourceId,
    name: layer.name,
    data: layer.data,
    pickable: true,
    autoHighlight: true,
    color: layer.color || '#000',
    getFillColor: layer.getFillColor || [],
    lineWidthScale: 2,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 2,
  };
}

function addFeature(layers, id, feature) {
  const layer = layers.find(l => l.id === id);
  const features = Immutable.List(layer.data.features).toJS();
  if (Array.isArray(feature)) {
    features.push(...feature);
  } else {
    features.push(feature);
  }
  const data = Immutable.set(layer.data, 'features', features);
  return setLayer(layers, Immutable.set(layer, 'data', data));
}

function setFeature(layers, id, index, feature) {
  const layerIndex = layers.findIndex(l => l.id === id);
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
  return layers;
}

function setLayer(layers, layer) {
  const index = layers.findIndex(l => l.id === layer.id);
  if (index > -1) {
    return Immutable.set(layers, index, layer);
  }
}

function setLayerName(layers, id, name) {
  const index = layers.findIndex(l => l.id === id);
  return Immutable.set(layers, index, Immutable.set(layers[index], 'name', name));
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
import Immutable from 'immutable';
import {
  SET_GEOMETRY,
  SET_CURRENT_LAYER,
  SET_SELECT_FEATURE_INDEXES,
  SET_MODE,
  ADD_LAYER,
  SET_LAYER,
  SET_LAYER_NAME,
  REMOVE_LAYER,
  ADD_DRAW_HISTORY,
} from '../actions/geojson-editor';

import { makeDeckGeoJsonLayer, edit2Geojson, geojson2Edit } from '@/utils/layer';

const defaultLayer = makeDeckGeoJsonLayer();

const initState = {
  layers: [defaultLayer],
  currentLayerId: defaultLayer.id,
  selectedFeatureIndexes: [],
  mode: 'view',
  history: [],
  historyNum: 0,
};


function geometryApp(state = initState, action) {
  switch (action.type) {
    case SET_GEOMETRY:
      return Immutable.set(state, 'layers', setLayerData(state.layers, state.currentLayerId, action.geometry));
    case SET_CURRENT_LAYER:
      return setCurrentLayer(state, action.id);
    case SET_SELECT_FEATURE_INDEXES:
      return Immutable.set(state, 'selectedFeatureIndexes', action.indexes);
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
    case ADD_DRAW_HISTORY:
      return addDrawHistory(state, action.actions);
    default:
      return state;
  }
}

function setCurrentLayer(state, id) {
  if (state.currentLayerId === id) {
    return state;
  }
  const newLayerIndex = state.layers.findIndex(l => l.uid === id);
  const oldLayerIndex = state.layers.findIndex(l => l.uid === state.currentLayerId);
  const newLayer = geojson2Edit(state.layers[newLayerIndex]);
  const oldLayer = edit2Geojson(state.layers[oldLayerIndex]);
  const layers = Immutable.fromJS(state.layers).set(newLayerIndex, newLayer).set(oldLayerIndex, oldLayer);
  return Immutable.fromJS(state)
    .set('layers', layers)
    .set('currentLayerId', newLayer.id)
    .toJS();
}

function addLayer(layers, layer) {
  if (layers.findIndex(l => l.uid === layer.id) === -1) {
    return Immutable.set(layers, layers.length, layer);
  }
  return layers;
}

function setLayer(layers, layer) {
  const index = layers.findIndex(l => l.uid === layer.id);
  if (index > -1) {
    return Immutable.set(layers, index, layer);
  }
}

function setLayerData(layers, id, data) {
  const index = layers.findIndex(l => l.id === id);
  return setLayer(layers, Immutable.set(layers[index], 'data', data))
}

function setLayerName(layers, id, name) {
  const index = layers.findIndex(l => l.uid === id);
  return Immutable.set(layers, index, Immutable.set(layers[index], 'name', name));
}

function removeLayer(layers, id) {
  const index = layers.findIndex(l => l.uid === id);
  if (index > -1) {
    return Immutable.remove(layers, index);
  }
}

function addDrawHistory(state, actions) {
  const layerIndex = state.layers.findIndex(l => l.uid === actions.layerId);
  if (state.historyNum < state.history.length) {
    state = Immutable.set(state, 'history', spliceHistory(state.history, state.historyNum))
  }
  state.historyNum += 1;
  state = Immutable.set(state, 'layers', Immutable.set(state.layers, layerIndex, doAction(state.layers[layerIndex], actions)));
  return Immutable.set(state, 'history', Immutable.set(state.history, state.history.length, actions))
}

function undo(state) {
  if (state.historyNum <= 0) {
    return state;
  }
  state.historyNum -= 1;
  const prevActions = state.history[state.historyNum];
  const layerIndex = state.layers.findIndex(l => l.uid === prevActions.layerId);
  return Immutable.set(state, 'layers', Immutable.set(state.layers, layerIndex, undoHistory(state.layers[layerIndex], prevActions)));
}

function redo(state) {
  if (state.historyNum >= state.history.length) {
    return state;
  }
  const nextActions = state.history[state.historyNum];
  state.historyNum += 1;
  const layerIndex = state.layers.findIndex(l => l.uid === nextActions.layerId);
  return Immutable.set(state, 'layers', Immutable.set(state.layers, layerIndex, redoHistory(state.layers[layerIndex], nextActions)));

}

function spliceHistory(history, start) {
  return Immutable.List(history).splice(start).toJS();
}

function doAction(layer, actions) {
  let features = Immutable.List(layer.data.features).toJS();
  if (actions.addActions) {
    const newFeatures = actions.addActions.map(a => a.next);
    features.push(...newFeatures);
  }
  if (actions.modifyActions) {
    actions.modifyActions.forEach(a => {
      const index = features.findIndex(f => f.id === a.id);
      if (index > -1) {
        layer.data.features[index] = a.next;
      }
    });
  }
  if (actions.deleteActions) {
    features = layer.data.features.filter(f => actions.deleteActions.some(a => a.id !== f.id));
  }
  return Immutable.set(layer, 'data', Immutable.set(layer.data, 'features', features));
}

function undoHistory(layer, actions) {
  let features = Immutable.List(layer.data.features).toJS();
  if (actions.addActions) {
    features = layer.data.features.filter(f => actions.addActions.some(a => a.id !== f.id));
  }
  if (actions.modifyActions) {
    actions.modifyActions.forEach(a => {
      const index = features.findIndex(f => f.id === a.id);
      if (index > -1) {
        layer.data.features[index] = a.prev;
      }
    });
  }
  if (actions.deleteActions) {
    const newFeatures = actions.addActions.map(a => a.prev);
    features.push(...newFeatures);
  }
  return Immutable.set(layer, 'data', Immutable.set(layer.data, 'features', features));
}

function redoHistory(layer, actions) {
  return doAction(layer, actions);
}

export default geometryApp;
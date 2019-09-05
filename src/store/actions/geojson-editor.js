/*
 * action 类型
 */

export const SET_GEOMETRY = 'SET_GEOMETRY';
export const SET_CURRENT_LAYER = 'SET_CURRENT_LAYER';
export const SET_SELECT_FEATURE_INDEXES = 'SET_SELECT_FEATURE_INDEXES';
export const SET_MODE = 'SET_MODE';
export const ADD_LAYER = 'ADD_LAYER';
export const REMOVE_LAYER = 'REMOVE_LAYER';
export const SET_LAYER = 'SET_LAYER';
export const SET_LAYER_NAME = 'SET_LAYER_NAME';
export const ADD_DRAW_HISTORY = 'ADD_DRAW_HISTORY';
export const UNDO = 'UNDO';
export const REDO = 'REDO';

// mapbox api 相关
export const LOAD_DATASET = 'LOAD_DATASET';
export const LOAD_DATASET_DATA = 'LOAD_DATASET';
export const LOAD_DATASET_LIST = 'LOAD_DATASET_LIST';

/*
 * action 创建函数
 */
export function setCurrentLayer(uid) {
  return { type: SET_CURRENT_LAYER, uid};
}

export function setGeometry(geometry) {
  return { type: SET_GEOMETRY, geometry };
}

export function setSelectFeatureIndexes(indexes) {
  return { type: SET_SELECT_FEATURE_INDEXES, indexes };
}

export function setMode(mode) {
  return { type: SET_MODE, mode };
}

export function addLayer(layer) {
  return { type: ADD_LAYER, layer };
}

export function removeLayer(id) {
  return { type: REMOVE_LAYER, id };
}

export function setLayer(layer) {
  return { type: SET_LAYER, layer };
}

export function setLayerName(id, name) {
  return { type: SET_LAYER_NAME, id, name}
}

export function loadDataset(datasetId, name) {
  return { type: LOAD_DATASET_DATA, datasetId, name }
}

export function addDrawHistory(actions) {
  return { type: ADD_DRAW_HISTORY, actions };
}

export function undo() {
  return { type: UNDO };
}

export function redo() {
  return { type: REDO };
}
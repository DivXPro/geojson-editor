/*
 * action 类型
 */

export const SET_GEOMETRY = 'SET_GEOMETRY';
export const ADD_FEATURE = 'ADD_FEATURE';
export const SET_FEATURE = 'SET_FEATURE';
export const REMOVE_FEATURE = 'REMOVE_FEATURE';
export const SET_SELECT_FEATURE_INDEXES = 'SET_SELECT_FEATURE_INDEXES';
export const SET_MODE = 'SET_MODE';
export const ADD_LAYER = 'ADD_LAYER';
export const REMOVE_LAYER = 'REMOVE_LAYER';
export const SET_LAYER = 'SET_LAYER';
export const SET_LAYER_NAME = 'SET_LAYER_NAME';
export const LOAD_DATASET = 'LOAD_DATASET';
export const LOAD_DATASET_DATA = 'LOAD_DATASET';
export const LOAD_DATASET_LIST = 'LOAD_DATASET_LIST';
// mapbox api 相关

/*
 * action 创建函数
 */
export function setGeometry(geometry) {
  return { type: SET_GEOMETRY, geometry };
}

export function addFeature(feature) {
  return { type: ADD_FEATURE, feature };
}

export function setFeature(index, feature) {
  return { type: SET_FEATURE, index, feature };
}

export function removeFeature(index) {
  return { type: REMOVE_FEATURE, index };
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
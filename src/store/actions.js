/*
 * action 类型
 */

export const SET_GEOMETRY = 'SET_GEOMETRY';
export const ADD_FEATURE = 'ADD_FEATURE';
export const SET_FEATURE = 'SET_FEATURE';
export const REMOVE_FEATURE = 'REMOVE_FEATURE';
export const SET_SELECT_FEATURE_INDEXES = 'SET_SELECT_FEATURE_INDEXES';
export const SET_BASE_GEOM = 'SET_BASE_GEOM';
export const SET_MODE = 'SET_MODE';

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
  return { type: SET_SELECT_FEATURE_INDEXES, indexes }
}

export function setBaseGeom(data) {
  return { type: SET_BASE_GEOM, data }
}

export function setMode(mode) {
  return { type: SET_MODE, mode }
}

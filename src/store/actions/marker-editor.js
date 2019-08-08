/*
 * action 类型
 */

export const ADD_MARKER = 'ADD_MARKER';
export const SET_MARKER = 'SET_MARKER';
export const REMOVE_MARKER = 'REMOVE_MARKER';
export const SET_CURRENT_MARKER = 'SET_CURRENT_MARKER';
export const SET_CURRENT_COORDINATE = 'SET_CURRENT_COORDINATE';
export const SET_MODE = 'SET_MODE';
export const SET_CURRENT_MARKER_ID = 'SET_CURRENT_MARKER_ID';
/*
 * action 创建函数
 */
export function addMarker(marker) {
  return { type: ADD_MARKER, marker };
}

export function removeMarker(id) {
  return { type: REMOVE_MARKER, id };
}

export function setCurrentMarker(marker) {
  return { type: SET_CURRENT_MARKER, marker };
}

export function setCurrentCoordinate(coordinate) {
  return { type: SET_CURRENT_COORDINATE, coordinate };
}

export function setMarker(marker) {
  return { type: SET_MARKER, marker };
}

export function setMode(mode) {
  return { type: SET_MODE, mode }
}

export function setCurrentMarkerId(id) {
  return { type: SET_CURRENT_MARKER_ID, id }
}
/*
 * action 类型
 */

export const ADD_MARKER = 'ADD_MARKER';
export const REMOVE_MARKER = 'REMOVE_MARKER';

/*
 * action 创建函数
 */
export function addMarker(marker) {
  return { type: ADD_MARKER, marker };
}

export function removeMarker(id) {
  return { type: REMOVE_MARKER, id };
}

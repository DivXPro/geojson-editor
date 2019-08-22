import difference from '@turf/difference';
import booleanContains from '@turf/boolean-contains';

function cutGeometry(geometry, sharp) {
  const actionIds = {
    modify: [],
    add: [],
    delete: [],
  }
  const features = geometry.features.filter(feature => {
    if (feature.geometry.type === 'MultiPolygon') {
      return true;
    }
    if (!booleanContains(sharp, feature)) {
      return true;
    }
    actionIds.delete.push(feature.id);
    return false;
  });
  return {
    geometry: {
      type: 'FeatureCollection',
      features: features.map(
        feature => {
          if (['Polygon', 'MultiPolygon'].findIndex(type => type === feature.geometry.type) > -1) {
            actionIds.modify.push(feature.id);
            return Object.assign(difference(feature, sharp), { id: feature.id });
          }
          return feature;
        }
      )
    },
    actionIds,
  }
}

export default cutGeometry;


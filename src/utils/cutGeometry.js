import difference from '@turf/difference';
import booleanContains from '@turf/boolean-contains';

function cutGeometry(geometry, sharp) {
  const features = geometry.features.filter(feature => {
    if (feature.geometry.type === 'MultiPolygon') {
      return true;
    }
    return !booleanContains(sharp, feature);
  });
  return {
    type: 'FeatureCollection',
    features: features.map(
      feature => ['Polygon', 'MultiPolygon'].findIndex(type => type === feature.geometry.type) > -1 ? difference(feature, sharp) : feature
    )
  };
}

export default cutGeometry;
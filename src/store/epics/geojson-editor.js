import { map, mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { ofType } from 'redux-observable';
import { getFeatureList } from '@/mapbox/feature';
import { next } from '@/mapbox/next';
import { LOAD_DATASET_DATA, addLayer } from '../actions/geojson-editor';
import { makeGeoJsonLayer } from '@/utils/layer';

export const loadDataset = (action$, state$) => action$.pipe(
  ofType(LOAD_DATASET_DATA),
  mergeMap(action => {
    return fromPromise(getFeatures(action.datasetId)).pipe(
      map(data => addLayer(makeGeoJsonLayer({
        sourceId: action.datasetId,
        name: action.name,
        data,
      }))),
      catchError(err => console.log('err', err))
    )
  })
)

function nextUrl(link) {
  const reg = /^<https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*>; rel="next"$/i;
  const linkReg = /https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*/i
  return reg.test(link) ? link.match(linkReg)[0] : null;
}

async function getFeatures(datasetId, url) {
  const { data, headers } = url ? await next(url) : await getFeatureList(datasetId);
  const nextUri = nextUrl(headers.link);
  if (nextUri) {
    const nextData = await getFeatures(datasetId, nextUrl(headers.link));
    data.features.push(...nextData.features);
  }
  return data;
}

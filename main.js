import 'ol/ol.css';
import {Map, View} from 'ol';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import {Icon, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { fromLonLat } from 'ol/src/proj';
import { defaultStrokeStyle } from 'ol/render/canvas';

const existingTreeStyle = new Style({
  image: new Icon({
    src: "./pine-gray.svg",
    offset: [0, 0],
    opacity: 1,
    scale: 0.011,
  })
});

const newTreeStyle = new Style({
  image: new Icon({
    src: "./pine-green.svg",
    offset: [0, 0],
    opacity: 1,
    scale: 0.011,
  })
});

const serverSource = new VectorSource({
  projection: 'EPSG:4326',
  wrapX: false,
  format: new GeoJSON(),
  url: 'http://localhost:5242/features'
});
const pointSource = new VectorSource({
  projection: 'EPSG:4326',
  wrapX: false,
  format: new GeoJSON(),
});
const pointLayer = new VectorLayer({
  projection: 'EPSG:4326',
  source: pointSource,
  style: newTreeStyle,
});
const serverLayer = new VectorLayer({
  projection: 'EPSG:4326',
  source: serverSource,
  style: existingTreeStyle,
});

var center = fromLonLat([5.194, 62.0144]);
var bottomLeft = fromLonLat([5.178, 62.007]);
var topRight = fromLonLat([5.22, 62.025]);
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    serverLayer,
    pointLayer,
  ],
  view: new View({
    center: center,
    zoom: 15,
    minZoom: 14,
    extent: [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]],
    constrainOnlyCenter: true,
  }),
});

let draw = new Draw({
  source: pointSource,
  type: "Point",
});

map.addInteraction(draw);
//map.addInteraction(select);

document.getElementById('upload').addEventListener('click', function () {
  var json = new GeoJSON().writeFeatures(pointSource.getFeatures(), { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
  console.log(json);
  fetch('http://localhost:5242/features', 
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json,
  });
});
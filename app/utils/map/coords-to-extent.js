export default function mapCoordsToExtent (coords) {
  if (coords && coords.length === 2) {
    return {
      xmin: coords[0][0],
      ymin: coords[0][1],
      xmax: coords[1][0],
      ymax: coords[1][1],
      spatialReference:{
        wkid:4326
      }
    };
  }
}

import Polygon from './Polygon';
import { Shape, ShapeGeometry, Vector2 } from 'three'

/**
 * @param {number} numberOfVertices
 */
export function ConvexFinitePlanarPolygon(numberOfVertices) {
  const externalAngle = 2 * Math.PI / numberOfVertices;
  const sideLengthForUnitRadius = 2 * Math.sin(externalAngle / 2);
  const radius = 1 / sideLengthForUnitRadius;

  const points = Array(numberOfVertices);
  for (let i = 0; i < numberOfVertices; i++) {
    const theta = i * externalAngle;
    points[i] = new Vector2(radius * Math.cos(theta), radius * Math.sin(theta));
  }
  const shape = new Shape(points);
  const geometry = new ShapeGeometry(shape);

  return class ConvexFinitePlanarPolygonBase extends Polygon {
    static geometry = geometry;
  };
}

export class Triangle extends ConvexFinitePlanarPolygon(3) {}
export class Quadrilateral extends ConvexFinitePlanarPolygon(4) {}
export class Pentagon extends ConvexFinitePlanarPolygon(5) {}
export class Hexagon extends ConvexFinitePlanarPolygon(6) {}

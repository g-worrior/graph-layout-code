// main.js
import { readFileSync, writeFileSync } from "fs";

// Load graph data
const rawData = readFileSync("data.json");
const graph = JSON.parse(rawData);
const nodes = graph.nodes;
const edges = graph.edges;

// Constants
const ITERATIONS = 1000;
const WIDTH = 1;
const HEIGHT = 1;
const AREA = WIDTH * HEIGHT;
const k = Math.sqrt(AREA / nodes.length);
const gravity = 0.01;
const coolingFactor = 0.05;
const MIN_EDGE_DIST = 0.08;

// Utility: distance between two nodes
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Utility: check if a node is near the edge
function isNearEdge(n) {
  return n.x < 0.15 || n.x > 0.85 || n.y < 0.15 || n.y > 0.85;
}

// Utility: edge repulsion from borders
function edgeRepulsion(n) {
  const PUSH = 0.02;
  if (n.x < 0.15) n.x += PUSH;
  if (n.x > 0.85) n.x -= PUSH;
  if (n.y < 0.15) n.y += PUSH;
  if (n.y > 0.85) n.y -= PUSH;
}

// Track relocated nodes to avoid repeated moves
const relocated = new Set();

// Main simulation
function runSimulation() {
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Reset displacements
    nodes.forEach(n => {
      n.dx = 0;
      n.dy = 0;
    });

    // Repulsive force between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = distance(a, b) + 0.01;
        const repulse = (k * k) / dist;

        const dx = ((a.x - b.x) / dist) * repulse;
        const dy = ((a.y - b.y) / dist) * repulse;

        a.dx += dx;
        a.dy += dy;
        b.dx -= dx;
        b.dy -= dy;
      }
    }

    // Attractive force along edges + forced relocation
    edges.forEach(edge => {
      const sourceId = Array.isArray(edge) ? edge[0] : edge.source;
      const targetId = Array.isArray(edge) ? edge[1] : edge.target;

      const source = nodes.find(n => n.id === sourceId);
      const target = nodes.find(n => n.id === targetId);
      if (!source || !target) return;

      const dist = distance(source, target) + 0.01;

      // If too close and both near edge, relocate one to center
      if (
        dist < MIN_EDGE_DIST &&
        isNearEdge(source) &&
        isNearEdge(target) &&
        !relocated.has(source.id)
      ) {
        source.x = 0.5 + (Math.random() - 0.5) * 0.1;
        source.y = 0.5 + (Math.random() - 0.5) * 0.1;
        relocated.add(source.id);
        return;
      }

      const attract = (dist * dist) / (6 * k);
      const dx = ((target.x - source.x) / dist) * attract;
      const dy = ((target.y - source.y) / dist) * attract;

      source.dx += dx;
      source.dy += dy;
      target.dx -= dx;
      target.dy -= dy;
    });

    // Apply displacements, edge repulsion, and clamp
    nodes.forEach(n => {
      n.dx -= gravity * (n.x - WIDTH / 2);
      n.dy -= gravity * (n.y - HEIGHT / 2);

      n.x += n.dx * coolingFactor;
      n.y += n.dy * coolingFactor;

      edgeRepulsion(n);

      n.x = Math.max(0.1, Math.min(0.9, n.x));
      n.y = Math.max(0.1, Math.min(0.9, n.y));
    });
  }
}

// Run layout
runSimulation();

// Final jitter to avoid stacking
const offset = 0.01;
const seen = new Set();
const MIN = 0.5;
const MAX = 0.85;

nodes.forEach(n => {
  n.x = Math.max(0.1, Math.min(0.9, n.x));
  n.y = Math.max(0.1, Math.min(0.9, n.y));

  let key = `${n.x.toFixed(3)}-${n.y.toFixed(3)}`;
  if (seen.has(key)) {
    n.x += (Math.random() - 0.5) * offset;
    n.y += (Math.random() - 0.5) * offset;

    n.x = Math.max(MIN, Math.min(MAX, n.x));
    n.y = Math.max(MIN, Math.min(MAX, n.y));

    key = `${n.x.toFixed(3)}-${n.y.toFixed(3)}`;
  }
  seen.add(key);
});

// Output
console.log("Optimized Node Positions:");
nodes.forEach(n => {
  console.log(`${n.id}: (${n.x.toFixed(3)}, ${n.y.toFixed(3)})`);
});

writeFileSync("layout.json", JSON.stringify({ nodes, edges }, null, 2));
console.log("layout.json saved. Open index.html to view.");

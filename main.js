// main.js
// Force-Directed Graph Layout Optimizer for Malawi Districts
// Accepts edges as arrays: [ "source", "target" ]
// Generates new positions and saves them to layout.json

import { readFileSync, writeFileSync } from "fs";

// Load graph data from data.json
const rawData = readFileSync("data.json");
const graph = JSON.parse(rawData);
const nodes = graph.nodes;
const edges = graph.edges;


// Force simulation settings
const ITERATIONS = 1000;
const WIDTH = 1;
const HEIGHT = 1;
const AREA = WIDTH * HEIGHT;
const k = Math.sqrt(AREA / nodes.length); // Optimal spacing between nodes
const gravity = 0.01;
const coolingFactor = 0.05;

// Utility: calculate distance between two nodes
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Main simulation loop
function runSimulation() {
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Reset displacement vectors
    nodes.forEach(n => {
      n.dx = 0;
      n.dy = 0;
    });

    // 1. Repulsive force between all node pairs
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

    // 2. Attractive force along edges
    edges.forEach(edge => {
      // Support both array and object format
      const sourceId = Array.isArray(edge) ? edge[0] : edge.source;
      const targetId = Array.isArray(edge) ? edge[1] : edge.target;

      const source = nodes.find(n => n.id === sourceId);
      const target = nodes.find(n => n.id === targetId);

      if (!source || !target) {
        console.warn(`Skipping invalid edge: ${sourceId} → ${targetId}`);
        return;
      }

      const dist = distance(source, target) + 0.01;
      const attract = (dist * dist) / (6 * k);

      const dx = ((target.x - source.x) / dist) * attract;
      const dy = ((target.y - source.y) / dist) * attract;

      source.dx += dx;
      source.dy += dy;
      target.dx -= dx;
      target.dy -= dy;
    });

    // 3. Apply displacements and clamp within [0, 1]
    nodes.forEach(n => {
      // Apply gravity toward center
      n.dx -= gravity * (n.x - WIDTH / 2);
      n.dy -= gravity * (n.y - HEIGHT / 2);

      // Update position with cooling
      n.x += (n.dx * coolingFactor);
      n.y += (n.dy * coolingFactor);

      // Clamp to [0, 1] bounds
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
  // Clamp before key creation to avoid flying off-grid
  n.x = Math.max(0.1, Math.min(0.9, n.x));
  n.y = Math.max(0.1, Math.min(0.9, n.y));

  let key = `${n.x.toFixed(3)}-${n.y.toFixed(3)}`;

  // If this position was already taken, apply jitter once
  if (seen.has(key)) {
    n.x += (Math.random() - 0.5) * offset;
    n.y += (Math.random() - 0.5) * offset;

    // Re-clamp after jitter
    n.x = Math.max(MIN, Math.min(MAX, n.x));
    n.y = Math.max(MIN, Math.min(MAX, n.y));

    // Regenerate key after adjustment
    key = `${n.x.toFixed(3)}-${n.y.toFixed(3)}`;
  }

  function edgeRepulsion(n) {
    const PUSH = 0.02;

    if(n.x < MIN + 0.01) n.x += PUSH;
    if(n.x < MAX + 0.01) n.x += PUSH;
    if(n.y < MIN + 0.01) n.y += PUSH;
    if(n.y < MAX + 0.01) n.y += PUSH;
  }

  seen.add(key);
});

// Output updated positions to console
console.log("Optimized Node Positions:");
nodes.forEach(n => {
  console.log(`${n.id}: (${n.x.toFixed(3)}, ${n.y.toFixed(3)})`);
});

// Save new layout to layout.json (for index.html visualization)
writeFileSync("layout.json", JSON.stringify({ nodes, edges }, null, 2));
console.log("layout.json saved. Open index.html to view.");
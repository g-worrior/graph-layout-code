import { readFileSync, writeFileSync } from "fs";

// === Load Graph Data from JSON File ===
const rawData = readFileSync("data.json");
const graph = JSON.parse(rawData);
const nodes = graph.nodes;
const edges = graph.edges;

// === Build Adjacency Map ===
// We map each node to its immediate neighbors.
const adjacency = {};
edges.forEach(([a, b]) => {
  if (!adjacency[a]) adjacency[a] = [];
  if (!adjacency[b]) adjacency[b] = [];
  adjacency[a].push(b);
  adjacency[b].push(a); // Since this is an undirected graph
});

// === Identify the Central Hub Node ===
// We select the node with the highest number of connections to be placed at the center.
const nodeDegrees = nodes.map(n => ({
  id: n.id,
  degree: adjacency[n.id]?.length || 0
}));
nodeDegrees.sort((a, b) => b.degree - a.degree); // Descending by degree
const hubId = nodeDegrees[0].id;
const hubNode = nodes.find(n => n.id === hubId);

// === Place the Hub Node at the Center of the Layout ===
hubNode.x = 0.5;
hubNode.y = 0.5;

// === Place First-Tier Nodes Around the Hub ===
// These are nodes directly connected to the hub.
// We place them evenly spaced in a circular ring around the center.
const firstTier = adjacency[hubId];
const firstTierAngleStep = (2 * Math.PI) / firstTier.length;
const firstTierRadius = 0.2; // Distance from hub

const assigned = new Set([hubId]); // Track which nodes have been positioned

firstTier.forEach((id, i) => {
  const angle = i * firstTierAngleStep;
  const x = 0.5 + firstTierRadius * Math.cos(angle);
  const y = 0.5 + firstTierRadius * Math.sin(angle);
  const node = nodes.find(n => n.id === id);
  node.x = x;
  node.y = y;
  assigned.add(id);
});

// === Place Second-Tier Nodes Around Their First-Tier Parent ===
// These are nodes connected to first-tier nodes (but not already placed).
// We position them in smaller arcs around their direct parent.
firstTier.forEach(centerId => {
  const centerNode = nodes.find(n => n.id === centerId);
  const neighbors = adjacency[centerId] || [];
  const secondTier = neighbors.filter(nid => !assigned.has(nid));
  const angleStep = (2 * Math.PI) / (secondTier.length || 1);
  const radius = 0.12;

  secondTier.forEach((nid, i) => {
    const angle = i * angleStep;
    const x = centerNode.x + radius * Math.cos(angle);
    const y = centerNode.y + radius * Math.sin(angle);
    const node = nodes.find(n => n.id === nid);
    node.x = x;
    node.y = y;
    assigned.add(nid);
  });
});

// === Place Leaf Nodes (Degree = 1) Near Their Parent ===
// These are nodes that only connect to one other node.
// We position them close to their parent in random directions to avoid overlap.
nodes.forEach(node => {
  if (assigned.has(node.id)) return; // Skip if already positioned
  const neighbors = adjacency[node.id];
  if (neighbors && neighbors.length === 1) {
    const parent = nodes.find(n => n.id === neighbors[0]);
    const angle = Math.random() * 2 * Math.PI;
    const radius = 0.05; // Keep close to parent
    const x = parent.x + radius * Math.cos(angle);
    const y = parent.y + radius * Math.sin(angle);
    node.x = x;
    node.y = y;
    assigned.add(node.id);
  }
});

// === Place Any Remaining Unconnected or Isolated Nodes ===
// These are nodes that haven't been positioned yet, possibly due to being disconnected.
// We place them in a wider circular ring around the center.
const unassigned = nodes.filter(n => !assigned.has(n.id));
const outerRadius = 0.4;
const centerX = 0.5;
const centerY = 0.5;
const outerAngleStep = (2 * Math.PI) / (unassigned.length || 1);

unassigned.forEach((node, i) => {
  const angle = i * outerAngleStep;
  const x = centerX + outerRadius * Math.cos(angle);
  const y = centerY + outerRadius * Math.sin(angle);
  node.x = x;
  node.y = y;
});

// === Save the Resulting Layout to a JSON File ===
writeFileSync("layout.json", JSON.stringify({ nodes, edges }, null, 2));
console.log("layout.json generated with tier-aware and leaf-aware layout.");

// === Print Each Node's Final Position to the Console ===
nodes.forEach(node => {
  console.log(`${node.id}: x=${node.x.toFixed(3)}, y=${node.y.toFixed(3)}`);
});
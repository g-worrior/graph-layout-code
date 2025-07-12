# Malawi District Graph Layout Optimizer

This project implements a force-directed layout to reposition nodes (Malawi districts) in a 1x1 space using a simplified Fruchterman-Reingold algorithm.

## Features

- Reads node + edge data from data.json
- Applies attractive and repulsive forces
- Keeps positions within [0, 1] unit square
- Outputs optimized node positions to console

## Run It

```bash
node main.js
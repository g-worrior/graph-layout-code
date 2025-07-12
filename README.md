---

# Malawi District Graph Layout

This project implements a *tier-aware and leaf-aware graph layout* in JavaScript, arranging Malawi’s district nodes in a 1x1 coordinate space. The output includes both structured layout data and a canvas-based visualization.

---

## 📌 Features

- Calculates graph layout using a central hub and tier logic
- Avoids overlap and ensures visual balance
- Outputs normalized (x, y) positions for each node
- Includes an interactive HTML canvas visualization
- Displays a warning if layout.json is missing or cannot be loaded

---

## 🗂 Project Structure

├── data.json         # Input graph: nodes and edges 
├── layout.js         # JavaScript layout generation script 
├── layout.json       # Output: new coordinates for each node 
├── index.html        # Canvas visualization of the graph 
├── README.md         # Instructions and project overview

---

## 🔧 Requirements

- [Node.js](https://nodejs.org/) (v14+)
- [XAMPP](https://www.apachefriends.org/index.html) or any local web server (to view HTML due to browser CORS restrictions)
- A modern browser (e.g., Chrome, Firefox, Edge)

---

## ⚙️ How to Run

```bash
1. Clone the repository
git clone https://github.com/g-worrior/graph-layout-code.git
cd graph-layout-code

2. Generate the graph layout

node layout.js

This reads data.json, computes new positions, and writes them to layout.json.

You’ll also see each node’s final position printed to the console.


---

3. View the visualization (IMPORTANT: Use a local server)

Modern browsers block local file loading (CORS), so you must use a local server to open index.html.
I recommend XAMPP (or VS Code’s Live Server).

✅ Using XAMPP

1. Install and run XAMPP.


2. Copy the project folder to:
C:\xampp\htdocs\graph-layout-code


3. Start Apache from the XAMPP Control Panel.


4. Open your browser and navigate to:
http://localhost/graph-layout-code/index.html



⛔ If layout.json is missing

A warning will appear in the browser console and/or canvas, notifying you that layout.json could not be loaded. Ensure you’ve run the layout.js script first.


---

📸 Screenshots

Console output with node positions

Visual rendering in index.html

---

💬 Contact

For questions, feel free to reach out via GitHub: g-worrior, Email; pelikoswe@gmail.com

---

✅ License

This project is provided for evaluation and demonstration purposes.

---
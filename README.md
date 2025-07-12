#Malawi District Graph Layout

This project implements a **tier-aware and leaf-aware graph layout** in JavaScript, arranging Malawi’s district nodes within a normalized 1×1 coordinate space. It outputs both structured layout data and an interactive canvas-based visualization.

---

## 📌 Features

- Calculates graph layout using a central hub and tier-based logic  
- Prevents node overlap and maintains visual balance  
- Outputs normalized `(x, y)` coordinates for each node  
- Includes an interactive HTML canvas visualization  
- Displays a warning if `layout.json` is missing or fails to load  

---

## 🗂 Project Structure
```
├── data.json # Input graph: nodes and edges 
├── layout.js # JavaScript layout generation script 
├── layout.json # Output: computed coordinates for each node 
├── index.html # Canvas-based visualization of the graph 
├── README.md # Project overview and usage instructions
```

---

## 🔧 Requirements

- Node.js (v14 or higher)  
- XAMPP or any local web server (required due to browser CORS restrictions)  
- A modern browser (e.g., Chrome, Firefox, Edge)  

---

## ⚙️ How to Run

### 1. Clone the Repository

```bash
1. Clone the repository
git clone https://github.com/g-worrior/graph-layout-code.git
cd graph-layout-code
```

### 2. Generate the Graph Layout
```
node layout.js
```
This reads data.json, computes node positions, and writes them to layout.json.
Final node positions will also be printed to the console.

### 3. View the Visualization (IMPORTANT: Use a Local Server)
Modern browsers block local file loading due to CORS policies. You must use a local server to open index.html.

✅ Using XAMPP
Install and launch XAMPP
Copy the project folder to:
```
C:\xampp\htdocs\graph-layout-code
```
Start Apache via the XAMPP Control Panel
Open your browser and go to:
```
http://localhost/graph-layout-code/index.html
```
⛔ Missing layout.json?
If layout.json is missing or cannot be loaded, a warning will appear in the browser console and/or canvas. Make sure to run layout.js first.

---

📸 Screenshots
Console output showing node positions
Visual rendering of the graph in index.html
💬 Contact
For questions or feedback, feel free to reach out:
```
GitHub: g-worrior
Email: pelikoswe@gmail.com
```

---

✅ License
This project is provided for educational, evaluation, and demonstration purposes.

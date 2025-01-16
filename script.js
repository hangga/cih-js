// let nodes = [];
// let nodeCount = 0;
// // const grid = document.getElementById('grid');
// const distanceTableBody = document.querySelector('#distanceTable tbody');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const flowText = document.getElementById('flowText');
// const addNodeButton = document.getElementById('addNodeButton');

// // Fungsi untuk menambahkan simpul baru
// function addNode() {
//     nodeCount++;
//     const node = {
//         id: nodeCount,
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height
//     };
//     nodes.push(node);
//     // renderNode(node);
//     updateDistanceTable();
//     drawNodes();
//     logFlow(`Added node ${node.id} at (${node.x.toFixed(2)}, ${node.y.toFixed(2)})`);
// }

// // Fungsi untuk menggambar simpul pada grid
// // function renderNode(node) {
//     // const nodeElement = document.createElement('div');
//     // nodeElement.classList.add('node');
//     // nodeElement.textContent = node.id;
//     // grid.appendChild(nodeElement);
// // }

// // Fungsi untuk memperbarui tabel jarak
// function updateDistanceTable() {
//     distanceTableBody.innerHTML = '';
//     nodes.forEach((node1, index1) => {
//         nodes.forEach((node2, index2) => {
//             if (index1 !== index2) {
//                 const distance = calculateDistance(node1, node2);
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${node1.id}</td>
//                     <td>${node2.id}</td>
//                     <td>${distance.toFixed(2)}</td>
//                 `;
//                 distanceTableBody.appendChild(row);
//             }
//         });
//     });
// }

// // Fungsi untuk menghitung jarak antara dua simpul
// function calculateDistance(node1, node2) {
//     const dx = node2.x - node1.x;
//     const dy = node2.y - node1.y;
//     return Math.sqrt(dx * dx + dy * dy);
// }

// // Fungsi untuk menggambar simpul pada kanvas
// function drawNodes() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     nodes.forEach(node => {
//         // Menggambar simpul
//         ctx.beginPath();
//         ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
//         ctx.fillStyle = 'white';
//         ctx.fill();
//         ctx.closePath();

//         // Menambahkan label pada simpul
//         ctx.fillStyle = 'black';
//         ctx.font = '14px Arial';
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         ctx.fillText(node.id, node.x, node.y);
//     });
//     drawLines();
// }

// // Fungsi untuk menggambar garis antara simpul-simpul pada kanvas
// function drawLines() {
//     ctx.strokeStyle = 'white'; // Garis default berwarna putih
//     ctx.lineWidth = 2;
//     nodes.forEach((node1, index1) => {
//         nodes.forEach((node2, index2) => {
//             if (index1 !== index2) {
//                 ctx.beginPath();
//                 ctx.moveTo(node1.x, node1.y);
//                 ctx.lineTo(node2.x, node2.y);
//                 ctx.stroke();
//                 ctx.closePath();
//             }
//         });
//     });
//     drawShortestPath();
// }

// // Fungsi untuk menggambar rute terpendek dengan warna merah
// function drawShortestPath() {
//     const shortestPath = calculateShortestPath();
//     ctx.strokeStyle = '#FFEB00'; // Garis rute terpendek berwarna kuning
//     ctx.lineWidth = 1;
//     shortestPath.forEach((path) => {
//         const node1 = nodes[path.from - 1];
//         const node2 = nodes[path.to - 1];
//         ctx.beginPath();
//         ctx.moveTo(node1.x, node1.y);
//         ctx.lineTo(node2.x, node2.y);
//         ctx.stroke();
//         ctx.closePath();
//     });
// }

// // Fungsi untuk menghitung rute terpendek menggunakan algoritma CIH
// function calculateShortestPath() {
//     if (nodes.length < 2) return [];

//     // Inisialisasi dengan dua node pertama
//     let tour = [
//         { from: nodes[0].id, to: nodes[1].id },
//         { from: nodes[1].id, to: nodes[0].id }
//     ];

//     // Fungsi untuk mendapatkan jarak antara dua node berdasarkan ID
//     function getDistance(id1, id2) {
//         const node1 = nodes.find(node => node.id === id1);
//         const node2 = nodes.find(node => node.id === id2);
//         return calculateDistance(node1, node2);
//     }

//     // Fungsi untuk menghitung biaya penambahan node baru ke dalam tour
//     function calculateInsertionCost(tour, newNodeId) {
//         let minCost = Infinity;
//         let bestInsertion = null;

//         for (let i = 0; i < tour.length; i++) {
//             const current = tour[i];
//             const distanceCurrent = getDistance(current.from, current.to);
//             const distanceNewFrom = getDistance(current.from, newNodeId);
//             const distanceNewTo = getDistance(newNodeId, current.to);
//             const insertionCost = distanceNewFrom + distanceNewTo - distanceCurrent;

//             if (insertionCost < minCost) {
//                 minCost = insertionCost;
//                 bestInsertion = { from: current.from, to: current.to, newNodeId };
//             }
//         }

//         return bestInsertion;
//     }

//     // Tambahkan node lain ke dalam tour menggunakan CIH
//     for (let i = 2; i < nodes.length; i++) {
//         const newNodeId = nodes[i].id;
//         const bestInsertion = calculateInsertionCost(tour, newNodeId);

//         if (bestInsertion) {
//             // Sisipkan node baru ke dalam tour
//             tour = tour.filter(edge => edge.from !== bestInsertion.from || edge.to !== bestInsertion.to);
//             tour.push({ from: bestInsertion.from, to: newNodeId });
//             tour.push({ from: newNodeId, to: bestInsertion.to });
//         }
//     }

//     return tour;
// }

// // Fungsi untuk mencatat langkah-langkah flow
// function logFlow(message) {
//     flowText.value += message + '\n';
//     flowText.scrollTop = flowText.scrollHeight;
// }

// // Tambahkan event listener untuk tombol Add Node
// addNodeButton.addEventListener('click', addNode);

// document.addEventListener('DOMContentLoaded', () => {
//     addNode();
//     addNode();
//     addNode();
// });

let nodes = [];
let nodeCount = 0;
const distanceTableBody = document.querySelector('#distanceTable tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const flowText = document.getElementById('flowText');
const addNodeButton = document.getElementById('addNodeButton');

// Fungsi untuk menambahkan simpul baru
function addNode() {
    nodeCount++;
    const node = {
        id: nodeCount,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    };
    nodes.push(node);
    updateDistanceTable();
    draw();
    logFlow(`Added node ${node.id} at (${node.x.toFixed(2)}, ${node.y.toFixed(2)})`);
}

// Fungsi untuk memperbarui tabel jarak
function updateDistanceTable() {
    distanceTableBody.innerHTML = '';
    nodes.forEach((node1, index1) => {
        nodes.forEach((node2, index2) => {
            if (index1 !== index2) {
                const distance = calculateDistance(node1, node2);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${node1.id}</td>
                    <td>${node2.id}</td>
                    <td>${distance.toFixed(2)}</td>
                `;
                distanceTableBody.appendChild(row);
            }
        });
    });
}

// Fungsi untuk menghitung jarak antara dua simpul
function calculateDistance(node1, node2) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Fungsi untuk menggambar garis antara simpul-simpul pada kanvas
function drawLines() {
    ctx.strokeStyle = 'white'; // Garis default berwarna putih
    ctx.lineWidth = 2;
    nodes.forEach((node1, index1) => {
        nodes.forEach((node2, index2) => {
            if (index1 !== index2) {
                ctx.beginPath();
                ctx.moveTo(node1.x, node1.y);
                ctx.lineTo(node2.x, node2.y);
                ctx.stroke();
                ctx.closePath();
            }
        });
    });
    drawShortestPath();
}

// Fungsi untuk menggambar rute terpendek dengan warna merah
function drawShortestPath() {
    const shortestPath = calculateShortestPath();
    ctx.strokeStyle = '#E82561'; // Garis rute terpendek berwarna beda
    ctx.lineWidth = 3;
    shortestPath.forEach((path) => {
        const node1 = nodes[path.from - 1];
        const node2 = nodes[path.to - 1];
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();
        ctx.closePath();
    });
}

// Fungsi untuk menghitung rute terpendek menggunakan algoritma CIH
function calculateShortestPath() {
    if (nodes.length < 2) return [];

    // Inisialisasi dengan dua node pertama
    let tour = [
        { from: nodes[0].id, to: nodes[1].id },
        { from: nodes[1].id, to: nodes[0].id }
    ];

    // Fungsi untuk mendapatkan jarak antara dua node berdasarkan ID
    function getDistance(id1, id2) {
        const node1 = nodes.find(node => node.id === id1);
        const node2 = nodes.find(node => node.id === id2);
        return calculateDistance(node1, node2);
    }

    // Fungsi untuk menghitung biaya penambahan node baru ke dalam tour
    function calculateInsertionCost(tour, newNodeId) {
        let minCost = Infinity;
        let bestInsertion = null;

        for (let i = 0; i < tour.length; i++) {
            const current = tour[i];
            const distanceCurrent = getDistance(current.from, current.to);
            const distanceNewFrom = getDistance(current.from, newNodeId);
            const distanceNewTo = getDistance(newNodeId, current.to);
            const insertionCost = distanceNewFrom + distanceNewTo - distanceCurrent;

            if (insertionCost < minCost) {
                minCost = insertionCost;
                bestInsertion = { from: current.from, to: current.to, newNodeId };
            }
        }

        return bestInsertion;
    }

    // Tambahkan node lain ke dalam tour menggunakan CIH
    for (let i = 2; i < nodes.length; i++) {
        const newNodeId = nodes[i].id;
        const bestInsertion = calculateInsertionCost(tour, newNodeId);

        if (bestInsertion) {
            // Sisipkan node baru ke dalam tour
            tour = tour.filter(edge => edge.from !== bestInsertion.from || edge.to !== bestInsertion.to);
            tour.push({ from: bestInsertion.from, to: newNodeId });
            tour.push({ from: newNodeId, to: bestInsertion.to });
        }
    }

    return tour;
}

// Fungsi untuk menggambar simpul pada kanvas
function drawNodes() {
    nodes.forEach(node => {
        // Menggambar simpul
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#C5BAFF';
        ctx.fill();
        ctx.closePath();

        // Menambahkan label pada simpul
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
    });
}

// Fungsi untuk menggambar semua elemen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    drawNodes();
}

// Fungsi untuk mencatat langkah-langkah flow
function logFlow(message) {
    flowText.value += message + '\n';
    flowText.scrollTop = flowText.scrollHeight;
}

// Tambahkan event listener untuk tombol Add Node
addNodeButton.addEventListener('click', addNode);

document.addEventListener('DOMContentLoaded', () => {
    addNode();
    addNode();
    addNode();
});
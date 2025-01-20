let nodes = [];
let nodeCount = 0;
let stepCount = 0; // untuk melacak stepnya
const distanceTableBody = document.querySelector('#distanceTable tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const flowText = document.getElementById('flowText');

// untuk menambahkan simpul baru
function addNode(x, y) {
    nodeCount++;
    const node = {
        id: nodeCount,
        x: x,
        y: y
    };
    nodes.push(node);
    updateDistanceTable();
    draw();

    logFlow(`Added node ${node.id} at coordinates (${node.x.toFixed(2)}, ${node.y.toFixed(2)})`);
    logFlow(`Recomputing sub-tours after adding node ${node.id}`);
    logSubTours();
}

// untuk memperbarui tabel jarak
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

// Fungsi untuk mengurutkan tour berdasarkan jalur yang berkelanjutan
function orderTour(tour) {
    if (tour.length === 0) return [];

    const orderedTour = [tour[0]];
    let currentTo = tour[0].to;

    while (orderedTour.length < tour.length) {
        const nextPath = tour.find(path => path.from === currentTo);
        if (nextPath) {
            orderedTour.push(nextPath);
            currentTo = nextPath.to;
        } else {
            break;
        }
    }

    return orderedTour;
}

// Fungsi untuk menghitung jarak antara dua simpul
function calculateDistance(node1, node2) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Fungsi untuk menggambar garis antara simpul-simpul pada kanvas
function drawLines() {
    ctx.strokeStyle = '#8174A0'; // Garis default berwarna abu-abu keunguan
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

// Fungsi untuk menggambar rute terpendek dengan warna hijau
function drawShortestPath() {
    const { tour } = calculateShortestPath();
    ctx.strokeStyle = 'lime'; // Garis rute terpendek
    ctx.lineWidth = 3;
    tour.forEach((path) => {
        const node1 = nodes[path.from - 1];
        const node2 = nodes[path.to - 1];
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();
        ctx.closePath();
    });
}

// Fungsi untuk menghitung jarak antara dua node berdasarkan ID
function getDistance(id1, id2) {
    const node1 = nodes.find(node => node.id === id1);
    const node2 = nodes.find(node => node.id === id2);
    return calculateDistance(node1, node2);
}

// Fungsi untuk menghitung biaya penambahan node baru ke dalam tour
function calculateInsertionCost(tour, newNodeId) {
    let minCost = Infinity;
    let bestInsertion = null;
    const allPossibleInsertions = [];

    for (let i = 0; i < tour.length; i++) {
        const current = tour[i];
        const distanceCurrent = getDistance(current.from, current.to);
        const distanceNewFrom = getDistance(current.from, newNodeId);
        const distanceNewTo = getDistance(newNodeId, current.to);
        const insertionCost = distanceNewFrom + distanceNewTo - distanceCurrent;

        allPossibleInsertions.push({ from: current.from, to: current.to, newNodeId, insertionCost });

        if (insertionCost < minCost) {
            minCost = insertionCost;
            bestInsertion = { from: current.from, to: current.to, newNodeId };
        }
    }

    return { bestInsertion, allPossibleInsertions };
}

// Fungsi untuk menghitung rute terpendek menggunakan algoritma CIH
function calculateShortestPath() {
    if (nodes.length < 2) return { tour: [], subTours: [] };

    // Inisialisasi dengan dua node pertama
    let tour = [
        { from: nodes[0].id, to: nodes[1].id },
        { from: nodes[1].id, to: nodes[0].id }
    ];
    const subTours = [[...tour]];

    // Tambahkan node lain ke dalam tour menggunakan CIH
    for (let i = 2; i < nodes.length; i++) {
        const newNodeId = nodes[i].id;
        const { bestInsertion, allPossibleInsertions } = calculateInsertionCost(tour, newNodeId);

        // Log semua kemungkinan sub-tours
        allPossibleInsertions.forEach((insertion, index) => {
            const tempTour = tour.filter(edge => edge.from !== insertion.from || edge.to !== insertion.to);
            tempTour.push({ from: insertion.from, to: insertion.newNodeId });
            tempTour.push({ from: insertion.newNodeId, to: insertion.to });
            subTours.push([...tempTour]);
        });

        if (bestInsertion) {
            // Sisipkan node baru ke dalam tour
            tour = tour.filter(edge => edge.from !== bestInsertion.from || edge.to !== bestInsertion.to);
            tour.push({ from: bestInsertion.from, to: bestInsertion.newNodeId });
            tour.push({ from: bestInsertion.newNodeId, to: bestInsertion.to });

            // Simpan sub-tour saat ini
            subTours.push([...tour]);
        }
    }

    return { tour, subTours };
}

// Fungsi untuk menghitung total jarak sebuah sub-tour
function calculateTourDistance(tour) {
    return tour.reduce((total, path) => total + getDistance(path.from, path.to), 0);
}

// Fungsi untuk mencatat langkah-langkah flow
function logFlow(message, isFinal = false) {
    const formattedMessage = `Step ${stepCount}: ${message}`;
    const logEntry = document.createElement('div');
    logEntry.textContent = formattedMessage;

    // Tambahkan warna khusus jika ini adalah final chosen sub-tour
    if (isFinal) {
        logEntry.style.color = '#0fff03'; // warna chosen sub-tour
    }

    flowText.appendChild(logEntry);
    flowText.scrollTop = flowText.scrollHeight;
    stepCount++;
}

// Fungsi untuk mencatat sub-tours dengan format lebih mudah dibaca
function logSubTours() {
    const { subTours } = calculateShortestPath();
    const chosenSubTour = subTours[subTours.length - 1]; // Sub-tour terakhir adalah yang terpilih

    logFlow('Evaluating sub-tours:');
    subTours.forEach((subTour, index) => {
        const isChosen = subTour === chosenSubTour;
        const subTourDetails = subTour.map(path => `(${path.from} -> ${path.to})`).join(', ');
        const totalDistance = calculateTourDistance(subTour).toFixed(2);
        logFlow(`Sub-tour ${index + 1}: ${subTourDetails}, Total Distance: ${totalDistance}${isChosen ? ' is chosen' : ''}`, isChosen);
    });

    if (chosenSubTour) {
        const orderedTour = orderTour(chosenSubTour);
        const orderedDetails = orderedTour.map(path => `(${path.from} -> ${path.to})`).join(', ');
        logFlow(`Final chosen: ${orderedDetails}`, true); // Teks berwarna untuk final
    }
}

// Fungsi untuk menggambar simpul pada kanvas
function drawNodes() {
    nodes.forEach(node => {
        // Menggambar simpul
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#C30E59';
        ctx.fill();
        
        // stroke simpul
        ctx.strokeStyle = '#DA498D';
        ctx.lineWidth = 1.5;
        ctx.stroke(); 
        ctx.closePath();

        // label pada simpul
        ctx.fillStyle = 'white';
        ctx.font = '17px Times New Roman';
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

// Tambahkan event listener untuk klik pada kanvas
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addNode(x, y);
});

function resetApp() {
    // Hapus semua node
    nodes = [];
    nodeCount = 0;
    stepCount = 0;

    // Kosongkan tabel jarak
    distanceTableBody.innerHTML = '';

    // Kosongkan log flow
    flowText.value = '';
    flowText.innerText = '';

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Log pesan bahwa aplikasi telah direset
    // logFlow("Application has been reset.");
}

// تهيئة Canvas
const canvas = document.getElementById('dxf-canvas');
const ctx = canvas.getContext('2d');
const layerControls = document.getElementById('layer-controls');
let dxfData = null;
const layerVisibility = {}; // لتخزين حالة إظهار الطبقات

// تحميل ملف DXF
document.getElementById('dxf-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        parseDXF(contents);
    };
    reader.readAsText(file);

    /*
    const file = event.target.files[0];
    if (!file) return console.log("No file selected");
      const reader = new FileReader();
      reader.onload = function (e) {
        const parser = new DxfParser();
        let dxfData;
        try {
          dxfData = parser.parseSync(e.target.result);
          window.lastDxfData = dxfData; // Store dxfData globally
          // const scaleInput = parseFloat(document.getElementById("layerScale").value) || 1;
          // drawUploadedDXF(dxfData, scaleInput);

        } catch (error) {
          console.error("Error parsing DXF:", error);
          return;
        }
        console.log("DXF Parsed Data:", dxfData);
      };
      reader.readAsText(file);
    */
});

// تحليل ملف DXF باستخدام dxf-parser.js
function parseDXF(dxfText) {
    try {
        const parser = new DXFParser();
        dxfData = parser.parse(dxfText);
        console.log("DXF Data:", dxfData);

        // عرض عناصر التحكم للطبقات
        setupLayerControls();
        // رسم البيانات
        drawDXF();
    } catch (err) {
        console.error("Failed to parse DXF:", err);
    }
}

// إنشاء checkboxes للطبقات
function setupLayerControls() {
    layerControls.innerHTML = '';
    if (!dxfData || !dxfData.entities) return;

    // استخراج جميع الطبقات الفريدة
    const layers = new Set();
    dxfData.entities.forEach(entity => {
        if (entity.layer) layers.add(entity.layer);
    });

    layers.forEach(layer => {
        layerVisibility[layer] = true; // افتراضيًا، الطبقة ظاهرة

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.dataset.layer = layer;
        checkbox.addEventListener('change', toggleLayer);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(layer));
        layerControls.appendChild(label);
    });
}

// تبديل إظهار/إخفاء الطبقة
function toggleLayer(e) {
    const layer = e.target.dataset.layer;
    layerVisibility[layer] = e.target.checked;
    drawDXF(); // إعادة الرسم
}

// رسم عناصر DXF على Canvas
function drawDXF() {
    if (!dxfData || !dxfData.entities) return;

    // مسح Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم كل عنصر إذا كانت طبقتها ظاهرة
    dxfData.entities.forEach(entity => {
        if (!layerVisibility[entity.layer]) return;

        ctx.strokeStyle = getLayerColor(entity.layer);
        ctx.lineWidth = 1;

        switch (entity.type) {
            case 'LINE':
                drawLine(entity);
                break;
            case 'CIRCLE':
                drawCircle(entity);
                break;
            // يمكن إضافة المزيد من الأنواع هنا
        }
    });
}

// رسم الخطوط
function drawLine(line) {
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
}

// رسم الدوائر
function drawCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
}

// توليد لون عشوائي للطبقة
function getLayerColor(layer) {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
    const hash = Array.from(layer).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}
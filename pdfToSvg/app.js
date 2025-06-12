document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const pdfInput = document.getElementById('pdfInput');
    const scaleInput = document.getElementById('scale');
    const scaleValue = document.getElementById('scaleValue');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressBar = document.getElementById('progress');
    const pdfCanvas = document.getElementById('pdfCanvas');
    const svgOutput = document.getElementById('svgOutput');
    const controls = document.getElementById('controls');
    
    // Current PDF and SVG state
    let currentPdf = null;
    let currentSvg = null;
    
    // Update scale display
    scaleInput.addEventListener('input', () => {
        scaleValue.textContent = scaleInput.value;
    });
    
    // Handle PDF file selection
    pdfInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            controls.style.display = 'block';
            progressBar.value = 0;
            
            // Load the PDF
            const url = URL.createObjectURL(file);
            currentPdf = await pdfjsLib.getDocument({
                url,
                withCredentials: false
            }).promise;
            
            // Show first page preview
            await renderPdfPreview(currentPdf, parseFloat(scaleInput.value));
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF. Please try another file.');
        }
    });
    
    // Convert button handler
    convertBtn.addEventListener('click', async () => {
        if (!currentPdf) return;
        
        try {
            convertBtn.disabled = true;
            progressBar.value = 0;
            
            const scale = parseFloat(scaleInput.value);
            currentSvg = await convertPdfToSvg(currentPdf, {
                scale,
                onProgress: (progress) => {
                    progressBar.value = progress * 100;
                }
            });
            
            // Display SVG
            svgOutput.innerHTML = currentSvg;
            downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Conversion error:', error);
            alert('Error converting PDF to SVG.');
        } finally {
            convertBtn.disabled = false;
        }
    });
    
    // Download button handler
    downloadBtn.addEventListener('click', () => {
        if (!currentSvg) return;
        downloadSvg(currentSvg, pdfInput.files[0].name.replace('.pdf', '') + '.svg');
    });
    
    // Function to render PDF preview
    async function renderPdfPreview(pdf, scale) {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale });
        
        // Prepare canvas
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;
        
        // Render PDF page
        await page.render({
            canvasContext: pdfCanvas.getContext('2d'),
            viewport
        }).promise;
    }
    
    // Main conversion function
    async function convertPdfToSvg(pdf, options = {}) {
        const {
            scale = 1.5,
            onProgress = () => {}
        } = options;
        
        const svgPages = [];
        const numPages = pdf.numPages;
        
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });
            
            // Create canvas for rendering
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Render PDF page to canvas
            await page.render({
                canvasContext: context,
                viewport,
                intent: 'vector'
            }).promise;
            
            // Convert canvas to SVG
            const svg = await canvasToSvg(canvas, {
                pageNumber: i,
                scale
            });
            
            svgPages.push(svg);
            onProgress(i / numPages);
        }
        
        return svgPages.length === 1 ? svgPages[0] : svgPages.join('\n<hr>\n');
    }
    
    // Canvas to SVG conversion
    async function canvasToSvg(canvas, options) {
        const { pageNumber, scale } = options;
        
        // Get image data
        const imageData = canvas.toDataURL('image/png');
        
        // Create SVG
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" 
     height="${canvas.height}"
     viewBox="0 0 ${canvas.width} ${canvas.height}">
  <title>Page ${pageNumber}</title>
  <rect width="100%" height="100%" fill="white"/>
  <image x="0" y="0" width="${canvas.width}" height="${canvas.height}" 
         xlink:href="${imageData}" preserveAspectRatio="none"/>
</svg>`;
    }
    
    // Download SVG file
    function downloadSvg(svg, filename) {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
});
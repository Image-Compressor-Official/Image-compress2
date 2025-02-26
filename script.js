// Menu Toggle
function toggleMenu() {
    const menu = document.querySelector('.menu-bar');
    menu.style.transform = menu.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)';
}

// Show Tool Section
function showTool(toolId) {
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    document.getElementById(toolId).classList.add('active');
}

// Common Upload Handler
function setupUpload(uploadAreaId, fileInputId, previewId, optionsId, maxSizeMB = 50) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);
    const options = document.getElementById(optionsId);
    let fileData = null;

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

    function handleFile(file) {
        if (file && file.size <= maxSizeMB * 1024 * 1024) {
            fileData = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                options.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            alert(`Please upload a file up to ${maxSizeMB}MB.`);
        }
    }

    return { fileData, preview, options };
}

// Image Compressor
const imageCompressor = setupUpload('upload-image', 'image-file', 'image-preview', 'image-options');
const modeSelect = document.getElementById('image-mode');
const manualOptions = document.getElementById('manual-options');
const qualitySlider = document.getElementById('image-quality');
const qualityValue = document.getElementById('image-quality-value');
const compressImageBtn = document.getElementById('compress-image');
const downloadImageBtn = document.getElementById('download-image');

modeSelect.addEventListener('change', () => {
    manualOptions.style.display = modeSelect.value === 'manual' ? 'block' : 'none';
});
qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = `${qualitySlider.value}%`;
});
compressImageBtn.addEventListener('click', () => {
    if (!imageCompressor.fileData) return;
    compressImageBtn.textContent = 'Compressing...';
    compressImageBtn.disabled = true;
    setTimeout(() => {
        const canvas = document.createElement('canvas');
        const img = imageCompressor.preview.querySelector('img');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const quality = modeSelect.value === 'manual' ? qualitySlider.value / 100 : 0.1; // Auto to 1KB approx
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        imageCompressor.preview.innerHTML = `<img src="${dataUrl}" alt="Compressed">`;
        downloadImageBtn.disabled = false;
        compressImageBtn.textContent = 'Compress';
        compressImageBtn.disabled = false;
    }, 1000); // Simulate processing
});
downloadImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = imageCompressor.preview.querySelector('img').src;
    link.download = 'compressed-image.jpg';
    link.click();
});

// Image Resizer
const imageResizer = setupUpload('upload-resize', 'resize-file', 'resize-preview', 'resize-options');
const resizeBtn = document.getElementById('resize-image');
const downloadResizeBtn = document.getElementById('download-resize');
resizeBtn.addEventListener('click', () => {
    if (!imageResizer.fileData) return;
    resizeBtn.textContent = 'Resizing...';
    resizeBtn.disabled = true;
    setTimeout(() => {
        const canvas = document.createElement('canvas');
        const img = imageResizer.preview.querySelector('img');
        canvas.width = document.getElementById('resize-width').value;
        canvas.height = document.getElementById('resize-height').value;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        imageResizer.preview.innerHTML = `<img src="${dataUrl}" alt="Resized">`;
        downloadResizeBtn.disabled = false;
        resizeBtn.textContent = 'Resize';
        resizeBtn.disabled = false;
    }, 1000);
});
downloadResizeBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = imageResizer.preview.querySelector('img').src;
    link.download = 'resized-image.jpg';
    link.click();
});

// Image Converter
const imageConverter = setupUpload('upload-convert', 'convert-file', 'convert-preview', 'convert-options');
const convertBtn = document.getElementById('convert-image');
const downloadConvertBtn = document.getElementById('download-convert');
convertBtn.addEventListener('click', () => {
    if (!imageConverter.fileData) return;
    convertBtn.textContent = 'Converting...';
    convertBtn.disabled = true;
    setTimeout(() => {
        const format = document.getElementById('convert-format').value;
        const canvas = document.createElement('canvas');
        const img = imageConverter.preview.querySelector('img');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(`image/${format}`);
        imageConverter.preview.innerHTML = `<img src="${dataUrl}" alt="Converted">`;
        downloadConvertBtn.disabled = false;
        convertBtn.textContent = 'Convert';
        convertBtn.disabled = false;
    }, 1000);
});
downloadConvertBtn.addEventListener('click', () => {
    const format = document.getElementById('convert-format').value;
    const link = document.createElement('a');
    link.href = imageConverter.preview.querySelector('img').src;
    link.download = `converted-image.${format}`;
    link.click();
});

// Note: PDF tools require pdf.js library and server-side processing for full functionality.
// Below is a simplified client-side simulation.

// PDF Compressor
const pdfCompressor = setupUpload('upload-pdf-compress', 'pdf-compress-file', 'pdf-compress-preview', 'pdf-compress-options');
const compressPdfBtn = document.getElementById('compress-pdf');
const downloadPdfCompressBtn = document.getElementById('download-pdf-compress');
compressPdfBtn.addEventListener('click', () => {
    if (!pdfCompressor.fileData) return;
    compressPdfBtn.textContent = 'Compressing...';
    compressPdfBtn.disabled = true;
    setTimeout(() => {
        // Simulate compression (requires server-side for real PDF compression)
        pdfCompressor.preview.innerHTML = '<p>Compressed PDF (Simulated)</p>';
        downloadPdfCompressBtn.disabled = false;
        compressPdfBtn.textContent = 'Compress';
        compressPdfBtn.disabled = false;
    }, 1000);
});

// PDF Converter and Resizer would require server-side logic or advanced libraries beyond this scope.
// For full implementation, integrate with a backend service.

// Initial Setup
showTool('home');

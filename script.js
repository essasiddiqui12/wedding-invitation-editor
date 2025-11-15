// ============================================================================
// Wedding Invitation Editor - Main Application
// ============================================================================

// ============================================================================
// Font Options and Loader
// ============================================================================

// Fonts to offer (family name and Google href)
// Extended list of elegant, wedding-friendly fonts including serif, script, modern, and classic options
const FONT_OPTIONS = [
    // Serif fonts
    { name: 'Lora', google: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap' },
    { name: 'Cinzel', google: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap' },
    { name: 'Spectral SC', google: 'https://fonts.googleapis.com/css2?family=Spectral+SC:wght@400;600;700&display=swap' },
    { name: 'Playfair Display', google: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
    { name: 'Cormorant Garamond', google: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap' },
    { name: 'Merriweather', google: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap' },
    { name: 'Crimson Text', google: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap' },
    { name: 'Libre Baskerville', google: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap' },
    { name: 'EB Garamond', google: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap' },
    
    // Calligraphy / Script fonts
    { name: 'Dancing Script', google: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap' },
    { name: 'Great Vibes', google: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap' },
    { name: 'Parisienne', google: 'https://fonts.googleapis.com/css2?family=Parisienne&display=swap' },
    { name: 'Charm', google: 'https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap' },
    { name: 'Pinyon Script', google: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap' },
    { name: 'Allura', google: 'https://fonts.googleapis.com/css2?family=Allura&display=swap' },
    
    // Modern display fonts
    { name: 'Quicksand', google: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap' },
    { name: 'Lato', google: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' },
    { name: 'Inter', google: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
    
    // System fallbacks (no Google link needed)
    { name: 'Georgia', google: null },
    { name: 'Times New Roman', google: null }
];

// Inject Google font links (skip nulls)
(function loadFontLinks() {
    FONT_OPTIONS.forEach(f => {
        if (f.google) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = f.google;
            document.head.appendChild(link);
        }
    });
})();

// Populate the font <select>
function populateFontOptions() {
    const fontSelect = document.getElementById('fontFamily');
    if (!fontSelect) return;
    
    fontSelect.innerHTML = '';
    FONT_OPTIONS.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        fontSelect.appendChild(opt);
    });
}

// Application State
const appState = {
    pages: [],
    currentPageIndex: 0,
    selectedTextBoxId: null,
    history: [],
    historyIndex: -1,
    maxHistoryDepth: 30
};

// Initialize default pages if none exist
function initializePages() {
    if (appState.pages.length === 0) {
        appState.pages = [
            {
                id: 1,
                title: 'Blessing 1',
                img: 'images/portrait1.svg',
                defaultText: "We invite you and your family's gracious presence and blessing",
                altText: "Pastel floral background with central empty space for wedding text",
                textBoxes: []
            },
            {
                id: 2,
                title: 'Blessing 2',
                img: 'images/portrait2.svg',
                defaultText: "Join us for a celebration of love and joy",
                altText: "Soft mint background with subtle floral accents",
                textBoxes: []
            },
            {
                id: 3,
                title: 'Blessing 3',
                img: 'images/portrait3.svg',
                defaultText: "Please bless us with your presence",
                altText: "Light pink textured background suitable for elegant invitation text",
                textBoxes: []
            }
        ];
        saveToHistory();
    }
}

// ============================================================================
// History Management (Undo/Redo)
// ============================================================================

function saveToHistory() {
    // Remove any history after current index (when undoing then making changes)
    appState.history = appState.history.slice(0, appState.historyIndex + 1);
    
    // Deep clone the pages state
    const stateCopy = JSON.parse(JSON.stringify(appState.pages));
    
    // Add to history
    appState.history.push(stateCopy);
    appState.historyIndex++;
    
    // Limit history depth
    if (appState.history.length > appState.maxHistoryDepth) {
        appState.history.shift();
        appState.historyIndex--;
    }
    
    updateUndoRedoButtons();
}

function undo() {
    if (appState.historyIndex > 0) {
        appState.historyIndex--;
        appState.pages = JSON.parse(JSON.stringify(appState.history[appState.historyIndex]));
        renderCurrentPage();
        updateEditorPanel();
        updateUndoRedoButtons();
    }
}

function redo() {
    if (appState.historyIndex < appState.history.length - 1) {
        appState.historyIndex++;
        appState.pages = JSON.parse(JSON.stringify(appState.history[appState.historyIndex]));
        renderCurrentPage();
        updateEditorPanel();
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    document.getElementById('btnUndo').disabled = appState.historyIndex <= 0;
    document.getElementById('btnRedo').disabled = appState.historyIndex >= appState.history.length - 1;
}

// ============================================================================
// Page Management
// ============================================================================

function getCurrentPage() {
    return appState.pages[appState.currentPageIndex];
}

function renderThumbnails() {
    const container = document.getElementById('thumbnailsList');
    container.innerHTML = '';
    
    appState.pages.forEach((page, index) => {
        const item = document.createElement('div');
        item.className = `thumbnail-item ${index === appState.currentPageIndex ? 'active' : ''}`;
        item.onclick = () => selectPage(index);
        
        const img = document.createElement('img');
        img.src = page.img;
        img.alt = page.altText || page.title;
        img.setAttribute('data-ai-guide', page.altText || page.defaultText || page.title);
        img.onerror = () => {
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="178" viewBox="0 0 100 178"><rect width="100" height="178" fill="%23f0f0f0"/><text x="50" y="89" text-anchor="middle" fill="%23999" font-size="12">No Image</text></svg>';
        };
        
        const label = document.createElement('div');
        label.className = 'thumbnail-label';
        label.textContent = page.title;
        
        item.appendChild(img);
        item.appendChild(label);
        container.appendChild(item);
    });
}

function selectPage(index) {
    if (index >= 0 && index < appState.pages.length) {
        appState.currentPageIndex = index;
        appState.selectedTextBoxId = null;
        renderThumbnails();
        renderCurrentPage();
        updateEditorPanel();
        updateNavigationButtons();
    }
}

function renderCurrentPage() {
    const page = getCurrentPage();
    const previewBackground = document.getElementById('previewBackground');
    const previewContent = document.getElementById('previewContent');
    const pageTitleInput = document.getElementById('pageTitle');
    
    // Update background with accessibility attributes
    previewBackground.style.backgroundImage = `url(${page.img})`;
    // Set alt text and data-ai-guide for accessibility and AI tools
    if (previewBackground.tagName === 'IMG') {
        previewBackground.alt = page.altText || page.title;
        previewBackground.setAttribute('data-ai-guide', page.altText || page.defaultText || page.title);
    } else {
        // For div background, we'll add aria-label
        previewBackground.setAttribute('aria-label', page.altText || page.title);
        previewBackground.setAttribute('data-ai-guide', page.altText || page.defaultText || page.title);
    }
    
    // Update page title
    pageTitleInput.value = page.title;
    
    // Clear and render text boxes
    previewContent.innerHTML = '';
    
    // If no text boxes exist, create a default one with defaultText
    if (page.textBoxes.length === 0) {
        // Create a default text box in the center
        const defaultBox = {
            id: generateTextBoxId(),
            text: '', // Empty - will show defaultText
            xPct: 20,
            yPct: 40,
            widthPct: 60,
            heightPct: 20,
            fontFamily: 'Lora',
            fontSize: 28,
            fontWeight: 400,
            align: 'center',
            lineHeight: 1.2,
            letterSpacing: 0,
            color: '#333'
        };
        page.textBoxes.push(defaultBox);
    }
    
    page.textBoxes.forEach(box => {
        createTextBoxElement(box);
    });
}

function updateNavigationButtons() {
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    
    btnPrev.disabled = appState.currentPageIndex === 0;
    btnNext.disabled = appState.currentPageIndex === appState.pages.length - 1;
}

// ============================================================================
// Text Box Management
// ============================================================================

let textBoxCounter = 1;
let isDragging = false;
let isResizing = false;
let dragStartX = 0;
let dragStartY = 0;
let resizeHandle = null;
let currentTextBox = null;

function generateTextBoxId() {
    return `tb${textBoxCounter++}`;
}

// Alternative UID generator (for compatibility)
function uid(prefix = 'tb') {
    return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

// ============================================================================
// Add New Text Box
// ============================================================================

/**
 * Create a default text box object
 */
function createDefaultTextBox() {
    const page = getCurrentPage();
    return {
        id: generateTextBoxId(),
        text: '', // Empty - will show defaultText
        // position/size as percentages of card (centered default)
        xPct: 20,
        yPct: 30,
        widthPct: 60,
        heightPct: 18,
        fontFamily: 'Lora',
        fontSize: 28,
        fontWeight: 400,
        align: 'center',
        lineHeight: 1.2,
        letterSpacing: 0,
        color: '#000000'
    };
}

/**
 * Add new text box to current page and render/select
 */
function addNewTextBox() {
    const page = getCurrentPage();
    if (!page.textBoxes) {
        page.textBoxes = [];
    }
    
    const tb = createDefaultTextBox();
    page.textBoxes.push(tb);
    
    saveToHistory();
    renderCurrentPage();
    selectTextBox(tb.id);
    
    // Focus the text editor
    document.getElementById('textContent').focus();
}

function createTextBoxElement(boxData) {
    const previewCard = document.getElementById('previewCard');
    const cardRect = previewCard.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    const page = getCurrentPage();
    
    const textBox = document.createElement('div');
    textBox.className = 'text-box';
    textBox.id = boxData.id;
    textBox.style.left = `${boxData.xPct}%`;
    textBox.style.top = `${boxData.yPct}%`;
    textBox.style.width = `${boxData.widthPct}%`;
    textBox.style.height = `${boxData.heightPct}%`;
    // Apply font properties to text box
    const fontFamily = boxData.fontFamily || 'Lora';
    // Quote family if it contains spaces
    const quotedFamily = fontFamily.indexOf(' ') >= 0 ? `"${fontFamily}", serif` : fontFamily;
    textBox.style.fontFamily = quotedFamily;
    textBox.style.fontSize = `${boxData.fontSize || 28}px`;
    textBox.style.fontWeight = boxData.fontWeight || 400;
    textBox.style.textAlign = boxData.align || 'center';
    textBox.style.lineHeight = boxData.lineHeight || 1.2;
    textBox.style.letterSpacing = `${boxData.letterSpacing || 0}px`;
    textBox.style.color = boxData.color || '#333';
    
    const content = document.createElement('div');
    content.className = 'text-box-content resizable-text';
    // Use defaultText if box text is empty
    const textToShow = (boxData.text && boxData.text.trim().length) ? boxData.text : (page.defaultText || '');
    content.textContent = textToShow;
    
    // Apply font properties to content
    content.style.fontFamily = quotedFamily;
    content.style.fontSize = `${boxData.fontSize || 28}px`;
    content.style.fontWeight = boxData.fontWeight || 400;
    content.style.textAlign = boxData.align || 'center';
    content.style.lineHeight = boxData.lineHeight || 1.2;
    content.style.letterSpacing = `${boxData.letterSpacing || 0}px`;
    content.style.color = boxData.color || '#000000';
    
    textBox.appendChild(content);
    
    // Auto-fit font size after element is added to DOM
    // Use setTimeout to ensure layout is calculated
    setTimeout(() => {
        const fittedFontSize = fitTextToBox(content, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
        // Store both fontSize and fontSizePx for compatibility
        boxData.fontSize = fittedFontSize;
        boxData.fontSizePx = fittedFontSize; // Store absolute px for canvas export
        textBox.style.fontSize = fittedFontSize + 'px';
        content.style.fontSize = fittedFontSize + 'px';
    }, 0);
    
    // Add resize handles
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
    handles.forEach(handle => {
        const handleEl = document.createElement('div');
        handleEl.className = `resize-handle ${handle}`;
        textBox.appendChild(handleEl);
    });
    
    // Add floating toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'floating-toolbar';
    toolbar.style.display = 'none';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'toolbar-btn';
    deleteBtn.title = 'Delete';
    deleteBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTextBox(boxData.id);
    };
    
    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'toolbar-btn';
    duplicateBtn.title = 'Duplicate';
    duplicateBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
    duplicateBtn.onclick = (e) => {
        e.stopPropagation();
        duplicateTextBox(boxData.id);
    };
    
    toolbar.appendChild(deleteBtn);
    toolbar.appendChild(duplicateBtn);
    textBox.appendChild(toolbar);
    
    // Event listeners
    textBox.addEventListener('pointerdown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
            startResize(e, textBox, e.target);
        } else if (e.target !== toolbar && !toolbar.contains(e.target)) {
            startDrag(e, textBox);
        }
    });
    
    textBox.addEventListener('click', (e) => {
        e.stopPropagation();
        selectTextBox(boxData.id);
    });
    
    document.getElementById('previewContent').appendChild(textBox);
    
    if (boxData.id === appState.selectedTextBoxId) {
        selectTextBox(boxData.id);
    }
}

function selectTextBox(id) {
    appState.selectedTextBoxId = id;
    
    // Update visual selection
    document.querySelectorAll('.text-box').forEach(box => {
        box.classList.remove('selected');
        const toolbar = box.querySelector('.floating-toolbar');
        if (toolbar) toolbar.style.display = 'none';
    });
    
    const selectedBox = document.getElementById(id);
    if (selectedBox) {
        selectedBox.classList.add('selected');
        const toolbar = selectedBox.querySelector('.floating-toolbar');
        if (toolbar) toolbar.style.display = 'flex';
    }
    
    updateEditorPanel();
}

function deleteTextBox(id) {
    const page = getCurrentPage();
    page.textBoxes = page.textBoxes.filter(box => box.id !== id);
    
    if (appState.selectedTextBoxId === id) {
        appState.selectedTextBoxId = null;
    }
    
    saveToHistory();
    renderCurrentPage();
    updateEditorPanel();
}

function duplicateTextBox(id) {
    const page = getCurrentPage();
    const originalBox = page.textBoxes.find(box => box.id === id);
    
    if (originalBox) {
        const newBox = {
            ...originalBox,
            id: generateTextBoxId(),
            xPct: Math.min(originalBox.xPct + 5, 90),
            yPct: Math.min(originalBox.yPct + 5, 90)
        };
        page.textBoxes.push(newBox);
        saveToHistory();
        renderCurrentPage();
        selectTextBox(newBox.id);
    }
}

// ============================================================================
// Drag and Resize Handlers
// ============================================================================

function startDrag(e, textBox) {
    e.preventDefault();
    isDragging = true;
    currentTextBox = textBox;
    
    const rect = textBox.getBoundingClientRect();
    const cardRect = document.getElementById('previewCard').getBoundingClientRect();
    
    dragStartX = (e.clientX || e.touches[0].clientX) - rect.left;
    dragStartY = (e.clientY || e.touches[0].clientY) - rect.top;
    
    document.addEventListener('pointermove', handleDrag);
    document.addEventListener('pointerup', stopDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

function handleDrag(e) {
    if (!isDragging || !currentTextBox) return;
    
    e.preventDefault();
    const card = document.getElementById('previewCard');
    const cardRect = card.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    let newX = clientX - cardRect.left - dragStartX;
    let newY = clientY - cardRect.top - dragStartY;
    
    // Constrain to card bounds
    newX = Math.max(0, Math.min(newX, cardRect.width - currentTextBox.offsetWidth));
    newY = Math.max(0, Math.min(newY, cardRect.height - currentTextBox.offsetHeight));
    
    // Convert to percentages
    const xPct = (newX / cardRect.width) * 100;
    const yPct = (newY / cardRect.height) * 100;
    
    currentTextBox.style.left = `${xPct}%`;
    currentTextBox.style.top = `${yPct}%`;
}

function stopDrag() {
    if (isDragging && currentTextBox) {
        const card = document.getElementById('previewCard');
        const cardRect = card.getBoundingClientRect();
        const boxRect = currentTextBox.getBoundingClientRect();
        
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === currentTextBox.id);
        
        if (box) {
            box.xPct = ((boxRect.left - cardRect.left) / cardRect.width) * 100;
            box.yPct = ((boxRect.top - cardRect.top) / cardRect.height) * 100;
            box.widthPct = (boxRect.width / cardRect.width) * 100;
            box.heightPct = (boxRect.height / cardRect.height) * 100;
            
            saveToHistory();
        }
    }
    
    isDragging = false;
    currentTextBox = null;
    
    document.removeEventListener('pointermove', handleDrag);
    document.removeEventListener('pointerup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
}

function startResize(e, textBox, handle) {
    e.preventDefault();
    e.stopPropagation();
    
    isResizing = true;
    currentTextBox = textBox;
    resizeHandle = handle;
    
    const card = document.getElementById('previewCard');
    const cardRect = card.getBoundingClientRect();
    const boxRect = textBox.getBoundingClientRect();
    
    dragStartX = (e.clientX || e.touches[0].clientX) - boxRect.left;
    dragStartY = (e.clientY || e.touches[0].clientY) - boxRect.top;
    
    const initialLeft = boxRect.left - cardRect.left;
    const initialTop = boxRect.top - cardRect.top;
    const initialWidth = boxRect.width;
    const initialHeight = boxRect.height;
    
    function handleResize(e) {
        if (!isResizing || !currentTextBox) return;
        
        e.preventDefault();
        const cardRect = card.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        let newLeft = initialLeft;
        let newTop = initialTop;
        let newWidth = initialWidth;
        let newHeight = initialHeight;
        
        const deltaX = clientX - (cardRect.left + initialLeft + dragStartX);
        const deltaY = clientY - (cardRect.top + initialTop + dragStartY);
        
        // Handle different resize handles
        if (resizeHandle.classList.contains('e')) {
            newWidth = Math.max(80, initialWidth + deltaX);
        } else if (resizeHandle.classList.contains('w')) {
            newWidth = Math.max(80, initialWidth - deltaX);
            newLeft = Math.max(0, initialLeft + deltaX);
        } else if (resizeHandle.classList.contains('s')) {
            newHeight = Math.max(40, initialHeight + deltaY);
        } else if (resizeHandle.classList.contains('n')) {
            newHeight = Math.max(40, initialHeight - deltaY);
            newTop = Math.max(0, initialTop + deltaY);
        } else if (resizeHandle.classList.contains('se')) {
            newWidth = Math.max(80, initialWidth + deltaX);
            newHeight = Math.max(40, initialHeight + deltaY);
        } else if (resizeHandle.classList.contains('sw')) {
            newWidth = Math.max(80, initialWidth - deltaX);
            newLeft = Math.max(0, initialLeft + deltaX);
            newHeight = Math.max(40, initialHeight + deltaY);
        } else if (resizeHandle.classList.contains('ne')) {
            newWidth = Math.max(80, initialWidth + deltaX);
            newHeight = Math.max(40, initialHeight - deltaY);
            newTop = Math.max(0, initialTop + deltaY);
        } else if (resizeHandle.classList.contains('nw')) {
            newWidth = Math.max(80, initialWidth - deltaX);
            newLeft = Math.max(0, initialLeft + deltaX);
            newHeight = Math.max(40, initialHeight - deltaY);
            newTop = Math.max(0, initialTop + deltaY);
        }
        
        // Constrain to card bounds
        if (newLeft + newWidth > cardRect.width) {
            newWidth = cardRect.width - newLeft;
        }
        if (newTop + newHeight > cardRect.height) {
            newHeight = cardRect.height - newTop;
        }
        
        currentTextBox.style.left = `${(newLeft / cardRect.width) * 100}%`;
        currentTextBox.style.top = `${(newTop / cardRect.height) * 100}%`;
        currentTextBox.style.width = `${(newWidth / cardRect.width) * 100}%`;
        currentTextBox.style.height = `${(newHeight / cardRect.height) * 100}%`;
    }
    
    function stopResize() {
        if (isResizing && currentTextBox) {
            const card = document.getElementById('previewCard');
            const cardRect = card.getBoundingClientRect();
            const boxRect = currentTextBox.getBoundingClientRect();
            
            const page = getCurrentPage();
            const box = page.textBoxes.find(b => b.id === currentTextBox.id);
            
            if (box) {
                box.xPct = ((boxRect.left - cardRect.left) / cardRect.width) * 100;
                box.yPct = ((boxRect.top - cardRect.top) / cardRect.height) * 100;
                box.widthPct = (boxRect.width / cardRect.width) * 100;
                box.heightPct = (boxRect.height / cardRect.height) * 100;
                
                // Auto-fit font size after resize
                const content = currentTextBox.querySelector('.resizable-text');
                if (content) {
                    const fittedFontSize = fitTextToBox(content, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
                    // Store both fontSize and fontSizePx for compatibility
                    box.fontSize = fittedFontSize;
                    box.fontSizePx = fittedFontSize; // Store absolute px for canvas export
                    // Update the text box element's font size
                    currentTextBox.style.fontSize = fittedFontSize + 'px';
                    content.style.fontSize = fittedFontSize + 'px';
                }
                
                saveToHistory();
            }
        }
        
        isResizing = false;
        currentTextBox = null;
        resizeHandle = null;
        
        document.removeEventListener('pointermove', handleResize);
        document.removeEventListener('pointerup', stopResize);
        document.removeEventListener('touchmove', handleResize);
        document.removeEventListener('touchend', stopResize);
    }
    
    document.addEventListener('pointermove', handleResize);
    document.addEventListener('pointerup', stopResize);
    document.addEventListener('touchmove', handleResize, { passive: false });
    document.addEventListener('touchend', stopResize);
}

// ============================================================================
// Auto-fit Font Size to Box (Binary Search)
// ============================================================================

/**
 * Fit text to its container by choosing the largest font-size (px)
 * that keeps both scrollWidth <= clientWidth and scrollHeight <= clientHeight.
 *
 * el: DOM element containing the text. It must be sized already (width/height).
 * opts: { minPx, maxPx, precisionPx }
 *
 * Returns chosen font-size (px).
 */
function fitTextToBox(el, opts = {}) {
    const minPx = opts.minPx ?? 10;
    const maxPx = opts.maxPx ?? 200; // safe upper bound
    const precisionPx = opts.precisionPx ?? 0.5;
    
    // Ensure wrapping rules for measurement
    el.style.whiteSpace = 'pre-wrap';
    el.style.overflowWrap = 'normal';
    el.style.wordBreak = 'normal';
    
    // Force reflow before measurement
    const rect = el.getBoundingClientRect();
    const containerW = el.clientWidth;
    const containerH = el.clientHeight;
    
    if (containerW <= 0 || containerH <= 0) {
        // container not visible or not sized yet
        return parseFloat(window.getComputedStyle(el).fontSize) || minPx;
    }
    
    // Binary search for the largest acceptable font-size
    let low = minPx;
    let high = maxPx;
    let best = minPx;
    
    while ((high - low) > precisionPx) {
        const mid = (low + high) / 2;
        el.style.fontSize = mid + 'px';
        // force layout read
        const fitsWidth = el.scrollWidth <= containerW + 1;  // allow 1px tolerance
        const fitsHeight = el.scrollHeight <= containerH + 1;
        if (fitsWidth && fitsHeight) {
            best = mid;      // mid fits, try larger
            low = mid;
        } else {
            high = mid;      // mid too big, try smaller
        }
    }
    
    // apply the best value (round to 0.5 px)
    const chosen = Math.max(minPx, Math.round(best * 2) / 2);
    el.style.fontSize = chosen + 'px';
    return chosen;
}

// ============================================================================
// Editor Panel Controls
// ============================================================================

function updateEditorPanel() {
    const page = getCurrentPage();
    const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
    const fontSelect = document.getElementById('fontFamily');
    
    if (box) {
        // Show userText if it exists, otherwise keep textarea empty (defaultText will show in preview)
        document.getElementById('textContent').value = box.text || '';
        
        // Ensure font select shows current family
        if (box.fontFamily) {
            // If the option exists, set it; otherwise add it as custom
            const optExists = Array.from(fontSelect.options).some(o => o.value === box.fontFamily);
            if (!optExists) {
                const opt = document.createElement('option');
                opt.value = box.fontFamily;
                opt.textContent = box.fontFamily + ' (custom)';
                fontSelect.appendChild(opt);
            }
            fontSelect.value = box.fontFamily;
        } else {
            fontSelect.value = FONT_OPTIONS[0].name; // fallback default
        }
        
        document.getElementById('fontWeight').value = box.fontWeight || 400;
        document.getElementById('fontSize').value = box.fontSize || 28;
        document.getElementById('fontSizeValue').textContent = box.fontSize || 28;
        document.getElementById('lineHeightInput').value = box.lineHeight || 1.2;
        document.getElementById('lineHeightValue').textContent = box.lineHeight || 1.2;
        document.getElementById('letterSpacingInput').value = box.letterSpacing || 0;
        document.getElementById('letterSpacingValue').textContent = box.letterSpacing || 0;
        document.getElementById('colorInput').value = box.color || '#000000';
        
        // Update alignment buttons
        document.querySelectorAll('.btn-align').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === (box.align || 'center')) {
                btn.classList.add('active');
            }
        });
    } else {
        // Clear editor if no box selected
        document.getElementById('textContent').value = '';
        fontSelect.value = FONT_OPTIONS[0].name;
        document.getElementById('colorInput').value = '#000000';
    }
    
    document.getElementById('backgroundImage').value = page.img || '';
}

function applyEditorChanges() {
    const page = getCurrentPage();
    const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
    if (!box) return;
    
    const textBoxElement = document.getElementById(box.id);
    if (!textBoxElement) return;
    
    // Save user input to box.text (userText equivalent)
    const userInput = document.getElementById('textContent').value;
    box.text = userInput;
    
    box.fontFamily = document.getElementById('fontFamily').value;
    box.fontWeight = parseInt(document.getElementById('fontWeight').value);
    
    // Get font size from slider (but may be overridden by auto-fit)
    const sliderFontSize = parseInt(document.getElementById('fontSize').value);
    box.fontSize = sliderFontSize;
    
    box.lineHeight = parseFloat(document.getElementById('lineHeightInput').value);
    box.letterSpacing = parseFloat(document.getElementById('letterSpacingInput').value);
    box.color = document.getElementById('colorInput').value || '#000000';
    
    // Get active alignment
    const activeAlign = document.querySelector('.btn-align.active');
    box.align = activeAlign ? activeAlign.dataset.align : 'center';
    
    // Update element styles
    textBoxElement.style.fontFamily = box.fontFamily;
    textBoxElement.style.fontSize = `${box.fontSize}px`;
    textBoxElement.style.fontWeight = box.fontWeight;
    textBoxElement.style.textAlign = box.align;
    textBoxElement.style.lineHeight = box.lineHeight;
    textBoxElement.style.letterSpacing = `${box.letterSpacing}px`;
    
    // Update display: use userText if it exists, otherwise show defaultText
    const content = textBoxElement.querySelector('.resizable-text');
    if (content) {
        const textToShow = (userInput && userInput.trim().length) ? userInput : (page.defaultText || '');
        content.textContent = textToShow;
        
        // Apply text alignment and color
        content.style.textAlign = box.align;
        content.style.color = box.color || '#000000';
        
        // Auto-fit font size to box when text changes
        const fittedFontSize = fitTextToBox(content, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
        // Store both fontSize and fontSizePx for compatibility
        box.fontSize = fittedFontSize;
        box.fontSizePx = fittedFontSize; // Store absolute px for canvas export
        textBoxElement.style.fontSize = fittedFontSize + 'px';
        content.style.fontSize = fittedFontSize + 'px';
        
        // Update slider display to reflect auto-fitted size
        document.getElementById('fontSize').value = fittedFontSize;
        document.getElementById('fontSizeValue').textContent = fittedFontSize;
    }
    
    saveToHistory();
}

// ============================================================================
// Event Listeners for Editor Controls
// ============================================================================

function setupEditorControls() {
    // Text content
    document.getElementById('textContent').addEventListener('input', () => {
        applyEditorChanges();
    });
    
    // Font family - update selected text box immediately
    const fontSelect = document.getElementById('fontFamily');
    fontSelect.addEventListener('change', () => {
        const family = fontSelect.value;
        if (!appState.selectedTextBoxId) return;
        
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
        if (!box) return;
        
        // Update state
        box.fontFamily = family;
        
        // Apply to DOM element if rendered
        const textBoxElement = document.getElementById(box.id);
        if (textBoxElement) {
            const inner = textBoxElement.querySelector('.resizable-text');
            if (inner) {
                // Quote family if it contains spaces to be safe
                inner.style.fontFamily = family.indexOf(' ') >= 0 ? `"${family}", serif` : family;
                textBoxElement.style.fontFamily = family.indexOf(' ') >= 0 ? `"${family}", serif` : family;
                
                // Optionally adjust font size to current box via fitTextToBox
                const fittedFontSize = fitTextToBox(inner, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
                box.fontSize = fittedFontSize;
                box.fontSizePx = fittedFontSize;
                textBoxElement.style.fontSize = fittedFontSize + 'px';
                inner.style.fontSize = fittedFontSize + 'px';
                
                // Update slider display
                document.getElementById('fontSize').value = fittedFontSize;
                document.getElementById('fontSizeValue').textContent = fittedFontSize;
            }
        }
        
        saveToHistory(); // for undo-redo
    });
    
    // Font weight - update selected text box immediately
    const fontWeightSelect = document.getElementById('fontWeight');
    fontWeightSelect.addEventListener('change', () => {
        const weight = parseInt(fontWeightSelect.value);
        if (!appState.selectedTextBoxId) return;
        
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
        if (!box) return;
        
        // Update state
        box.fontWeight = weight;
        
        // Apply to DOM element if rendered
        const textBoxElement = document.getElementById(box.id);
        if (textBoxElement) {
            const inner = textBoxElement.querySelector('.resizable-text');
            if (inner) {
                // Apply weight immediately
                inner.style.fontWeight = weight;
                textBoxElement.style.fontWeight = weight;
                
                // Re-run auto-sizing function
                const fittedFontSize = fitTextToBox(inner, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
                box.fontSize = fittedFontSize;
                box.fontSizePx = fittedFontSize;
                textBoxElement.style.fontSize = fittedFontSize + 'px';
                inner.style.fontSize = fittedFontSize + 'px';
                
                // Update slider display
                document.getElementById('fontSize').value = fittedFontSize;
                document.getElementById('fontSizeValue').textContent = fittedFontSize;
            }
        }
        
        saveToHistory(); // for undo-redo
    });
    
    // Font size - manual changes don't auto-fit (user can set custom size)
    const fontSizeSlider = document.getElementById('fontSize');
    fontSizeSlider.addEventListener('input', () => {
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
        if (!box) return;
        
        const textBoxElement = document.getElementById(box.id);
        if (!textBoxElement) return;
        
        const newFontSize = parseInt(fontSizeSlider.value);
        document.getElementById('fontSizeValue').textContent = newFontSize;
        
        // Update box data and element styles without auto-fitting
        box.fontSize = newFontSize;
        textBoxElement.style.fontSize = `${newFontSize}px`;
        const content = textBoxElement.querySelector('.resizable-text');
        if (content) {
            content.style.fontSize = `${newFontSize}px`;
        }
        
        saveToHistory();
    });
    
    // Line height - update selected text box in real time
    const lineHeightInput = document.getElementById('lineHeightInput');
    lineHeightInput.addEventListener('input', () => {
        const lineHeight = parseFloat(lineHeightInput.value);
        document.getElementById('lineHeightValue').textContent = lineHeight.toFixed(2);
        
        if (!appState.selectedTextBoxId) return;
        
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
        if (!box) return;
        
        // Update state
        box.lineHeight = lineHeight;
        
        // Apply to DOM element if rendered
        const textBoxElement = document.getElementById(box.id);
        if (textBoxElement) {
            const inner = textBoxElement.querySelector('.resizable-text');
            if (inner) {
                // Apply line height immediately
                inner.style.lineHeight = lineHeight;
                textBoxElement.style.lineHeight = lineHeight;
                
                // Re-run auto-sizing function
                const fittedFontSize = fitTextToBox(inner, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
                box.fontSize = fittedFontSize;
                box.fontSizePx = fittedFontSize;
                textBoxElement.style.fontSize = fittedFontSize + 'px';
                inner.style.fontSize = fittedFontSize + 'px';
                
                // Update slider display
                document.getElementById('fontSize').value = fittedFontSize;
                document.getElementById('fontSizeValue').textContent = fittedFontSize;
            }
        }
        
        saveToHistory(); // for undo-redo
    });
    
    // Letter spacing - update selected text box in real time
    const letterSpacingInput = document.getElementById('letterSpacingInput');
    letterSpacingInput.addEventListener('input', () => {
        const letterSpacing = parseFloat(letterSpacingInput.value);
        document.getElementById('letterSpacingValue').textContent = letterSpacing.toFixed(1);
        
        if (!appState.selectedTextBoxId) return;
        
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
        if (!box) return;
        
        // Update state
        box.letterSpacing = letterSpacing;
        
        // Apply to DOM element if rendered
        const textBoxElement = document.getElementById(box.id);
        if (textBoxElement) {
            const inner = textBoxElement.querySelector('.resizable-text');
            if (inner) {
                // Apply letter spacing immediately
                inner.style.letterSpacing = letterSpacing + 'px';
                textBoxElement.style.letterSpacing = letterSpacing + 'px';
                
                // Re-run auto-sizing function
                const fittedFontSize = fitTextToBox(inner, { minPx: 12, maxPx: 72, precisionPx: 0.5 });
                box.fontSize = fittedFontSize;
                box.fontSizePx = fittedFontSize;
                textBoxElement.style.fontSize = fittedFontSize + 'px';
                inner.style.fontSize = fittedFontSize + 'px';
                
                // Update slider display
                document.getElementById('fontSize').value = fittedFontSize;
                document.getElementById('fontSizeValue').textContent = fittedFontSize;
            }
        }
        
        saveToHistory(); // for undo-redo
    });
    
    // Text color - update selected text box in real time
    const colorInput = document.getElementById('colorInput');
    colorInput.addEventListener('input', () => {
        if (!appState.selectedTextBoxId) return;
        
        const page = getCurrentPage();
        const box = page.textBoxes.find(b => b.id === appState.selectedTextBoxId);
        if (!box) return;
        
        // Update state
        box.color = colorInput.value || '#000000';
        
        // Apply to DOM element if rendered
        const textBoxElement = document.getElementById(box.id);
        if (textBoxElement) {
            const inner = textBoxElement.querySelector('.resizable-text');
            if (inner) {
                // Apply color immediately (no auto-fit needed for color)
                inner.style.color = box.color;
            }
        }
        
        saveToHistory(); // support undo/redo
    });
    
    // Alignment buttons
    document.querySelectorAll('.btn-align').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-align').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyEditorChanges();
        });
    });
    
    // Page title
    document.getElementById('pageTitle').addEventListener('change', () => {
        const page = getCurrentPage();
        page.title = document.getElementById('pageTitle').value;
        saveToHistory();
        renderThumbnails();
    });
    
    // Background image
    document.getElementById('backgroundImage').addEventListener('change', () => {
        const page = getCurrentPage();
        page.img = document.getElementById('backgroundImage').value;
        saveToHistory();
        renderCurrentPage();
    });
    
    // Click outside to deselect
    document.getElementById('previewContent').addEventListener('click', (e) => {
        if (e.target === e.currentTarget || e.target.classList.contains('preview-content')) {
            appState.selectedTextBoxId = null;
            document.querySelectorAll('.text-box').forEach(box => {
                box.classList.remove('selected');
                const toolbar = box.querySelector('.floating-toolbar');
                if (toolbar) toolbar.style.display = 'none';
            });
            updateEditorPanel();
        }
    });
}

// ============================================================================
// Navigation (Keyboard, Swipe, Mouse Drag)
// ============================================================================

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function setupNavigation() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && appState.currentPageIndex > 0) {
            selectPage(appState.currentPageIndex - 1);
        } else if (e.key === 'ArrowRight' && appState.currentPageIndex < appState.pages.length - 1) {
            selectPage(appState.currentPageIndex + 1);
        }
    });
    
    // Navigation buttons
    document.getElementById('btnPrev').addEventListener('click', () => {
        if (appState.currentPageIndex > 0) {
            selectPage(appState.currentPageIndex - 1);
        }
    });
    
    document.getElementById('btnNext').addEventListener('click', () => {
        if (appState.currentPageIndex < appState.pages.length - 1) {
            selectPage(appState.currentPageIndex + 1);
        }
    });
    
    // Touch swipe detection
    const previewCard = document.getElementById('previewCard');
    
    previewCard.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    previewCard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    // Mouse drag for navigation (optional, only if not dragging text box)
    let mouseDownX = 0;
    let mouseDownY = 0;
    let isMouseDragging = false;
    
    previewCard.addEventListener('mousedown', (e) => {
        if (e.target === previewCard || e.target.classList.contains('preview-background')) {
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            isMouseDragging = true;
        }
    });
    
    previewCard.addEventListener('mousemove', (e) => {
        if (isMouseDragging) {
            const deltaX = e.clientX - mouseDownX;
            const deltaY = e.clientY - mouseDownY;
            // Only consider horizontal drag
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
                if (deltaX > 0 && appState.currentPageIndex > 0) {
                    selectPage(appState.currentPageIndex - 1);
                    isMouseDragging = false;
                } else if (deltaX < 0 && appState.currentPageIndex < appState.pages.length - 1) {
                    selectPage(appState.currentPageIndex + 1);
                    isMouseDragging = false;
                }
            }
        }
    });
    
    previewCard.addEventListener('mouseup', () => {
        isMouseDragging = false;
    });
    
    previewCard.addEventListener('mouseleave', () => {
        isMouseDragging = false;
    });
}

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const threshold = 40;
    
    // Check if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && appState.currentPageIndex > 0) {
            // Swipe right - go to previous page
            selectPage(appState.currentPageIndex - 1);
        } else if (deltaX < 0 && appState.currentPageIndex < appState.pages.length - 1) {
            // Swipe left - go to next page
            selectPage(appState.currentPageIndex + 1);
        }
    }
}

// ============================================================================
// PNG Export (Canvas API)
// ============================================================================

async function exportToPNG() {
    const page = getCurrentPage();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (9:16 aspect ratio)
    const width = 900;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;
    
    try {
        // Ensure fonts are loaded before drawing
        // Collect unique font families used on the page
        const families = new Set();
        (page.textBoxes || []).forEach(tb => {
            if (tb.fontFamily) families.add(tb.fontFamily);
        });
        
        // Request load for each (using a common sample weight)
        const loadPromises = [];
        families.forEach(f => {
            // Try loading regular 400; browsers may ignore unknown families but attempt anyway
            loadPromises.push(document.fonts.load(`16px "${f}"`));
        });
        
        // Also wait for overall font system readiness
        await Promise.all(loadPromises);
        await document.fonts.ready;
        
        // Draw background
        await drawBackground(ctx, page.img, width, height);
        
        // Draw border
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);
        
        // Draw text boxes
        for (const box of page.textBoxes) {
            drawTextBox(ctx, box, width, height, page);
        }
        
        // Draw decorative SVG (approximate)
        drawDecorativeSVG(ctx, width, height);
        
        // Download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${page.title || 'invitation'}.png`;
        link.href = dataURL;
        link.click();
    } catch (error) {
        alert('Error exporting PNG. Make sure background images are from local /images/ folder to avoid cross-origin issues.\n\n' + error.message);
    }
}

function drawBackground(ctx, imgSrc, width, height) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Cover algorithm: scale to cover, center, crop
            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            
            let drawWidth, drawHeight, drawX, drawY;
            
            if (imgAspect > canvasAspect) {
                // Image is wider - fit height
                drawHeight = height;
                drawWidth = height * imgAspect;
                drawX = (width - drawWidth) / 2;
                drawY = 0;
            } else {
                // Image is taller - fit width
                drawWidth = width;
                drawHeight = width / imgAspect;
                drawX = 0;
                drawY = (height - drawHeight) / 2;
            }
            
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            resolve();
        };
        
        img.onerror = () => {
            // Fallback: draw gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#f5f7fa');
            gradient.addColorStop(1, '#c3cfe2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            resolve();
        };
        
        img.src = imgSrc;
    });
}

function drawTextBox(ctx, box, canvasWidth, canvasHeight, page) {
    const x = (box.xPct / 100) * canvasWidth;
    const y = (box.yPct / 100) * canvasHeight;
    const width = (box.widthPct / 100) * canvasWidth;
    const height = (box.heightPct / 100) * canvasHeight;
    
    ctx.save();
    
    // Set font properties
    // Use fontSizePx if available, otherwise fontSize, with fallback
    const fontSize = box.fontSizePx || box.fontSize || 28;
    const fontWeight = box.fontWeight || 400;
    
    // Scale font size for canvas if needed (if preview width differs from canvas)
    // Canvas is 900px wide, preview card is typically ~400px wide
    const previewCard = document.getElementById('previewCard');
    const previewWidth = previewCard ? previewCard.getBoundingClientRect().width : 400;
    const scaleFactor = canvasWidth / previewWidth;
    const canvasFontSize = fontSize * scaleFactor;
    
    // Quote font family if it contains spaces, include fallback
    const fontFamily = box.fontFamily || 'Lora';
    const quotedFamily = fontFamily.indexOf(' ') >= 0 ? `"${fontFamily}", serif` : fontFamily;
    // Combine font weight and size in ctx.font
    ctx.font = `${fontWeight} ${canvasFontSize}px ${quotedFamily}`;
    ctx.fillStyle = box.color || '#000000';
    ctx.textBaseline = 'top';
    
    // Use defaultText as fallback if box text is empty
    const drawText = (box.text && box.text.trim().length) ? box.text : (page.defaultText || '');
    const lineHeight = box.lineHeight || 1.2;
    const letterSpacing = (box.letterSpacing || 0) * scaleFactor;
    
    // Draw text with proper line height and letter spacing
    drawTextWithSpacing(ctx, drawText, x, y, width, height, canvasFontSize, lineHeight, letterSpacing, box.align || 'center');
    
    ctx.restore();
}

/**
 * Draw text with proper line height and letter spacing handling
 * Supports word wrapping, line breaks, and alignment
 */
function drawTextWithSpacing(ctx, text, x, y, maxWidth, maxHeight, fontSize, lineHeight, letterSpacing, align) {
    // Split by newlines first, then word-wrap each line
    const paragraphs = text.split('\n');
    let currentY = y;
    const actualLineHeight = fontSize * lineHeight;
    
    for (const paragraph of paragraphs) {
        // Word wrap this paragraph
        const words = paragraph.split(' ');
        let currentLine = '';
        
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            
            // Measure text width with letter spacing
            const metrics = ctx.measureText(testLine);
            const textWidth = metrics.width + (testLine.length > 0 ? (testLine.length - 1) * letterSpacing : 0);
            
            if (textWidth > maxWidth && currentLine) {
                // Draw current line and move to next
                drawTextLine(ctx, currentLine, x, currentY, maxWidth, align, letterSpacing);
                currentLine = words[i];
                currentY += actualLineHeight;
                
                // Check if we've exceeded max height
                if (currentY + actualLineHeight > y + maxHeight) {
                    return; // Stop drawing if out of bounds
                }
            } else {
                currentLine = testLine;
            }
        }
        
        // Draw last line of paragraph
        if (currentLine) {
            drawTextLine(ctx, currentLine, x, currentY, maxWidth, align, letterSpacing);
            currentY += actualLineHeight;
            
            // Check if we've exceeded max height
            if (currentY + actualLineHeight > y + maxHeight) {
                return; // Stop drawing if out of bounds
            }
        }
    }
}

function drawTextLine(ctx, text, x, y, maxWidth, align, letterSpacing) {
    if (letterSpacing === 0) {
        // Simple case: no letter spacing
        if (align === 'center') {
            const metrics = ctx.measureText(text);
            ctx.fillText(text, x + (maxWidth - metrics.width) / 2, y);
        } else if (align === 'right') {
            const metrics = ctx.measureText(text);
            ctx.fillText(text, x + maxWidth - metrics.width, y);
        } else {
            ctx.fillText(text, x, y);
        }
    } else {
        // Draw characters with spacing
        let currentX = x;
        
        // Calculate total text width with letter spacing
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width + (text.length > 0 ? (text.length - 1) * letterSpacing : 0);
        
        // Calculate starting X based on alignment
        if (align === 'center') {
            currentX = x + (maxWidth - textWidth) / 2;
        } else if (align === 'right') {
            currentX = x + maxWidth - textWidth;
        }
        
        // Draw each character with spacing
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], currentX, y);
            const charWidth = ctx.measureText(text[i]).width;
            currentX += charWidth + letterSpacing;
        }
    }
}

function drawDecorativeSVG(ctx, width, height) {
    const y = height - 60;
    const centerX = width / 2;
    
    ctx.save();
    ctx.strokeStyle = '#d4a574';
    ctx.fillStyle = '#d4a574';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.6;
    
    // Draw curved line
    ctx.beginPath();
    ctx.moveTo(centerX - 100, y);
    ctx.quadraticCurveTo(centerX - 50, y - 15, centerX, y);
    ctx.quadraticCurveTo(centerX + 50, y + 15, centerX + 100, y);
    ctx.stroke();
    
    // Draw circles
    const circleRadius = 4;
    ctx.beginPath();
    ctx.arc(centerX - 50, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + 50, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// ============================================================================
// JSON Save/Load
// ============================================================================

function saveToJSON() {
    const json = JSON.stringify(appState.pages, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'pages.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}

function loadFromJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedPages = JSON.parse(e.target.result);
            appState.pages = loadedPages;
            appState.currentPageIndex = 0;
            appState.selectedTextBoxId = null;
            appState.history = [];
            appState.historyIndex = -1;
            saveToHistory();
            renderThumbnails();
            renderCurrentPage();
            updateEditorPanel();
            updateNavigationButtons();
        } catch (error) {
            alert('Error loading JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ============================================================================
// Topbar Button Handlers
// ============================================================================

function setupTopbarButtons() {
    document.getElementById('btnBack').addEventListener('click', () => {
        if (confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
            // In a real app, this would navigate away
            alert('Back functionality - would navigate to previous page');
        }
    });
    
    document.getElementById('btnUndo').addEventListener('click', undo);
    document.getElementById('btnRedo').addEventListener('click', redo);
    document.getElementById('btnSave').addEventListener('click', saveToJSON);
    document.getElementById('btnDownload').addEventListener('click', exportToPNG);
    
    // Wire the Add Text button
    const addTextBtn = document.getElementById('addTextBtn');
    if (addTextBtn) {
        addTextBtn.addEventListener('click', addNewTextBox);
    }
}

// ============================================================================
// Initialize Application
// ============================================================================

function init() {
    // Populate font options first
    populateFontOptions();
    
    initializePages();
    renderThumbnails();
    renderCurrentPage();
    updateEditorPanel();
    updateNavigationButtons();
    setupEditorControls();
    setupNavigation();
    setupTopbarButtons();
    
    // Add ability to create new text box by double-clicking on preview
    const previewContent = document.getElementById('previewContent');
    previewContent.addEventListener('dblclick', (e) => {
        // Only create if clicking on previewContent itself or background, not on a text box
        if (e.target === previewContent || (!e.target.closest('.text-box') && !e.target.classList.contains('resize-handle'))) {
            const card = document.getElementById('previewCard');
            const cardRect = card.getBoundingClientRect();
            const contentRect = previewContent.getBoundingClientRect();
            
            const x = e.clientX - contentRect.left;
            const y = e.clientY - contentRect.top;
            
            const xPct = (x / cardRect.width) * 100;
            const yPct = (y / cardRect.height) * 100;
            
            const page = getCurrentPage();
            const newBox = {
                id: generateTextBoxId(),
                text: '', // Empty - will show defaultText in preview
                xPct: Math.max(5, Math.min(xPct, 85)),
                yPct: Math.max(5, Math.min(yPct, 85)),
                widthPct: 60,
                heightPct: 15,
                fontFamily: 'Lora',
                fontSize: 28,
                fontWeight: 400,
                align: 'center',
                lineHeight: 1.2,
                letterSpacing: 0,
                color: '#333'
            };
            
            page.textBoxes.push(newBox);
            saveToHistory();
            renderCurrentPage();
            selectTextBox(newBox.id);
            document.getElementById('textContent').focus();
        }
    });
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


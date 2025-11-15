================================================================================
WEDDING INVITATION EDITOR - README
================================================================================

PROJECT OVERVIEW
----------------
This is a complete Wedding Invitation Editor Web Application built with plain
HTML, CSS, and vanilla JavaScript. No frameworks or external libraries are used
(except Google Fonts for typography).

FEATURES
--------
✓ 3-column responsive layout (thumbnails, preview, editor panel)
✓ Draggable and resizable text boxes with visual handles
✓ Floating delete/duplicate controls for text boxes
✓ Font picker with curated wedding fonts (Lora, Cinzel, Spectral SC, etc.)
✓ Font weight, size, alignment, line-height, and letter-spacing controls
✓ Undo/Redo system (30+ state history)
✓ Keyboard navigation (Arrow keys)
✓ Touch swipe gestures for page navigation
✓ PNG export using Canvas API (900x1600 resolution)
✓ JSON save/load functionality
✓ Multiple text boxes per page
✓ Page title editing
✓ Background image management

HOW TO RUN
----------
1. Simply open index.html in a modern web browser (Chrome, Firefox, Edge, Safari)
2. No server or build process required - it's a pure client-side application
3. The app will initialize with 3 sample pages using the provided SVG images

REPLACING IMAGES
----------------
To use your own images:
1. Place your images in the /images/ folder
2. Images should be in 9:16 portrait aspect ratio for best results
3. Supported formats: SVG, PNG, JPG, WebP
4. In the editor panel, change the "Background Image" field to:
   - Local files: images/your-image.svg (or .png, .jpg)
   - External URLs: https://example.com/image.jpg
   
   NOTE: For PNG export to work reliably, use local /images/ files.
   External URLs may fail due to cross-origin restrictions.

USAGE INSTRUCTIONS
------------------
1. SELECT A PAGE: Click on a thumbnail in the left panel to select a page

2. CREATE TEXT BOX: Double-click anywhere on the preview card to create a new
   text box at that location

3. EDIT TEXT: 
   - Click on a text box to select it
   - Edit the text in the "Text Content" textarea in the right panel
   - Changes apply in real-time

4. MOVE TEXT BOX: Click and drag the text box to reposition it

5. RESIZE TEXT BOX: Click and drag any of the 8 resize handles (corners and
   sides) to resize the text box

6. STYLE TEXT BOX:
   - Font Family: Choose from the dropdown
   - Font Weight: Regular or Bold
   - Font Size: Use the slider (12-72px)
   - Alignment: Left, Center, or Right
   - Line Height: Adjust spacing between lines
   - Letter Spacing: Adjust spacing between characters

7. DELETE TEXT BOX: Select a text box and click the delete icon in the floating
   toolbar (appears above selected text box)

8. DUPLICATE TEXT BOX: Select a text box and click the duplicate icon in the
   floating toolbar

9. NAVIGATE PAGES:
   - Click left/right arrow buttons overlaying the preview
   - Use keyboard Arrow Left/Right keys
   - Swipe left/right on touch devices
   - Click thumbnails in the left panel

10. UNDO/REDO: Use the undo/redo buttons in the topbar (or Ctrl+Z/Ctrl+Y)

11. SAVE JSON: Click the Save button to download pages.json containing all
    page data and text box configurations

12. EXPORT PNG: Click the Download button to export the current page as a PNG
    image (900x1600 resolution)

FILE STRUCTURE
--------------
celebrate2/
├── index.html          (Main HTML file)
├── styles.css          (All styling)
├── script.js           (All application logic)
├── README.txt          (This file)
└── images/
    ├── portrait1.svg   (Sample image 1)
    ├── portrait2.svg   (Sample image 2)
    └── portrait3.svg   (Sample image 3)

PREPARING FOR SUBMISSION
------------------------
1. Ensure all files are in the project folder:
   - index.html
   - styles.css
   - script.js
   - README.txt
   - images/ folder with at least 3 images

2. Test the application:
   - Open index.html in a browser
   - Create and edit text boxes
   - Test undo/redo
   - Test PNG export
   - Test JSON save

3. Create a ZIP file containing:
   - index.html
   - styles.css
   - script.js
   - README.txt
   - images/ folder (with all image files)

4. Name the ZIP file appropriately (e.g., wedding-invitation-editor.zip)

TECHNICAL NOTES
---------------
- All code is original and written from scratch
- No external JavaScript libraries (except Google Fonts via <link>)
- Uses native Canvas API for PNG export (no html2canvas)
- Uses pointer events for combined mouse/touch support
- Responsive design with mobile-friendly breakpoints
- Undo/redo maintains 30 state history
- Text boxes stored as percentages for easy scaling
- PNG export resolution: 900x1600 (9:16 aspect ratio)

BROWSER COMPATIBILITY
---------------------
- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers (iOS Safari, Chrome Mobile)

KNOWN LIMITATIONS
-----------------
- PNG export may fail with cross-origin images (use local /images/ files)
- Letter spacing in canvas export is approximated (character-by-character)
- Complex text wrapping in canvas may not match exact browser rendering
- Touch gestures work best on actual touch devices

TROUBLESHOOTING
---------------
Problem: Images don't load
Solution: Check that image paths are correct and files exist in /images/ folder

Problem: PNG export fails
Solution: Use local images from /images/ folder instead of external URLs

Problem: Text box not responding to drag/resize
Solution: Make sure you're clicking on the text box itself, not the content area

Problem: Undo/Redo not working
Solution: Check browser console for errors. Ensure you've made at least one change.

SUPPORT
-------
For issues or questions, refer to the code comments in script.js which explain
the major functionality blocks:
- History Management (Undo/Redo)
- Page Management
- Text Box Management
- Drag and Resize Handlers
- Editor Panel Controls
- Navigation (Keyboard, Swipe, Mouse Drag)
- PNG Export (Canvas API)
- JSON Save/Load

================================================================================
END OF README
================================================================================


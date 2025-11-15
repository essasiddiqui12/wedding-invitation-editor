# Wedding Invitation Editor

A beautiful, feature-rich web application for creating and customizing wedding invitations.

## Features

- 🎨 **3-Column Layout**: Thumbnails, preview, and editor panel
- ✏️ **Draggable & Resizable Text Boxes**: Full control over text positioning and sizing
- 🎨 **Rich Text Styling**: Font family, weight, size, color, alignment, line height, and letter spacing
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 💾 **Save & Load**: Export/import your designs as JSON
- 📥 **PNG Export**: Download high-quality images (900x1600px)
- ↩️ **Undo/Redo**: Full history support (30+ states)
- 🖼️ **Multiple Pages**: Create multi-page invitations
- 🎯 **Real-time Preview**: See changes instantly

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wedding-invitation-editor.git
cd wedding-invitation-editor
```

2. Open `index.html` in your web browser, or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` in your browser

## Usage

1. **Add Text**: Click the "+ Add Text" button or double-click on the preview card
2. **Edit Text**: Select a text box and use the editor panel on the right
3. **Move Text**: Click and drag a text box to reposition it
4. **Resize Text**: Use the corner/side handles to resize text boxes
5. **Style Text**: Use the editor panel to change font, color, alignment, etc.
6. **Save**: Click the save button to download your design as JSON
7. **Export**: Click the download button to export as PNG

## Project Structure

```
wedding-invitation-editor/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Application logic
├── images/             # Background images
│   ├── portrait1.svg
│   ├── portrait2.svg
│   └── portrait3.svg
└── README.md           # This file
```

## Technologies

- **HTML5**: Structure
- **CSS3**: Styling with modern features
- **Vanilla JavaScript**: No frameworks or libraries (except Google Fonts)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

This project can be deployed to:
- **Vercel**: Automatic deployment from GitHub
- **Netlify**: Drag and drop or Git integration
- **GitHub Pages**: Free static hosting
- Any static hosting service

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


# Diagrams Directory

This directory contains SVG diagrams used in the demo-animations page.

## Required Files

- `architecture.svg` - System architecture diagram
- `workflow.svg` - Workflow diagram
- `security.svg` - Security model diagram

## Creating Diagrams

You can create these diagrams using:

1. **Figma** - Export as SVG
2. **Draw.io** - Free diagramming tool
3. **Adobe Illustrator** - Professional vector graphics
4. **Inkscape** - Free SVG editor

## Placeholder Behavior

If diagrams are missing, the `DiagramReveal` component will automatically show a placeholder instead of a broken image.

## Example SVG Structure

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <!-- Your diagram content here -->
</svg>
```

## File Size Guidelines

- Keep SVG files under 100KB
- Optimize with SVGO: `npx svgo diagrams/*.svg`
- Use simple shapes and paths when possible


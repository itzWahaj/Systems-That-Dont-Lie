# Assets Directory

This directory contains Lottie animations and their static fallback images.

## File Naming Convention

For each Lottie animation, you need **two files**:

1. **JSON file**: `<name>.json` - The Lottie animation
2. **PNG file**: `<name>.png` - Static fallback for reduced motion

### Example

```
hero-character.json     # Lottie animation
hero-character.png      # Fallback image
```

## How to Add Lottie Animations

### Option 1: Download from LottieFiles

1. Visit https://lottiefiles.com/
2. Search for an animation (e.g., "developer", "coding", "blockchain")
3. Click "Download" → "Lottie JSON"
4. Save as `<name>.json` in this directory
5. Take a screenshot of the first frame and save as `<name>.png`

### Option 2: Create Your Own

1. Design animation in Adobe After Effects
2. Install Bodymovin plugin
3. Export as Lottie JSON
4. Save in this directory
5. Export first frame as PNG

## File Size Guidelines

- **JSON files**: Keep under 200KB for best performance
- **PNG files**: Keep under 100KB (use compression)

### Optimize JSON

```bash
# Install json-minify
npm install -g json-minify

# Compress
json-minify hero-character.json > hero-character.min.json
mv hero-character.min.json hero-character.json
```

### Optimize PNG

Use tools like:
- TinyPNG: https://tinypng.com/
- ImageOptim (Mac)
- Squoosh: https://squoosh.app/

## Recommended Animations

### For Hero Section
- Character illustrations
- Abstract shapes
- Floating elements
- Tech-themed animations

### For UI Elements
- Loading spinners
- Success checkmarks
- Error indicators
- Progress indicators

### For Decorative
- Particles
- Waves
- Gradients
- Background elements

## Example File Structure

```
assets/
  # Hero animations
  hero-character.json (150KB)
  hero-character.png (50KB)
  
  # Loading states
  loading-spinner.json (25KB)
  loading-spinner.png (10KB)
  
  # Success/Error
  success-checkmark.json (30KB)
  success-checkmark.png (15KB)
  error-cross.json (28KB)
  error-cross.png (14KB)
  
  # Decorative
  floating-particles.json (180KB)
  floating-particles.png (40KB)
  background-waves.json (120KB)
  background-waves.png (35KB)
```

## Usage in Code

```tsx
import LottiePlayer from '@/components/LottiePlayer';

<LottiePlayer
  src="hero-character"  // Filename without extension
  loop={true}
  autoplay={true}
  className="w-96 h-96"
/>
```

The component will:
1. Fetch `/assets/hero-character.json`
2. If reduced motion: show `/assets/hero-character.png`
3. If error: fallback to `/assets/hero-character.png`

## Free Resources

1. **LottieFiles**: https://lottiefiles.com/
   - Largest collection
   - Free and premium
   - Preview before download

2. **Lordicon**: https://lordicon.com/
   - Animated icons
   - Free tier available

3. **IconScout**: https://iconscout.com/lottie-animations
   - Curated collection
   - Free and premium

## Testing

After adding files, test:

1. **Normal mode**: Animation should play
2. **Reduced motion**: PNG should show
3. **File size**: Check JSON < 200KB
4. **Fallback**: Verify PNG exists and looks good

## Notes

- Always provide both JSON and PNG
- Test with reduced motion enabled
- Keep file sizes small
- Use descriptive filenames
- Compress before committing

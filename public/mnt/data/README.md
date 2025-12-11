# PDF Files Directory

This directory contains downloadable PDF files for the portfolio.

## Required Files

Place the following files in this directory:

1. **`CV.pdf`** - Your curriculum vitae
2. **`BlockchainBased Voting System (BIVS) FYP.pdf`** - Final Year Project documentation

## File Specifications

### CV.pdf
- **Format**: PDF
- **Size**: Recommended < 5 MB
- **Content**: Your professional resume/CV
- **Optimization**: Use PDF compression if needed

### BlockchainBased Voting System (BIVS) FYP.pdf
- **Format**: PDF
- **Size**: Recommended < 10 MB
- **Content**: Complete FYP documentation
- **Optimization**: Use PDF compression if needed

## Usage in Code

These files are linked in multiple components:

### GSAPHero Component
```tsx
<a href="/mnt/data/BlockchainBased Voting System (BIVS) FYP.pdf" download>
    Download FYP
</a>
<a href="/mnt/data/CV.pdf" download>
    Download CV
</a>
```

### Demo Page
```tsx
<a href="/mnt/data/BlockchainBased Voting System (BIVS) FYP.pdf" download>
    Download FYP
</a>
<a href="/mnt/data/CV.pdf" download>
    Download CV
</a>
```

## Testing

After adding files, test the download links:

1. Visit `http://localhost:3000/demo-animations`
2. Scroll to the bottom section
3. Click "Download FYP" button
4. Click "Download CV" button
5. Verify files download correctly

## Optimization Tips

### Compress PDFs

**Online Tools**:
- https://www.ilovepdf.com/compress_pdf
- https://smallpdf.com/compress-pdf
- https://www.adobe.com/acrobat/online/compress-pdf.html

**Command Line** (if you have Ghostscript):
```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=output.pdf input.pdf
```

### File Size Targets

- **CV**: < 5 MB (ideally < 2 MB)
- **FYP**: < 10 MB (ideally < 5 MB)

## Security Notes

- PDFs are publicly accessible
- Don't include sensitive information
- Consider adding watermarks if needed
- Ensure you have rights to distribute

## Current Status

- [ ] CV.pdf added
- [ ] BlockchainBased Voting System (BIVS) FYP.pdf added
- [ ] Files tested in browser
- [ ] Download links working

---

**Action Required**: Copy your PDF files to this directory.

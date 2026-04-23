/* ============================================================
   pdfGenerator.js — Export preview element as PDF
   Depends on: html2pdf.js (loaded via CDN / local lib)
   ============================================================ */

const PdfGenerator = (() => {
  function _run(containerEl, filename) {
    filename = filename || 'biodata.pdf';

    const options = {
      margin:     [8, 8, 8, 8],
      filename:   filename,
      image:      { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale:    2,
        useCORS:  true,
        logging:  false,
        letterRendering: true
      },
      jsPDF: {
        unit:        'mm',
        format:      'a4',
        orientation: 'portrait'
      }
    };

    return html2pdf().set(options).from(containerEl).save();
  }

  function generate(containerEl, filename) {
    if (typeof html2pdf !== 'undefined') {
      return _run(containerEl, filename);
    }

    // Retry once after 2 s for slow connections
    return new Promise(resolve => {
      setTimeout(() => {
        if (typeof html2pdf !== 'undefined') {
          resolve(_run(containerEl, filename));
        } else {
          alert('PDF library failed to load. Check your internet connection and reload the page.');
          resolve();
        }
      }, 2000);
    });
  }

  return { generate };
})();

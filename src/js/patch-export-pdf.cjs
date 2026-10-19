const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /<div style="background: white; color: black; padding: 40px;/g;

if (!content.match(regex)) {
    console.log("Could not find the wrapper div.");
    process.exit(1);
}

content = content.replace(regex, '<div class="pdf-content-wrapper" style="background: white; color: black; padding: 40px;');

const downloadRegex = /if \(name === 'ref-export-download'\) \{[\s\S]*?return true;\n\}/;
const newDownloadLogic = `if (name === 'ref-export-download') {
    c.toast('Generating PDF document, please wait...');
    const filename = 'DTR_Log_Summary_' + u().name.replace(/\\s+/g, '_') + '.pdf';
    
    const runPdf = () => {
        const element = document.querySelector('.pdf-content-wrapper');
        // temporarily remove max-height and overflow so html2pdf captures everything
        const oldMaxHeight = element.style.maxHeight;
        const oldOverflow = element.style.overflowY;
        element.style.maxHeight = 'none';
        element.style.overflowY = 'visible';
        
        html2pdf().set({
            margin: [15, 10, 15, 10], // top, left, bottom, right
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save().then(() => {
            element.style.maxHeight = oldMaxHeight;
            element.style.overflowY = oldOverflow;
            c.toast('PDF downloaded successfully!');
        });
    };

    if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
        script.onload = runPdf;
        document.head.appendChild(script);
    } else {
        runPdf();
    }
    return true;
}`;

content = content.replace(downloadRegex, newDownloadLogic);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully injected html2pdf generator!');

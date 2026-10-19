const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. Add the Delete button to the document list renderer
content = content.replace(
    /\$\{b\('Download','file-download',d\.id,'secondary small','download'\)\}<\/article>/g,
    "${b('Download','file-download',d.id,'secondary small','download')}${b('Delete','ref-file-delete',d.id,'secondary small','x')}</article>"
);

// 2. Add the ref-file-delete handler
// We can append it at the end of attendanceAction since it's a global action receiver, or just add it globally.
// Actually, let's inject it into `attendanceAction` where we added other things, or anywhere we find a safe anchor.
const handler = `
    if(name==='ref-file-delete'){
        const doc = db().documents?.find(d=>d.id===id);
        if(!doc) throw new Error('Document not found');
        if(doc.status && doc.status !== 'Pending') {
            c.toast('Cannot delete an approved document.');
            return true;
        }
        if(confirm('Are you sure you want to delete this document?')) {
            db().documents = db().documents.filter(d=>d.id!==id);
            c.toast('Document deleted.');
            c.render();
        }
        return true;
    }
`;

// Let's put it right after ref-file-preview or ref-dtr-export
if (content.includes("if(name==='ref-dtr-export')")) {
    content = content.replace("if(name==='ref-dtr-export'){", handler + "if(name==='ref-dtr-export'){");
} else {
    console.log("Could not find anchor to inject delete handler.");
    process.exit(1);
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected document delete button and handler!');

const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = `document.addEventListener('dragover',event=>{if(event.target.closest('[data-action="document-upload"]'))event.preventDefault();});\ndocument.addEventListener('drop',event=>{if(!event.target.closest('[data-action="document-upload"]'))return;event.preventDefault();try{if(currentUser()?.role!=='Student')throw new Error('Student portal required.');const files=event.dataTransfer.files;if(files.length!==1)throw new Error('Upload one document at a time.');validateUpload(files[0]);documentUpload();modal.querySelector('input[type="file"]').files=files;}catch(error){toast(error.message);}});`;

const replaceStr = `document.addEventListener('dragover',event=>{if(event.target.closest('.upload-drop'))event.preventDefault();});\ndocument.addEventListener('drop',event=>{const dropzone=event.target.closest('.upload-drop');if(!dropzone)return;event.preventDefault();try{const files=event.dataTransfer.files;if(files.length!==1)throw new Error('Upload one document at a time.');if(dropzone.dataset.action==='document-upload'){if(currentUser()?.role!=='Student')throw new Error('Student portal required.');validateUpload(files[0]);documentUpload();modal.querySelector('input[type="file"]').files=files;}else if(dropzone.dataset.action==='import-users'){if(currentUser()?.role!=='Coordinator')throw new Error('Coordinator portal required.');if(files[0].size>1024*1024)throw new Error('Choose a CSV file smaller than 1 MB.');importUsers();modal.querySelector('input[type="file"]').files=files;}}catch(error){toast(error.message);}});`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully updated drag and drop handlers!');
} else {
    console.error("Could not find the target string exactly. Using regex fallback...");
    // Let's use a split approach or more flexible regex if it fails.
    const dragoverRegex = /document\.addEventListener\('dragover'[^;]+;\}\);/;
    const dropRegex = /document\.addEventListener\('drop'[^;]+toast\(error\.message\);\S+\}\);/;
    
    if(content.match(dragoverRegex) && content.match(dropRegex)) {
        content = content.replace(dragoverRegex, `document.addEventListener('dragover',event=>{if(event.target.closest('.upload-drop'))event.preventDefault();});`);
        content = content.replace(dropRegex, `document.addEventListener('drop',event=>{const dropzone=event.target.closest('.upload-drop');if(!dropzone)return;event.preventDefault();try{const files=event.dataTransfer.files;if(files.length!==1)throw new Error('Upload one document at a time.');if(dropzone.dataset.action==='document-upload'){if(currentUser()?.role!=='Student')throw new Error('Student portal required.');validateUpload(files[0]);documentUpload();modal.querySelector('input[type="file"]').files=files;}else if(dropzone.dataset.action==='import-users'){if(currentUser()?.role!=='Coordinator')throw new Error('Coordinator portal required.');if(files[0].size>1024*1024)throw new Error('Choose a CSV file smaller than 1 MB.');importUsers();modal.querySelector('input[type="file"]').files=files;}}catch(error){toast(error.message);}});`);
        fs.writeFileSync(jsPath, content, 'utf8');
        console.log('Successfully updated drag and drop handlers via regex fallback!');
    } else {
        console.error("Regex fallback failed as well. Handlers might have been already updated or drastically changed.");
    }
}

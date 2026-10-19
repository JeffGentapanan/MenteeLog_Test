const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. Replace the buttons part of the template string
const oldButtons = "dl>${b('Edit Accreditation','ref-hte-edit',id,'secondary full')}${nav('Renew MOA','hte','renew',id,'full')}`}`";
const newButtons = "dl><div class=\"ref-button-stack\" style=\"display: flex; flex-direction: column; gap: 8px; margin-top: 16px;\">${b('Edit Accreditation','ref-hte-edit',id,'secondary full')}${nav('Renew MOA','hte','renew',id,'full')}${nav('Manage Job Listings','jobs','','','secondary full')}</div>`}`";

if (content.includes(oldButtons)) {
    content = content.replace(oldButtons, newButtons);
} else {
    console.error("Could not find the button template to replace.");
}

// 2. Remove the ugly insertAdjacentHTML block
const oldInsertLogic = "if(!documents) { const bc = document.querySelector('#modal .modal-body div[style*=\"flex-direction: column\"]'); if (bc) { bc.insertAdjacentHTML('beforeend', nav('Manage Job Listings','jobs','','','secondary full')); } else { document.querySelector('#modal .modal-body').insertAdjacentHTML('beforeend', nav('Manage Job Listings','jobs','','','secondary full')); } }";

if (content.includes(oldInsertLogic)) {
    content = content.replace(oldInsertLogic, "");
} else {
    console.error("Could not find the insertAdjacentHTML block to replace.");
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully adjusted HTE modal button layout!');

const fs = require('fs');
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the old .ojt-filter styles
const oldFilterStylesRegex = /\.ojt-filter \{.*?\}\s*\.ojt-filter\.active \{.*?\}/s;

const newFilterStyles = `.ojt-filter { 
  border-radius: 20px !important; 
  font-size: 13px !important; 
  font-weight: 600 !important; 
  padding: 6px 16px !important; 
  border: 1px solid #94A3B8 !important; 
  color: #334155 !important; 
  background: white !important; 
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}
.ojt-filter:hover { 
  background: #F1F5F9 !important; 
  border-color: var(--burgundy) !important; 
  color: var(--burgundy) !important; 
}
.ojt-filter:active {
  transform: scale(0.96) !important;
}
.ojt-filter.active { 
  background: var(--burgundy) !important; 
  color: #fff !important; 
  border-color: var(--burgundy) !important; 
  box-shadow: 0 4px 12px rgba(88, 17, 26, 0.25) !important; 
}`;

if (css.match(oldFilterStylesRegex)) {
    css = css.replace(oldFilterStylesRegex, newFilterStyles);
} else {
    // If it doesn't match the regex, let's just append it to the end overriding it
    css += '\n' + newFilterStyles;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated .ojt-filter styles!');

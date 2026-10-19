const fs = require('fs');
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const regex = /\.ojt-filter \{.*?\}\s*\.ojt-filter:hover \{.*?\}\s*\.ojt-filter:active \{.*?\}\s*\.ojt-filter\.active \{.*?\}/s;

const newFilterStyles = `.ojt-filter { 
  border-radius: 20px !important; 
  font-size: 13px !important; 
  font-weight: 600 !important; 
  padding: 6px 16px !important; 
  border: 1px solid #CBD5E1 !important; 
  color: #475569 !important; 
  background: white !important; 
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}
.ojt-filter:hover { 
  background: #F8FAFC !important; 
  border-color: #94A3B8 !important; 
  color: #0F172A !important; 
}
.ojt-filter:active {
  transform: scale(0.96) !important;
}
.ojt-filter.active { 
  background: #F1F5F9 !important; 
  color: #0F172A !important; 
  border-color: #0F172A !important; 
  box-shadow: none !important; 
}`;

if (css.match(regex)) {
    css = css.replace(regex, newFilterStyles);
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Successfully updated .ojt-filter to a light theme!');
} else {
    console.log("Could not find the previous filter CSS block to replace.");
    process.exit(1);
}

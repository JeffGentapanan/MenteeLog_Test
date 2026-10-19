const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/portal-layout.css';
let content = fs.readFileSync(path, 'utf8');

const singleCSS = `
.overview-single {
  display: block;
  width: 100%;
  margin-bottom: 24px;
}
.overview-single > .card {
  width: 100%;
  padding: 32px;
}
.overview-single .progress-number {
  font-size: 56px;
}
.overview-single .placement-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 768px) {
  .overview-single .placement-facts {
    grid-template-columns: 1fr;
  }
}
`;

if (!content.includes('.overview-single')) {
  fs.writeFileSync(path, content + '\n' + singleCSS, 'utf8');
  console.log('Added overview-single CSS');
}

const fs = require('fs');
const filepath = 'C:/Users/User/.gemini/antigravity/brain/bdc9d3c0-d8d7-4bcf-b01e-06c72b17d26e/MenteeLog-Flowchart.md';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Add SlotManagement3 to SupervisorPortal
content = content.replace(
    'AppraisalSubmission3["3.5 Performance Appraisal Module<br/><i>(Rubric Evaluation)</i>"]\nend',
    'AppraisalSubmission3["3.5 Performance Appraisal Module<br/><i>(Rubric Evaluation)</i>"]\n    SlotManagement3["3.6 Slot Management<br/><i>(Job Postings & Details)</i>"]\nend'
);

// 2. Add SlotManagement3 routing connection
content = content.replace(
    'Dashboard3 --> AppraisalSubmission3',
    'Dashboard3 --> AppraisalSubmission3\nDashboard3 --> SlotManagement3'
);

// 3. Update Class Definition
content = content.replace(
    'class Dashboard3,CandidateReview3,ApplicationReview3,StudentProgress3,AppraisalSubmission3 supervisorPortal',
    'class Dashboard3,CandidateReview3,ApplicationReview3,StudentProgress3,AppraisalSubmission3,SlotManagement3 supervisorPortal'
);

fs.writeFileSync(filepath, content, 'utf8');
console.log('Successfully updated MenteeLog-Flowchart.md with Supervisor Slot Management');

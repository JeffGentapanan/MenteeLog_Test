const fs = require('fs');
const filepath = 'C:/Users/User/.gemini/antigravity/brain/bdc9d3c0-d8d7-4bcf-b01e-06c72b17d26e/MenteeLog-Flowchart.md';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Add Documents2 to StudentPortal
content = content.replace(
    'AppraisalResult2["2.6 Performance Appraisal Result<br/><i>(Scores + Comments)</i>"]',
    'AppraisalResult2["2.6 Performance Appraisal Result<br/><i>(Scores + Comments)</i>"]\n    Documents2["2.7 Documents & Requirements<br/><i>(Uploads & Clearances)</i>"]'
);

// 2. Add Documents2 routing connection
content = content.replace(
    'Dashboard2 --> AppraisalResult2',
    'Dashboard2 --> AppraisalResult2\nDashboard2 --> Documents2'
);

// 3. Update Supervisor Node
content = content.replace(
    'CandidateReview3["3.1 Candidate Review"]',
    'CandidateReview3["3.1 Candidate Review<br/><i>(Profiles & Documents)</i>"]'
);

// 4. Update Coordinator Node
content = content.replace(
    'CandidateTracking4["4.2 Candidate Tracking"]',
    'CandidateTracking4["4.2 Candidate Tracking<br/><i>(Profiles, Clearances & Documents)</i>"]'
);

// 5. Update Class Definition
content = content.replace(
    'class Dashboard2,ProfileSetup2,JobBrowse2,ApplicationStatus2,Submissions2,AppraisalResult2 studentPortal',
    'class Dashboard2,ProfileSetup2,JobBrowse2,ApplicationStatus2,Submissions2,AppraisalResult2,Documents2 studentPortal'
);

fs.writeFileSync(filepath, content, 'utf8');
console.log('Successfully updated MenteeLog-Flowchart.md');

const fs = require('fs');
const filepath = 'C:/Users/User/.gemini/antigravity/brain/bdc9d3c0-d8d7-4bcf-b01e-06c72b17d26e/MenteeLog-Flowchart.md';
let content = fs.readFileSync(filepath, 'utf8');

const targetStr = `subgraph CoordinatorPortal["COORDINATOR / ADMIN PORTAL SERVICES"]
    Dashboard4["4.0 Coordinator Dashboard"]
    JobManagement4["4.1 Job Management"]
    CandidateTracking4["4.2 Candidate Tracking<br/><i>(Profiles, Clearances & Documents)</i>"]
    ReportsAnalytics4["4.3 Reports & Analytics"]
    
    subgraph SidebarLeftNav["Central Compliance Drawer"]
        IncidentHub4["4.4 Incident & Compliance Hub<br/><b>Red Queue • Resolution</b>"]
    end
    
    subgraph UserManagementScope["4.5 User Governance Scope"]
        PreSeedBatch4["Pre-Seed OJT Candidates"]
        ProvisionCoordinator4["Provision Faculty Accounts"]
        RBACSummary4["RBAC Security Summary"]
    end
end`;

const replaceStr = `subgraph CoordinatorPortal["COORDINATOR / ADMIN PORTAL SERVICES"]
    Dashboard4["4.0 Coordinator Dashboard"]
    JobManagement4["4.1 Job Management"]
    HTEAccreditation4["4.2 HTE Accreditation<br/><i>(Partner Companies & MOAs)</i>"]
    StudentPlacement4["4.3 Student Placement<br/><i>(Candidate Tracking & Clearances)</i>"]
    DTRCompliance4["4.4 DTR Compliance<br/><i>(Attendance & Verification)</i>"]
    ReportsAnalytics4["4.5 Report Generation"]
    
    subgraph SidebarLeftNav["Central Compliance Drawer"]
        IncidentHub4["4.6 Incident Reports<br/><b>Red Queue • Disciplinary Logs</b>"]
    end
    
    subgraph UserManagementScope["4.7 User Management Scope"]
        PreSeedBatch4["Pre-Seed OJT Candidates<br/><i>(CSV: identifier, name, email, course)</i>"]
        ProvisionCoordinator4["Provision Faculty Accounts"]
        RBACSummary4["RBAC Security Summary"]
    end
end`;

// Need to update the routing references for Coordinator below as well.
const oldRouting = `Dashboard4 --> JobManagement4
Dashboard4 --> CandidateTracking4
Dashboard4 --> ReportsAnalytics4
Dashboard4 --> IncidentHub4
Dashboard4 --> PreSeedBatch4`;

const newRouting = `Dashboard4 --> JobManagement4
Dashboard4 --> HTEAccreditation4
Dashboard4 --> StudentPlacement4
Dashboard4 --> DTRCompliance4
Dashboard4 --> ReportsAnalytics4
Dashboard4 --> IncidentHub4
Dashboard4 --> PreSeedBatch4`;

// Need to update the class assignments
const oldClasses = `class Dashboard4,JobManagement4,CandidateTracking4,ReportsAnalytics4,RBACSummary4,PreSeedBatch4,ProvisionCoordinator4 coordinatorPortal`;
const newClasses = `class Dashboard4,JobManagement4,HTEAccreditation4,StudentPlacement4,DTRCompliance4,ReportsAnalytics4,RBACSummary4,PreSeedBatch4,ProvisionCoordinator4 coordinatorPortal`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    content = content.replace(oldRouting, newRouting);
    content = content.replace(oldClasses, newClasses);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Successfully updated Coordinator flowchart!');
} else {
    console.error("Target string for Flowchart not found. Cannot update.");
}

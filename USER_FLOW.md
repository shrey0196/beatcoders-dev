# BeatCoders User Flow 🌊

This flowchart visualizes the complete user journey through the BeatCoders platform, starting from the Landing Page.

```mermaid
graph TD
    %% Landing Page Flow
    Start((Start)) --> Landing[Landing Page<br/>(index.html)]
    Landing -->|Click 'Start Your Journey'| AuthModal[Auth Modal]
    AuthModal -->|Create Account / Sign In| Dashboard[Dashboard Overview<br/>(dashboard.html)]

    %% Dashboard Branch
    Dashboard -->|View Stats| Stats[Stats Grid<br/>(Problems Solved, Accuracy)]
    Dashboard -->|Quick Action| POTD[Problem of the Day]
    Dashboard -->|Visualizer| LiveBeat[Live Beat Visualizer]
    
    %% Navigation Branch
    Dashboard -->|Sidebar Nav| Nav{Navigation}
    
    %% Practice Mode Flow
    Nav -->|Click Practice| Practice[Practice View]
    Practice -->|Filter/Search| ProbList[Problem List]
    ProbList -->|Select Problem| Modal[Code Editor Modal]
    
    subgraph Code Efficiency Analyzer
        Modal -->|Write Code| Editor[Code Editor]
        Editor -->|Click Submit| Backend[Backend Analysis<br/>(AST Parsing)]
        Backend -->|Return Results| Feedback[Feedback Display]
        Feedback -->|Show| Complexity[Time/Space Complexity]
        Feedback -->|Show| Hints[Optimization Hints]
        Feedback -->|Show| Tier[Performance Tier<br/>(Optimal/Good/Improvable)]
    end
    
    %% Contests/Battle Flow
    Nav -->|Click Contests| Contests[Contests & Battles View]
    
    subgraph Battle Mode
        Contests -->|Option A| RapBattle[1v1 Rap Battle Card]
        Contests -->|Option B| OnlineUsers[Online Users List]
        
        RapBattle -->|Input Email| EmailInvite[Send Email Invite]
        OnlineUsers -->|Click User| Challenge[Send Challenge]
        
        EmailInvite --> BattlePending[Waiting for Opponent...]
        Challenge --> BattlePending
    end
    
    %% Other Views
    Nav -->|Click Leaderboard| Leaderboard[Leaderboard View]
    Nav -->|Click Submissions| Submissions[Recent Submissions]
    
    %% Profile/Settings
    Dashboard -->|Header| Profile[Profile Modal]
    Dashboard -->|Header| Settings[Settings]
    Dashboard -->|Toggle| Theme[Dark/Light Mode]

    %% Styles
    classDef primary fill:#0b1733,stroke:#4ea8ff,stroke-width:2px,color:#fff;
    classDef action fill:#4ea8ff,stroke:#fff,stroke-width:1px,color:#000;
    classDef subfeature fill:#0f1a2b,stroke:#8b5cf6,stroke-width:1px,color:#fff;
    classDef landing fill:#2d3748,stroke:#cbd5e0,stroke-width:2px,color:#fff;
    
    class Dashboard,Practice,Contests,Modal,RapBattle,OnlineUsers primary;
    class POTD,Editor,Backend,EmailInvite,Challenge,AuthModal action;
    class Feedback,Stats,LiveBeat subfeature;
    class Landing landing;
```

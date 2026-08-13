<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>X-Copar AI Studio</title>
  
  <!-- Inter & JetBrains Mono Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- KaTeX for Math Equations -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    :root {
      --bg-dark: #0A0A0C;
      --bg-card: #121216;
      --bg-card-hover: #1A1A20;
      --copper-primary: #B87333;
      --copper-glow: #D4AF37;
      --copper-border: rgba(184, 115, 51, 0.35);
      --copper-glow-shadow: rgba(212, 175, 55, 0.25);
      --text-main: #EDEDF0;
      --text-muted: #8E8E9A;
      --border-subtle: #22222A;
      --danger: #FF453A;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* --- TOP NAVIGATION HEADER --- */
    .app-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: rgba(10, 10, 12, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      z-index: 50;
      position: relative;
    }

    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .icon-btn:hover {
      background: var(--bg-card-hover);
      color: var(--copper-glow);
    }

    .header-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #FFFFFF 0%, var(--copper-glow) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .app-logo {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      object-fit: cover;
      border: 1px solid var(--copper-primary);
    }

    /* --- AUDIO CONTROL BAR (TOP-RIGHT SLIGHTLY DOWNSIDE) --- */
    .top-right-audio-controls {
      position: absolute;
      top: 68px;
      right: 16px;
      background: rgba(18, 18, 22, 0.95);
      border: 1px solid var(--copper-border);
      border-radius: 20px;
      padding: 6px 12px;
      display: none;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), 0 0 10px var(--copper-glow-shadow);
      z-index: 45;
      backdrop-filter: blur(8px);
    }

    .top-right-audio-controls.active {
      display: flex;
    }

    .audio-status {
      font-size: 0.75rem;
      color: var(--copper-glow);
      font-weight: 600;
      margin-right: 4px;
    }

    .audio-btn {
      background: var(--copper-primary);
      color: #000;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .audio-btn:hover {
      transform: scale(1.08);
      background: var(--copper-glow);
    }

    /* --- MAIN CONTENT LAYOUT --- */
    .app-body {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    /* --- TWO-LINES SIDEBAR --- */
    .sidebar {
      position: absolute;
      top: 0;
      left: -320px;
      width: 320px;
      height: 100%;
      background: var(--bg-card);
      border-right: 1px solid var(--border-subtle);
      z-index: 40;
      transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
    }

    .sidebar.open {
      left: 0;
      box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
    }

    .sidebar-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 35;
      display: none;
    }

    .sidebar-overlay.visible {
      display: block;
    }

    .sidebar-top {
      padding: 16px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .settings-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(184, 115, 51, 0.1);
      border: 1px solid var(--copper-border);
      border-radius: 8px;
      color: var(--copper-glow);
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 16px;
      transition: all 0.2s;
    }

    .settings-btn:hover {
      background: var(--copper-primary);
      color: #000;
    }

    .mode-nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mode-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .mode-item:hover, .mode-item.active {
      background: var(--bg-card-hover);
      color: var(--text-main);
    }

    .mode-item.active {
      border-left: 3px solid var(--copper-glow);
      color: var(--copper-glow);
    }

    .sidebar-bottom {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .history-header {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .auth-prompt-card {
      background: var(--bg-dark);
      border: 1px dashed var(--copper-border);
      border-radius: 10px;
      padding: 20px 16px;
      text-align: center;
      margin-top: auto;
      margin-bottom: auto;
    }

    .auth-prompt-card p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .auth-btn {
      width: 100%;
      padding: 8px 12px;
      background: var(--copper-primary);
      color: #000;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .history-item {
      padding: 10px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .history-item:hover {
      background: var(--bg-card-hover);
      color: var(--text-main);
    }

    /* --- CHAT AREA --- */
    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      height: 100%;
    }

    .messages-viewport {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .message-row {
      display: flex;
      gap: 12px;
      max-width: 85%;
    }

    .message-row.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    .message-bubble {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 0.95rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .user .message-bubble {
      background: rgba(184, 115, 51, 0.15);
      border-color: var(--copper-border);
    }

    /* Message Downside Actions (Speaker Button) */
    .message-actions-downside {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .speaker-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      padding: 4px 6px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .speaker-btn:hover {
      color: var(--copper-glow);
      background: var(--bg-card-hover);
    }

    /* Custom Output Cards */
    .code-block {
      background: #050507;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      margin: 10px 0;
      overflow: hidden;
    }

    .code-header {
      background: #121216;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-subtle);
    }

    .code-header button {
      background: transparent;
      border: none;
      color: var(--copper-glow);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
    }

    .code-content {
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      color: #A9B7C6;
    }

    .generated-img-container {
      margin-top: 10px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--copper-border);
    }

    .generated-img-container img {
      width: 100%;
      height: auto;
      display: block;
    }

    .image-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: var(--bg-card);
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }

    .image-actions select, .image-actions button {
      background: var(--bg-dark);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
    }

    .image-actions button:hover {
      border-color: var(--copper-glow);
      color: var(--copper-glow);
    }

    /* --- PROMPT & INPUT BOX --- */
    .input-wrapper {
      padding: 12px 16px 20px 16px;
      background: var(--bg-dark);
    }

    .input-card {
      background: var(--bg-card);
      border: 1px solid var(--copper-border);
      border-radius: 16px;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 10px var(--copper-glow-shadow);
      transition: border-color 0.2s;
    }

    .input-card:focus-within {
      border-color: var(--copper-glow);
    }

    .chat-input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-main);
      font-size: 0.95rem;
      resize: none;
      max-height: 120px;
      min-height: 24px;
      width: 100%;
    }

    .input-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .controls-left, .controls-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .live-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, var(--copper-primary), var(--copper-glow));
      color: #000;
      border: none;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.75rem;
      cursor: pointer;
      box-shadow: 0 0 10px var(--copper-glow-shadow);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(212, 175, 55, 0); }
      100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
    }

    .send-btn {
      background: var(--copper-glow);
      color: #000;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .send-btn.active {
      display: flex;
    }

    /* --- MODALS & DIALOGS --- */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(5px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--copper-border);
      width: 90%;
      max-width: 400px;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
    }

    .modal-header {
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: var(--copper-glow);
    }

    .modal-body {
      font-size: 0.9rem;
      color: var(--text-main);
      margin-bottom: 20px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
    }

    .modal-btn {
      background: var(--copper-primary);
      color: #000;
      font-weight: 600;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }

    /* Auth Forms */
    .form-group {
      margin-bottom: 12px;
    }

    .form-group label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .form-group input {
      width: 100%;
      padding: 10px;
      background: var(--bg-dark);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      color: var(--text-main);
      outline: none;
    }

    .form-group input:focus {
      border-color: var(--copper-glow);
    }

    /* Admin Panel */
    .admin-modal {
      max-width: 700px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .admin-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: var(--bg-dark);
      border: 1px solid var(--border-subtle);
      padding: 12px;
      border-radius: 8px;
    }

    .stat-card .val {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--copper-glow);
    }

    .stat-card .lbl {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }

    .admin-table th, .admin-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid var(--border-subtle);
    }

    .admin-table th {
      color: var(--text-muted);
    }
  </style>
</head>
<body>

  <!-- TOP NAVIGATION HEADER -->
  <header class="app-header">
    <div class="header-left">
      <button class="icon-btn" id="menuToggleBtn" aria-label="Toggle Sidebar">
        <i data-lucide="menu"></i>
      </button>
    </div>
    
    <div class="header-title">X-Copar</div>

    <div class="header-right">
      <label for="logoUpload" style="cursor: pointer;">
        <img id="appLogo" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='%23B87333' stroke-width='2'><rect x='2' y='2' width='20' height='20' rx='5'/><path d='M16 8L8 16'/><path d='M8 8l8 8'/></svg>" alt="X-Copar Logo" class="app-logo" title="Click to change logo"/>
      </label>
      <input type="file" id="logoUpload" accept="image/*" style="display: none;" />
      
      <button class="icon-btn" id="topRightMenuBtn" aria-label="More Options">
        <i data-lucide="more-vertical"></i>
      </button>
    </div>
  </header>

  <!-- TOP-RIGHT DOWNSIDE FLOATING AUDIO CONTROLS (PAUSE / RESUME) -->
  <div class="top-right-audio-controls" id="topRightAudioControls">
    <span class="audio-status" id="audioStatusText">Playing...</span>
    <button class="audio-btn" id="pauseResumeBtn" onclick="togglePauseResumeAudio()" title="Pause/Resume Audio">
      <i data-lucide="pause" id="pauseResumeIcon" style="width: 16px; height: 16px;"></i>
    </button>
    <button class="audio-btn" onclick="stopAudio()" title="Stop Audio" style="background: var(--bg-dark); color: var(--text-main); border: 1px solid var(--border-subtle);">
      <i data-lucide="square" style="width: 14px; height: 14px;"></i>
    </button>
  </div>

  <!-- MAIN BODY LAYOUT -->
  <div class="app-body">
    
    <!-- SIDEBAR OVERLAY -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- TWO-LINES SIDEBAR -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-top">
        <button class="settings-btn" id="openSettingsBtn">
          <i data-lucide="settings"></i>
          <span>Settings / Auth</span>
        </button>

        <div class="mode-nav">
          <div class="mode-item active" data-mode="chat">
            <i data-lucide="message-square"></i>
            <span>Standard Chat</span>
          </div>
          <div class="mode-item" data-mode="x-code">
            <i data-lucide="code"></i>
            <span>X-Code Engine</span>
          </div>
          <div class="mode-item" data-mode="app-code">
            <i data-lucide="layout"></i>
            <span>App Coding Mode</span>
          </div>
          <div class="mode-item" data-mode="maths">
            <i data-lucide="calculator"></i>
            <span>MATHS</span>
          </div>
        </div>
      </div>

      <div class="sidebar-bottom">
        <div class="history-header">Chat History</div>
        
        <!-- Auth Dependent State -->
        <div id="unauthHistory" class="auth-prompt-card">
          <p>Login / Sign Up to save and view history</p>
          <button class="auth-btn" onclick="openAuthModal()">Login / Sign Up</button>
        </div>

        <div id="authHistory" class="history-list" style="display: none;">
          <div class="history-item">Calculus Matrix Derivation</div>
          <div class="history-item">React Native Dashboard Code</div>
          <div class="history-item">Cyberpunk Cyber-city Image</div>
        </div>
      </div>
    </aside>

    <!-- MAIN CHAT CONTAINER -->
    <main class="chat-container">
      <div class="messages-viewport" id="messagesViewport">
        <!-- Default Welcome Bubble -->
        <div class="message-row">
          <div class="message-avatar"><i data-lucide="bot" style="color: var(--copper-glow)"></i></div>
          <div class="message-bubble">
            <div class="msg-text">Welcome to <strong>X-Copar AI</strong>. How can I assist you with code, complex mathematical proofs, or multi-modal generation today?</div>
            <div class="message-actions-downside">
              <button class="speaker-btn" onclick="speakText(this)">
                <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
                <span>Listen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PROMPT & INPUT BOX -->
      <div class="input-wrapper">
        <div class="input-card">
          <textarea class="chat-input" id="chatInput" placeholder="Message X-Copar or request image (e.g. 'Generate image: 1080x1920 neon city')..." rows="1"></textarea>
          
          <div class="input-controls">
            <div class="controls-left">
              <button class="icon-btn" id="attachBtn" aria-label="Attach File"><i data-lucide="plus"></i></button>
              <button class="icon-btn" id="micBtn" aria-label="Voice Input"><i data-lucide="mic"></i></button>
              <input type="file" id="fileInput" style="display:none;" />
            </div>

            <div class="controls-right">
              <button class="live-btn" id="liveBtn">
                <i data-lucide="radio" style="width: 14px; height: 14px;"></i>
                X-Copar Live
              </button>
              <button class="send-btn" id="sendBtn" aria-label="Send Message">
                <i data-lucide="arrow-up" style="width: 18px; height: 18px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- GENERIC CUSTOM ALERT MODAL -->
  <div class="modal-overlay" id="alertModal">
    <div class="modal-card">
      <div class="modal-header" id="alertTitle">Alert</div>
      <div class="modal-body" id="alertMessage">Message goes here.</div>
      <div class="modal-actions">
        <button class="modal-btn" id="alertOkBtn">OK</button>
      </div>
    </div>
  </div>

  <!-- AUTHENTICATION MODAL -->
  <div class="modal-overlay" id="authModal">
    <div class="modal-card">
      <div class="modal-header">X-Copar Authentication</div>
      <div class="modal-body">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="authEmail" placeholder="user@xcopar.ai" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="authPassword" placeholder="••••••••" />
        </div>
      </div>
      <div class="modal-actions" style="gap: 8px;">
        <button class="modal-btn" style="background: transparent; color: var(--text-muted);" onclick="closeAuthModal()">Cancel</button>
        <button class="modal-btn" onclick="handleAuthSubmit()">Login</button>
      </div>
    </div>
  </div>

  <!-- ADMIN DASHBOARD MODAL -->
  <div class="modal-overlay" id="adminModal">
    <div class="modal-card admin-modal">
      <div class="modal-header">Master User / Admin Dashboard</div>
      <div class="modal-body">
        <div class="admin-grid">
          <div class="stat-card">
            <div class="val" id="statTotalUsers">1,248</div>
            <div class="lbl">Total Registered Users</div>
          </div>
          <div class="stat-card">
            <div class="val" id="statActiveUsers">42</div>
            <div class="lbl">Active Sessions Now</div>
          </div>
        </div>

        <div style="font-weight: 600; margin-bottom: 8px; font-size: 0.85rem;">User Session Activity Logs</div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Status</th>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody id="adminLogsTable">
            <tr>
              <td>master.admin@xcopar.ai</td>
              <td style="color: #34C759;">Active</td>
              <td>10:42 AM</td>
              <td>-</td>
            </tr>
            <tr>
              <td>developer@xcopar.ai</td>
              <td style="color: var(--text-muted);">Offline</td>
              <td>08:15 AM</td>
              <td>09:30 AM</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-actions">
        <button class="modal-btn" onclick="closeAdminModal()">Close Dashboard</button>
      </div>
    </div>
  </div>

  <script>
    // Initialize Lucide Icons
    lucide.createIcons();

    // Application State Management
    const state = {
      user: null,
      activeMode: 'chat',
      audioUtterance: null,
      isAudioSpeaking: false,
      isAudioPaused: false
    };

    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const liveBtn = document.getElementById('liveBtn');
    const messagesViewport = document.getElementById('messagesViewport');
    const logoUpload = document.getElementById('logoUpload');
    const appLogo = document.getElementById('appLogo');
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    
    // Top-Right Audio Elements
    const topRightAudioControls = document.getElementById('topRightAudioControls');
    const pauseResumeIcon = document.getElementById('pauseResumeIcon');
    const audioStatusText = document.getElementById('audioStatusText');

    // Navigation & Sidebar Handlers
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
    });

    // Logo Upload Integration
    logoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          appLogo.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Specialized Mode Switching
    document.querySelectorAll('.mode-item').forEach(item => {
      item.addEventListener('click', function() {
        document.querySelectorAll('.mode-item').forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        state.activeMode = this.dataset.mode;
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
      });
    });

    // Dynamic Input & Send Button Toggling
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';

      if (chatInput.value.trim().length > 0) {
        sendBtn.classList.add('active');
      } else {
        sendBtn.classList.remove('active');
      }
    });

    // File Attachment
    attachBtn.addEventListener('click', () => fileInput.click());

    // Send Message Handler
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    function handleSendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendUserMessage(text);
      chatInput.value = '';
      chatInput.style.height = 'auto';
      sendBtn.classList.remove('active');

      setTimeout(() => {
        if (text.toLowerCase().includes('generate image') || text.toLowerCase().includes('image:')) {
          handleImageGeneration(text);
        } else if (state.activeMode === 'maths') {
          handleMathsResponse(text);
        } else if (state.activeMode === 'x-code' || state.activeMode === 'app-code') {
          handleCodeResponse(text);
        } else {
          handleStandardResponse(text);
        }
      }, 600);
    }

    function appendUserMessage(text) {
      const row = document.createElement('div');
      row.className = 'message-row user';
      row.innerHTML = `
        <div class="message-avatar"><i data-lucide="user" style="color: var(--copper-glow)"></i></div>
        <div class="message-bubble">${escapeHtml(text)}</div>
      `;
      messagesViewport.appendChild(row);
      lucide.createIcons();
      scrollToBottom();
    }

    // Response Generators with Speaker Buttons
    function handleStandardResponse(text) {
      const row = document.createElement('div');
      row.className = 'message-row';
      row.innerHTML = `
        <div class="message-avatar"><i data-lucide="bot" style="color: var(--copper-glow)"></i></div>
        <div class="message-bubble">
          <div class="msg-text">Processed query under <strong>Standard Engine</strong>. Integrated analysis successfully executed.</div>
          <div class="message-actions-downside">
            <button class="speaker-btn" onclick="speakText(this)">
              <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
              <span>Listen</span>
            </button>
          </div>
        </div>
      `;
      messagesViewport.appendChild(row);
      lucide.createIcons();
      scrollToBottom();
    }

    function handleCodeResponse(text) {
      const row = document.createElement('div');
      row.className = 'message-row';
      const codeId = 'code-' + Date.now();
      
      row.innerHTML = `
        <div class="message-avatar"><i data-lucide="code" style="color: var(--copper-glow)"></i></div>
        <div class="message-bubble">
          <div class="msg-text">Here is your solution generated via <strong>X-Code Engine</strong>:</div>
          <div class="code-block">
            <div class="code-header">
              <span>typescript</span>
              <button onclick="copyCode('${codeId}')"><i data-lucide="copy" style="width:12px"></i> Copy</button>
            </div>
            <div class="code-content" id="${codeId}">// X-Copar Engine Auto-Generated Logic
async function executeTask(payload: Record<string, unknown>) {
    console.log("Processing payload...", payload);
    return { status: 200, timestamp: Date.now() };
}</div>
          </div>
          <div class="message-actions-downside">
            <button class="speaker-btn" onclick="speakText(this)">
              <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
              <span>Listen</span>
            </button>
          </div>
        </div>
      `;
      messagesViewport.appendChild(row);
      lucide.createIcons();
      scrollToBottom();
    }

    function handleMathsResponse(text) {
      const row = document.createElement('div');
      row.className = 'message-row';
      const mathId = 'math-' + Date.now();

      row.innerHTML = `
        <div class="message-avatar"><i data-lucide="calculator" style="color: var(--copper-glow)"></i></div>
        <div class="message-bubble">
          <div class="msg-text">Step-by-Step Mathematical Proof:</div>
          <div id="${mathId}" style="margin-top: 8px;"></div>
          <div class="message-actions-downside">
            <button class="speaker-btn" onclick="speakText(this)">
              <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
              <span>Listen</span>
            </button>
          </div>
        </div>
      `;
      messagesViewport.appendChild(row);
      
      katex.render("\\int_{0}^{\\infty} x^2 e^{-x} dx = 2! = 2", document.getElementById(mathId), {
        throwOnError: false,
        displayMode: true
      });

      lucide.createIcons();
      scrollToBottom();
    }

    function handleImageGeneration(promptText) {
      const dimMatch = promptText.match(/(\d+)x(\d+)/);
      let width = dimMatch ? dimMatch[1] : 800;
      let height = dimMatch ? dimMatch[2] : 600;

      const row = document.createElement('div');
      row.className = 'message-row';
      const canvasId = 'canvas-' + Date.now();

      row.innerHTML = `
        <div class="message-avatar"><i data-lucide="image" style="color: var(--copper-glow)"></i></div>
        <div class="message-bubble" style="width: 100%;">
          <div class="msg-text">Generated dynamic image matching dimensions: <strong>${width}x${height}px</strong></div>
          <div class="generated-img-container">
            <canvas id="${canvasId}" width="${width}" height="${height}" style="max-width:100%; height:auto; display:block;"></canvas>
            <div class="image-actions">
              <select id="fmt-${canvasId}">
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
              <button onclick="downloadGeneratedImage('${canvasId}')"><i data-lucide="download" style="width:12px;"></i> Download</button>
              <button onclick="showAlert('Success', 'Image saved to collection.')"><i data-lucide="bookmark" style="width:12px;"></i> Save</button>
              <button onclick="showAlert('Copied', 'Image link copied to clipboard.')"><i data-lucide="link" style="width:12px;"></i> Copy</button>
            </div>
          </div>
          <div class="message-actions-downside">
            <button class="speaker-btn" onclick="speakText(this)">
              <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
              <span>Listen</span>
            </button>
          </div>
        </div>
      `;
      messagesViewport.appendChild(row);

      setTimeout(() => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#0A0A0C');
          grad.addColorStop(0.5, '#B87333');
          grad.addColorStop(1, '#D4AF37');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '20px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(`X-Copar Synthetic output (${width}x${height})`, width / 2, height / 2);
        }
      }, 100);

      lucide.createIcons();
      scrollToBottom();
    }

    // --- AUDIO / TEXT-TO-SPEECH (TTS) SYSTEM ---
    function speakText(btnElement) {
      window.speechSynthesis.cancel(); // Reset existing audio

      const bubble = btnElement.closest('.message-bubble');
      const textElement = bubble.querySelector('.msg-text');
      const textToRead = textElement ? textElement.innerText : bubble.innerText;

      if ('speechSynthesis' in window) {
        state.audioUtterance = new SpeechSynthesisUtterance(textToRead);
        
        state.audioUtterance.onstart = () => {
          state.isAudioSpeaking = true;
          state.isAudioPaused = false;
          topRightAudioControls.classList.add('active');
          audioStatusText.innerText = 'Playing...';
          updatePauseResumeIcon('pause');
        };

        state.audioUtterance.onend = () => {
          stopAudio();
        };

        state.audioUtterance.onerror = () => {
          stopAudio();
        };

        window.speechSynthesis.speak(state.audioUtterance);
      } else {
        showAlert('Browser Restriction', 'Text-to-Speech is not supported in this browser.');
      }
    }

    function togglePauseResumeAudio() {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.paused) return;

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        state.isAudioPaused = false;
        audioStatusText.innerText = 'Playing...';
        updatePauseResumeIcon('pause');
      } else {
        window.speechSynthesis.pause();
        state.isAudioPaused = true;
        audioStatusText.innerText = 'Paused';
        updatePauseResumeIcon('play');
      }
    }

    function stopAudio() {
      window.speechSynthesis.cancel();
      state.isAudioSpeaking = false;
      state.isAudioPaused = false;
      topRightAudioControls.classList.remove('active');
    }

    function updatePauseResumeIcon(type) {
      pauseResumeIcon.setAttribute('data-lucide', type);
      lucide.createIcons();
    }

    // Modal Alert Utility
    function showAlert(title, message) {
      document.getElementById('alertTitle').innerText = title;
      document.getElementById('alertMessage').innerText = message;
      const modal = document.getElementById('alertModal');
      modal.classList.add('active');

      document.getElementById('alertOkBtn').onclick = () => {
        modal.classList.remove('active');
      };
    }

    // Auth & Admin Modal Handling
    document.getElementById('openSettingsBtn').addEventListener('click', openAuthModal);

    function openAuthModal() {
      document.getElementById('authModal').classList.add('active');
    }

    function closeAuthModal() {
      document.getElementById('authModal').classList.remove('active');
    }

    function handleAuthSubmit() {
      const email = document.getElementById('authEmail').value.trim();
      const pass = document.getElementById('authPassword').value.trim();

      if (email === 'master.admin@xcopar.ai' && pass === 'admin123') {
        state.user = { email, role: 'admin' };
        closeAuthModal();
        updateUIAuthState();
        openAdminModal();
        return;
      }

      const registeredEmails = ['user@xcopar.ai', 'test@xcopar.ai'];
      if (!registeredEmails.includes(email) && email !== 'master.admin@xcopar.ai') {
        showAlert('Authentication Failed', 'Invalid Email and Password');
      } else {
        showAlert('Authentication Failed', 'Incorrect Password');
      }
    }

    function updateUIAuthState() {
      if (state.user) {
        document.getElementById('unauthHistory').style.display = 'none';
        document.getElementById('authHistory').style.display = 'flex';
      }
    }

    function openAdminModal() {
      document.getElementById('adminModal').classList.add('active');
    }

    function closeAdminModal() {
      document.getElementById('adminModal').classList.remove('active');
    }

    // Helper Utilities
    function copyCode(id) {
      const text = document.getElementById(id).innerText;
      navigator.clipboard.writeText(text);
      showAlert('Copied', 'Code block copied to clipboard.');
    }

    function downloadGeneratedImage(canvasId) {
      const canvas = document.getElementById(canvasId);
      const formatSelect = document.getElementById('fmt-' + canvasId);
      const mimeType = formatSelect.value;
      const ext = mimeType.split('/')[1];

      const link = document.createElement('a');
      link.download = `xcopar-generation.${ext}`;
      link.href = canvas.toDataURL(mimeType);
      link.click();
    }

    function scrollToBottom() {
      messagesViewport.scrollTop = messagesViewport.scrollHeight;
    }

    function escapeHtml(string) {
      return String(string).replace(/[&<>"']/g, function(s) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s];
      });
    }
  </script>
</body>
</html>

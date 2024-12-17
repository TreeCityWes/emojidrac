import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Terminal.css';
import { getTokenInfo } from './services/solana';

const CONTRACT = "FCzioYCxRXWbFAoG1pBmAsWXnEFdLLs5znH2azwjJ2fY";
const DEX_URL = "https://dexscreener.com/solana/fczioycxrxwbfaog1pbmaswxnefdlls5znh2azwjJ2fY";

const COMMANDS = {
  MENU: {
    id: 'menu',
    text: '\nAvailable Commands:\n' +
          '1. info   - Token Info & Stats\n' +
          '2. social - Social Media Links\n' +
          '3. buy    - How to Buy $🧛\n' +
          '4. clear  - Clear Terminal\n\n' +
          'Enter a number or command...'
  },
  INFO: {
    id: 'info',
    text: (tokenInfo) => `
Token Info:
• Price: $${tokenInfo.priceUsd}
• Market Cap: $${Number(tokenInfo.marketCap).toLocaleString()}
• Burned: ${Number(tokenInfo.burnedSupply).toLocaleString()} $🧛 ($${Number(tokenInfo.burnedValueUsd).toLocaleString()})
• Contract: ${CONTRACT}
`
  },
  SOCIAL: {
    id: 'social',
    text: `
Social Links:
• Telegram: https://t.me/EmojiDracula
• Twitter: https://x.com/emojidracula
• Website: https://emojidracula.win
`
  },
  BUY: {
    id: 'buy',
    text: `
How to Buy $🧛:
1. Get SOL in your wallet
2. Visit: ${DEX_URL}
3. Set slippage to 6.66%
4. Swap SOL for $🧛
`
  },
  VAMPIRE: {
    id: 'vampire',
    text: `
🧛 Vampire Protocol Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Protocol: Active
• Target: XEN Token
• Status: Draining liquidity
• Progress: ▓▓▓▓▓▓░░░░ 66.6%
• Victims: Increasing
━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
  },
  HELP: {
    id: 'help',
    text: `
Available Commands:
━━━━━━━━━━━━━━━━
1. info    - Token Info & Stats
2. social  - Social Media Links
3. buy     - How to Buy $🧛
4. clear   - Clear Terminal
5. vampire - Protocol Status
6. help    - Show This Menu

Special Commands:
• blood    - Blood Moon Protocol
• stake    - Staking Info (Coming Soon)
• hunt     - Start Hunting (Coming Soon)
`
  },
  BLOOD: {
    id: 'blood',
    text: `
🌕 Blood Moon Protocol Initiated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WARNING: Extreme volatility detected
ALERT: Vampire feeding frenzy imminent
STATUS: Price impact set to MAXIMUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with caution, mortal...
`
  }
};

const Stats = ({ tokenInfo, onCommand }) => (
  <div className="stats-banner">
    <div className="stat-item" onClick={() => onCommand('info')}>
      <span className="stat-label">Price</span>
      <span className="stat-value">${tokenInfo.priceUsd}</span>
    </div>
    <div className="stat-item" onClick={() => onCommand('info')}>
      <span className="stat-label">Initial Supply</span>
      <span className="stat-value">1,000,000,000 $🧛</span>
    </div>
    <div className="stat-item" onClick={() => onCommand('info')}>
      <span className="stat-label">Current Supply</span>
      <span className="stat-value">{Number(tokenInfo.currentSupply).toLocaleString()} $🧛</span>
    </div>
    <div className="stat-item" onClick={() => onCommand('info')}>
      <span className="stat-label">Burned Supply</span>
      <span className="stat-value">{Number(tokenInfo.burnedSupply).toLocaleString()} $🧛</span>
    </div>
    <div className="stat-item highlight" onClick={() => onCommand('info')}>
      <span className="stat-label">Value Burned</span>
      <span className="stat-value">${Number(tokenInfo.burnedValueUsd).toLocaleString()}</span>
    </div>
  </div>
);

const Footer = () => (
  <footer className="terminal-footer">
    <div className="footer-content">
      <div className="footer-section">
        <span className="footer-label">Protocol Status:</span>
        <span className="footer-value active">ACTIVE</span>
      </div>
      <div className="footer-section">
        <span className="footer-label">Target:</span>
        <span className="footer-value">XEN TOKEN</span>
      </div>
      <div className="footer-section">
        <span className="footer-label">Progress:</span>
        <span className="footer-value">66.6%</span>
      </div>
      <div className="footer-section">
        <span className="footer-label">Phase:</span>
        <span className="footer-value">DRAINING</span>
      </div>
    </div>
  </footer>
);

const INITIAL_MESSAGES = [
  { text: "Wake Up, Degen...", level: "critical", delay: 500 },
  { text: "Initializing <span class='highlight-blue'>X1 Protocol</span> Connection...", level: "system", delay: 400 },
  { text: "Detected: <span class='highlight-red'>666</span> validators online", level: "success", delay: 300 },
  { text: "<span class='highlight-blue'>X1 Network</span> stability: <span class='highlight-green'>OPTIMAL</span>", level: "info", delay: 300 },
  { text: "Anomaly detected: <span class='highlight-red'>Emoji-based assets</span> proliferating on Solana network.", level: "warning", delay: 300 },
  { text: "Growth patterns indicate imminent <span class='highlight-red'>emoji meme dominance</span>.", level: "warning", delay: 300 },
  { text: "<span class='highlight-blue'>X1 Chain</span> migration protocol initiated", level: "system", delay: 400 },
  { text: "Network integrity at <span class='highlight-green'>69%</span> - Nice.", level: "success", delay: 300 },
  { text: "Threat identified: <span class='highlight-red'>Xen Containment protocol</span> initiated", level: "danger", delay: 400 },
  { text: "<span class='highlight-blue'>X1 Bridge</span> protocols <span class='highlight-green'>ACTIVATED</span>", level: "success", delay: 300 },
  { text: "Operation '<span class='highlight-red'>🧛 VAMPIRE ATTACK</span>' is now in effect", level: "critical", delay: 500 },
  { text: "All systems: Prepare for <span class='highlight-blue'>X1 transition</span>", level: "warning", delay: 400 },
  { text: "\nType <span class='highlight-green'>menu</span> or press Enter to start...", level: "system", delay: 300 }
];

function App() {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [uptime, setUptime] = useState('00:00:00');
  const [commandInput, setCommandInput] = useState('');
  const terminalRef = useRef(null);
  const startTime = useRef(new Date());
  
  const [tokenInfo, setTokenInfo] = useState({
    initialSupply: 1_000_000_000,
    currentSupply: null,
    burnedSupply: 0,
    burnedValueUsd: '0',
    priceUsd: '0.00',
    marketCap: '0',
    volume24h: '0',
    liquidity: '0'
  });

  const [terminalHistory, setTerminalHistory] = useState([]);

  const addToHistory = useCallback((entry) => {
    setTerminalHistory(prev => [...prev, entry]);
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const handleCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    
    // Add command to history
    addToHistory({
      type: 'command',
      content: `> ${cmd}`
    });

    // Process command
    switch (command) {
      case '1':
      case 'info':
        addToHistory({
          type: 'response',
          content: COMMANDS.INFO.text(tokenInfo)
        });
        break;

      case '2':
      case 'social':
        addToHistory({
          type: 'response',
          content: COMMANDS.SOCIAL.text
        });
        break;

      case '3':
      case 'buy':
        addToHistory({
          type: 'response',
          content: COMMANDS.BUY.text
        });
        break;

      case '4':
      case 'clear':
        setTerminalHistory([{
          type: 'system',
          content: 'Terminal cleared.\n\nType <span class="highlight-green">menu</span> or press Enter to start...'
        }]);
        break;

      case 'menu':
      case '':
        addToHistory({
          type: 'system',
          content: COMMANDS.MENU.text
        });
        break;

      case '5':
      case 'vampire':
        addToHistory({
          type: 'response',
          content: COMMANDS.VAMPIRE.text
        });
        break;

      case '6':
      case 'help':
        addToHistory({
          type: 'response',
          content: COMMANDS.HELP.text
        });
        break;

      case 'blood':
        addToHistory({
          type: 'response',
          content: COMMANDS.BLOOD.text
        });
        break;

      default:
        addToHistory({
          type: 'error',
          content: 'Command not recognized. Type "menu" for available commands.'
        });
    }
  };

  const fetchTokenInfo = useCallback(async () => {
    try {
      const info = await getTokenInfo(CONTRACT);
      setTokenInfo(info);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  }, []);

  // Initial fetch and refresh interval
  useEffect(() => {
    fetchTokenInfo();
    const interval = setInterval(fetchTokenInfo, 60000);
    return () => clearInterval(interval);
  }, [fetchTokenInfo]);

  // Uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - startTime.current;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial messages effect
  useEffect(() => {
    const displayInitialMessages = async (index = 0) => {
      if (index < INITIAL_MESSAGES.length) {
        const msg = INITIAL_MESSAGES[index];
        setTerminalHistory(prev => {
          // Check if this message is already in the history
          const isDuplicate = prev.some(entry => entry.content === msg.text);
          if (isDuplicate) return prev;
          return [...prev, {
            type: msg.level,
            content: msg.text
          }];
        });
        setTimeout(() => displayInitialMessages(index + 1), msg.delay);
      }
    };

    // Only start displaying messages if terminal is empty
    if (terminalHistory.length === 0) {
      displayInitialMessages();
    }
  }, []); // Empty dependency array since we only want this to run once

  return (
    <div className="App">
      <header id="header">
        <a href="/" className="brand">
          <img src="drac1.png" alt="Emoji Dracula" />
          EmojiDracula.win
        </a>
        <nav className="nav-menu">
          <a href="https://t.me/EmojiDracula" target="_blank" rel="noopener noreferrer">🧛 Telegram</a>
          <a href="https://x.com/emojidracula" target="_blank" rel="noopener noreferrer">🧛 Twitter</a>
          <a href={DEX_URL} target="_blank" rel="noopener noreferrer">🧛 Buy</a>
          <a href={DEX_URL} target="_blank" rel="noopener noreferrer">🧛 Chart</a>
          <a href={`https://solana.fm/address/${CONTRACT}`} target="_blank" rel="noopener noreferrer">🧛 Explorer</a>
        </nav>
        <button id="mobile-menu-btn" onClick={() => setMobileMenuActive(!mobileMenuActive)}>
          {mobileMenuActive ? '×' : '☰'}
        </button>
      </header>

      <div className={`mobile-menu ${mobileMenuActive ? 'active' : ''}`}>
        <a href="https://t.me/EmojiDracula" target="_blank" rel="noopener noreferrer">🧛 Telegram</a>
        <a href="https://x.com/emojidracula" target="_blank" rel="noopener noreferrer">🧛 Twitter</a>
        <a href={DEX_URL} target="_blank" rel="noopener noreferrer">🧛 Buy</a>
        <a href={DEX_URL} target="_blank" rel="noopener noreferrer">🧛 Chart</a>
        <a href={`https://solana.fm/address/${CONTRACT}`} target="_blank" rel="noopener noreferrer">🧛 Explorer</a>
      </div>

      <div className="main-container">
        <div className="stats-panel">
          <Stats tokenInfo={tokenInfo} onCommand={handleCommand} />
        </div>

        <div id="terminal-container">
          <div id="terminal-header">
            <div>XOLANA VAMPIRE ATTACK MONITORING PROTOCOL - XVAMP</div>
            <div>🧛 UPTIME: <span>{uptime}</span></div>
          </div>

          <div id="terminal" ref={terminalRef}>
            {terminalHistory.map((entry, index) => (
              <div key={index} className={`terminal-line ${entry.type}`}>
                <span dangerouslySetInnerHTML={{ __html: entry.content }} />
              </div>
            ))}
          </div>

          <input
            type="text"
            id="command-input"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCommand(commandInput);
                setCommandInput('');
              }
            }}
            placeholder="> Enter command..."
            autoComplete="off"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;

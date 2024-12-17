import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Terminal.css';
import { getTokenInfo } from './services/solana';

const CONTRACT = "FCzioYCxRXWbFAoG1pBmAsWXnEFdLLs5znH2azwjJ2fY";
const DEX_URL = "https://dexscreener.com/solana/fczioycxrxwbfaog1pbmaswxnefdlls5znh2azwjJ2fY";
const SOLSCAN_URL = `https://solscan.io/token/${CONTRACT}`;

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
• Contract: <a href="${SOLSCAN_URL}" target="_blank">${CONTRACT}</a>
`
  },
  SOCIAL: {
    id: 'social',
    text: `
Social Links:
• Telegram: <a href="https://t.me/EmojiDracula" target="_blank">https://t.me/EmojiDracula</a>
• Twitter: <a href="https://x.com/emojidracula" target="_blank">https://x.com/emojidracula</a>
• Website: <a href="https://emojidracula.win" target="_blank">https://emojidracula.win</a>
`
  },
  BUY: {
    id: 'buy',
    text: `
How to Buy $🧛:
1. Get SOL in your wallet
2. Visit: <a href="${DEX_URL}" target="_blank">${DEX_URL}</a>
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
• Target: X1 Blockchain
• Status: Vampire mode
• Progress: ▓▓▓▓▓▓▓▓▓▓ 100%
• Victims: Maximum
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
      <span className="stat-label">Market Cap</span>
      <span className="stat-value">${Number(tokenInfo.marketCap).toLocaleString()}</span>
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
        <span className="footer-value">X1 BLOCKCHAIN</span>
      </div>
      <div className="footer-section">
        <span className="footer-label">Progress:</span>
        <span className="footer-value">100%</span>
      </div>
      <div className="footer-section">
        <span className="footer-label">Phase:</span>
        <span className="footer-value">VAMPIRE</span>
      </div>
      <div className="footer-section highlight">
        <span className="footer-value">X1 TOKEN TRANSFER TESTING XOON</span>
      </div>
    </div>
  </footer>
);

const INITIAL_MESSAGES = [
  { text: "[INFO] Wake Up, Degen...", level: "info", delay: 500 },
  { text: "[INFO] Anomaly detected: Emoji-based assets proliferating on Solana network.", level: "info", delay: 400 },
  { text: "[WARNING] Growth patterns indicate imminent emoji meme dominance increasing rapidly.", level: "warning", delay: 300 },
  { text: "[CRITICAL] Threat identified: Xen Containment protocol initiated - Codename 'Vampire Attack'", level: "critical", delay: 400 },
  { text: `[SOCIAL] Join the Telegram: <a href="https://t.me/EmojiDracula" target="_blank">https://t.me/EmojiDracula</a>`, level: "social", delay: 300 },
  { text: `[SOCIAL] Follow on X (Twitter) - <a href="https://x.com/emojidracula" target="_blank">https://x.com/emojidracula</a>`, level: "social", delay: 300 },
  { text: "[INFO] Xolana testnet destabilizing - initiate Emoji Dracula attack plan.", level: "info", delay: 400 },
  { text: "[ANOMALY] Network integrity at 69% - Nice. Memetic interference increasing.", level: "anomaly", delay: 300 },
  { text: "[INFO] Xenians must act. Emoji Dracula is now live on Moonshot.", level: "info", delay: 300 },
  { text: "[CRITICAL] Operation '🧛' is now in effect - vampire attack in progress.", level: "critical", delay: 500 },
  { text: "[WARNING] All validators: Prepare for transition. X1 is the safe haven.", level: "warning", delay: 400 },
  { text: "[INFO] Type 'help' or press Enter to view available commands.", level: "info", delay: 300 }
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
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    setTerminalHistory(prev => [...prev, {
      ...entry,
      timestamp: `[${timestamp}]`
    }]);
    
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

    if (terminalHistory.length === 0) {
      displayInitialMessages();
    }
  }, [terminalHistory.length]);

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
                <span className="timestamp">{entry.timestamp}</span>
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

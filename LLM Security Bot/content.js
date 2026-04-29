const detector = new PIIDetector();

console.log('✅ Content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const result = detector.scan(request.text);
    sendResponse(result);
  }
});

// Real-time detection on LLM pages
function setupRealtimeDetection() {
  console.log('🔍 Looking for textareas...');
  
  // Try multiple selectors for different LLM sites
  const selectors = [
    'textarea[data-testid="chat-input-textarea"]',  // ChatGPT
    'textarea[placeholder*="Message"]',             // Claude/Gemini
    'textarea[placeholder*="Type"]',                // Generic
    'textarea[placeholder*="prompt"]',              // Generic
    '[contenteditable="true"][role="textbox"]',     // Rich text editors
    'textarea'                                       // Fallback: any textarea
  ];

  let textarea = null;
  for (const selector of selectors) {
    const found = document.querySelector(selector);
    if (found) {
      textarea = found;
      console.log('✅ Found textarea with selector:', selector);
      break;
    }
  }

  if (!textarea) {
    console.warn('⚠️ No textarea found. Trying alternative methods...');
    
    // Try contenteditable divs (Claude uses this)
    const editables = document.querySelectorAll('[contenteditable="true"]');
    if (editables.length > 0) {
      textarea = editables[editables.length - 1];
      console.log('✅ Found contenteditable element');
    }
  }

  if (textarea) {
    console.log('📝 Setting up listener on:', textarea);
    
    const handleInput = debounce(() => {
      const text = textarea.value || textarea.textContent || textarea.innerText;
      console.log('📝 Input detected:', text.substring(0, 50) + '...');
      
      const result = detector.scan(text);
      console.log('🔍 Scan result:', result.risk_level, result.finding_count);
      
      if (result.risk_level !== 'LOW') {
        showWarningBanner(result);
      } else {
        hideWarningBanner();
      }
    }, 500);

    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('change', handleInput);
    textarea.addEventListener('keyup', handleInput);

    console.log('✅ PII Detector active on this page');
  } else {
    console.warn('❌ Could not find any input element to monitor');
  }
}

// Run on page load
console.log('📄 Current page:', window.location.href);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupRealtimeDetection);
} else {
  setupRealtimeDetection();
}

// Watch for dynamically added textareas
const observer = new MutationObserver(() => {
  console.log('🔄 DOM changed, checking for new textareas...');
  setupRealtimeDetection();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false
});

function showWarningBanner(result) {
  console.log('🚨 Showing banner for risk level:', result.risk_level);
  
  let banner = document.getElementById('pii-warning-banner');
  
  // Color code based on risk
  const colors = {
    'CRITICAL': { bg: '#ffcdd2', border: '#c62828', text: '#c62828' },
    'HIGH': { bg: '#ffe0b2', border: '#e65100', text: '#e65100' },
    'MEDIUM': { bg: '#f3e5f5', border: '#6a1b9a', text: '#6a1b9a' }
  };
  
  const color = colors[result.risk_level] || colors['HIGH'];
  
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'pii-warning-banner';
    document.body.appendChild(banner);
    console.log('✅ Created new banner element');
  }

  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color.bg};
    border: 3px solid ${color.border};
    color: ${color.text};
    padding: 16px;
    border-radius: 8px;
    z-index: 999999;
    font-weight: 700;
    font-size: 14px;
    max-width: 350px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.4;
  `;
  
  // Show findings
  let findingsText = result.message;
  if (result.finding_count > 0) {
    const types = [...new Set(result.findings.map(f => f.type))];
    findingsText += '\n\n' + types.join(', ');
  }
  
  banner.textContent = findingsText;
  banner.style.display = 'block';
}

function hideWarningBanner() {
  const banner = document.getElementById('pii-warning-banner');
  if (banner) {
    banner.style.display = 'none';
  }
}

function debounce(func, ms) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms);
  };
}


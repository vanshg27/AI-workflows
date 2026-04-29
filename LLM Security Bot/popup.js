document.addEventListener('DOMContentLoaded', () => {
  const detector = new PIIDetector();
  
  const promptInput = document.getElementById('promptInput');
  const scanBtn = document.getElementById('scanBtn');
  const clearBtn = document.getElementById('clearBtn');
  const newScanBtn = document.getElementById('newScanBtn');
  const proceedBtn = document.getElementById('proceedBtn');
  const redactBtn = document.getElementById('redactBtn');
  
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const empty = document.getElementById('empty');
  const riskBanner = document.getElementById('riskBanner');
  const findings = document.getElementById('findings');

  scanBtn.addEventListener('click', () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please paste a prompt first');
      return;
    }
    performScan(prompt);
  });

  clearBtn.addEventListener('click', () => {
    promptInput.value = '';
    promptInput.focus();
  });

  newScanBtn.addEventListener('click', () => {
    promptInput.value = '';
    promptInput.focus();
    empty.style.display = 'block';
    results.style.display = 'none';
  });

  proceedBtn.addEventListener('click', () => {
    alert('⚠️ You chose to send this anyway. Be careful!');
  });

  redactBtn.addEventListener('click', () => {
    const result = detector.scan(promptInput.value);
    let redactedText = promptInput.value;
    
    result.findings.forEach(finding => {
      redactedText = redactedText.replace(
        finding.match.slice(0, -3),
        '***REDACTED***'
      );
    });
    
    promptInput.value = redactedText;
    promptInput.select();
    document.execCommand('copy');
    alert('✅ Redacted prompt copied to clipboard!');
  });

  function performScan(prompt) {
    loading.style.display = 'flex';
    empty.style.display = 'none';
    results.style.display = 'none';

    setTimeout(() => {
      const result = detector.scan(prompt);
      displayResults(result);
      loading.style.display = 'none';
      results.style.display = 'block';
    }, 300);
  }

  function displayResults(result) {
    riskBanner.textContent = result.message;
    riskBanner.className = `risk-banner risk-${result.risk_level.toLowerCase()}`;

    proceedBtn.style.display = result.risk_level === 'LOW' ? 'none' : 'block';
    redactBtn.style.display = result.finding_count > 0 ? 'block' : 'none';

    findings.innerHTML = '';
    if (result.finding_count === 0) {
      findings.innerHTML = '<p style="text-align: center; color: #666;">No sensitive data found ✅</p>';
    } else {
      result.findings.forEach(finding => {
        const div = document.createElement('div');
        div.className = `finding-item ${finding.risk.toLowerCase()}`;
        div.innerHTML = `
          <div class="finding-type">${finding.type}</div>
          <div class="finding-description">${finding.description}</div>
        `;
        findings.appendChild(div);
      });
    }
  }

  promptInput.focus();
});

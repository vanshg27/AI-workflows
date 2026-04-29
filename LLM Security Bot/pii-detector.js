// pii-detector.js
class PIIDetector {
  constructor() {
    this.patterns = {
      // API Keys & Credentials
      api_key: {
        regex: /(?:api[_-]?key|apikey|api\s*=|sk[_-]?test|sk[_-]?live|pk[_-]?test|pk[_-]?live)[:\s='"]*([a-zA-Z0-9_\-]{8,})/gi,
        risk: 'HIGH',
        name: 'API Key',
        description: 'Looks like an API key or secret token'
      },
      aws_key: {
        regex: /AKIA[0-9A-Z]{16}/g,
        risk: 'HIGH',
        name: 'AWS Access Key',
        description: 'AWS access key found'
      },
      db_password: {
        regex: /(?:password|passwd|pwd|secret)[:\s='"]*([^'"\s]{8,})/gi,
        risk: 'HIGH',
        name: 'Database Password',
        description: 'Password string detected'
      },
      ssn: {
        regex: /\b\d{3}-\d{2}-\d{4}\b/g,
        risk: 'HIGH',
        name: 'Social Security Number',
        description: 'SSN format detected'
      },
      credit_card: {
        regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
        risk: 'HIGH',
        name: 'Credit Card',
        description: 'Credit card number detected'
      },
      private_key: {
        regex: /-----BEGIN (RSA|DSA|EC|OPENSSH|PRIVATE) PRIVATE KEY-----/gi,
        risk: 'CRITICAL',
        name: 'Private Key',
        description: 'Private encryption key found'
      },
      email: {
        regex: /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        risk: 'MEDIUM',
        name: 'Email Address',
        description: 'Email address detected'
      },
      db_url: {
        regex: /(?:mongodb|postgres|mysql|redis):\/\/[^\s"']+/gi,
        risk: 'HIGH',
        name: 'Database URL',
        description: 'Database connection string detected'
      }
    };
  }

  scan(text) {
    const findings = [];
    let overallRisk = 'LOW';

    for (const [patternName, patternData] of Object.entries(this.patterns)) {
      const regex = new RegExp(patternData.regex);
      let match;

      if (patternData.regex.global) {
        patternData.regex.lastIndex = 0;
      }

      while ((match = patternData.regex.exec(text)) !== null) {
        findings.push({
          type: patternData.name,
          risk: patternData.risk,
          description: patternData.description,
          match: match[0].substring(0, 20) + '***',
          position: match.index
        });

        if (patternData.risk === 'CRITICAL') {
          overallRisk = 'CRITICAL';
        } else if (patternData.risk === 'HIGH' && overallRisk !== 'CRITICAL') {
          overallRisk = 'HIGH';
        } else if (patternData.risk === 'MEDIUM' && overallRisk === 'LOW') {
          overallRisk = 'MEDIUM';
        }
      }
    }

    return {
      risk_level: overallRisk,
      findings: findings,
      finding_count: findings.length,
      safe_to_send: overallRisk === 'LOW',
      message: this.generateMessage(overallRisk, findings.length)
    };
  }

  generateMessage(riskLevel, findingCount) {
    const messages = {
      'CRITICAL': `🚨 CRITICAL: Do NOT send this prompt. ${findingCount} critical issue(s) detected.`,
      'HIGH': `⚠️ HIGH RISK: ${findingCount} sensitive item(s) detected. Review before sending.`,
      'MEDIUM': `⚠️ MEDIUM RISK: ${findingCount} item(s) found. Review if sensitive.`,
      'LOW': `✅ SAFE: No obvious sensitive data detected. OK to send.`
    };
    return messages[riskLevel];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PIIDetector;
}

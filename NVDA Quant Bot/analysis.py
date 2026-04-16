# 1. Parse data directly from your API node
time_series = _items[0]["json"]["Time Series (Daily)"]

# 2. Extract and sort prices chronologically
sorted_dates = sorted(time_series.keys())
prices = [float(time_series[d]["4. close"]) for d in sorted_dates]

# 3. Logistic Regression setup
# We want to predict if 'tomorrow' is GREEN (1) or RED (0)
# based on the historical pattern in your specific JSON.
X = list(range(len(prices)))
y = [1 if prices[i] > prices[i-1] else 0 for i in range(1, len(prices))]
X_train = X[1:] # Align lengths

# 4. Manual Sigmoid & Training (No math/sklearn imports)
E = 2.718281828

def sigmoid(z):
    if z > 10: return 0.9999
    if z < -10: return 0.0001
    return 1 / (1 + (E ** -z))

intercept, slope = 0.0, 0.0
learning_rate = 0.01

# Training loop
for _ in range(500):
    for i in range(len(y)):
        pred = sigmoid(intercept + (slope * X_train[i]))
        error = y[i] - pred
        intercept += learning_rate * error
        slope += learning_rate * error * X_train[i]

# 5. Result for the current day (April 16, 2026)
prob_up = sigmoid(intercept + (slope * len(prices)))

return [{
    "json": {
        "ticker": "NVDA",
        "analysis_date": "2026-04-16",
        "latest_close": prices[-1],
        "logistic_prob_up": round(prob_up, 4),
        "classification": "BULLISH_TREND" if prob_up > 0.5 else "BEARISH_DIVERGENCE",
        "note": "Calculated via manual Gradient Descent in n8n sandbox."
    }
}]
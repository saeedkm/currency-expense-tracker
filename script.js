// Currency Expense Tracker JavaScript
class CurrencyExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.exchangeRates = JSON.parse(localStorage.getItem('exchangeRates')) || {};
        this.lastRateUpdate = localStorage.getItem('lastRateUpdate') || null;
        this.currentView = 'daily';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.loadExchangeRates();
        this.renderExpenses();
        this.updateSummary();
        this.setupQuickConverter();
    }

    setupEventListeners() {
        // Expense form submission
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Date filters
        document.getElementById('filter-date').addEventListener('change', () => {
            this.updateSummary();
            this.renderExpenses();
        });

        document.getElementById('filter-month').addEventListener('change', () => {
            this.updateSummary();
            this.renderExpenses();
        });

        // Action buttons
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAllExpenses();
        });

        // Quick converter
        document.getElementById('convert-amount').addEventListener('input', () => {
            this.updateQuickConverter();
        });

        document.getElementById('convert-from').addEventListener('change', () => {
            this.updateQuickConverter();
        });

        // Real-time conversion preview
        document.getElementById('amount').addEventListener('input', () => {
            this.showConversionPreview();
        });

        document.getElementById('currency').addEventListener('change', () => {
            this.showConversionPreview();
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('filter-date').value = today;
        
        const currentMonth = new Date().toISOString().slice(0, 7);
        document.getElementById('filter-month').value = currentMonth;
    }

    async loadExchangeRates() {
        // Check if rates are cached and less than 1 hour old
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
        
        if (this.lastRateUpdate && (now - parseInt(this.lastRateUpdate)) < oneHour) {
            this.updateExchangeRateDisplay();
            return;
        }

        try {
            this.showLoadingState();
            
            // Using ExchangeRate-API (free tier) - fetch USD as base to get proper rates
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            
            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }
            
            const data = await response.json();
            
            // Store rates where each rate represents how many units of that currency = 1 USD
            this.exchangeRates = data.rates;
            
            // Get INR rate (how many INR = 1 USD)
            const usdToInrRate = this.exchangeRates['INR'];
            
            // Convert all rates to show how many INR = 1 unit of each currency
            for (const [currency, rate] of Object.entries(this.exchangeRates)) {
                if (currency === 'INR') {
                    this.exchangeRates[currency] = 1; // 1 INR = 1 INR
                } else {
                    // Convert: (1 unit of currency) * (USD per unit) * (INR per USD) = INR per unit
                    this.exchangeRates[currency] = usdToInrRate / rate;
                }
            }
            
            this.lastRateUpdate = now.toString();
            
            // Save to localStorage
            localStorage.setItem('exchangeRates', JSON.stringify(this.exchangeRates));
            localStorage.setItem('lastRateUpdate', this.lastRateUpdate);
            
            this.updateExchangeRateDisplay();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Error loading exchange rates:', error);
            this.showError('Failed to load current exchange rates. Using cached rates if available.');
            this.hideLoadingState();
        }
    }

    convertToINR(amount, fromCurrency) {
        if (fromCurrency === 'INR') return amount;
        
        const rate = this.exchangeRates[fromCurrency];
        if (!rate) {
            console.warn(`Exchange rate not found for ${fromCurrency}`);
            return amount; // Return original amount if rate not found
        }
        
        // Rate now represents how many INR = 1 unit of fromCurrency
        return amount * rate;
    }

    async showConversionPreview() {
        const amount = parseFloat(document.getElementById('amount').value);
        const currency = document.getElementById('currency').value;
        const preview = document.getElementById('conversion-preview');
        
        if (!amount || amount <= 0) {
            preview.style.display = 'none';
            return;
        }
        
        if (currency === 'INR') {
            preview.style.display = 'none';
            return;
        }
        
        preview.style.display = 'block';
        
        if (!this.exchangeRates[currency]) {
            preview.innerHTML = '<p>⚠️ Exchange rate not available for ' + currency + '</p>';
            return;
        }
        
        const inrAmount = this.convertToINR(amount, currency);
        preview.innerHTML = `
            <p>💱 ${amount} ${currency} = <strong>₹${inrAmount.toFixed(2)}</strong></p>
        `;
    }

    async addExpense() {
        const amount = parseFloat(document.getElementById('amount').value);
        const currency = document.getElementById('currency').value;
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;
        
        if (!amount || !currency || !description || !date) {
            this.showError('Please fill in all fields');
            return;
        }
        
        if (amount <= 0) {
            this.showError('Amount must be greater than 0');
            return;
        }
        
        // Convert to INR
        const inrAmount = this.convertToINR(amount, currency);
        
        const expense = {
            id: Date.now(),
            amount: amount,
            currency: currency,
            inrAmount: inrAmount,
            description: description,
            date: date,
            timestamp: new Date().toISOString()
        };
        
        this.expenses.unshift(expense); // Add to beginning of array
        this.saveExpenses();
        
        // Reset form
        document.getElementById('expense-form').reset();
        this.setDefaultDate();
        document.getElementById('conversion-preview').style.display = 'none';
        
        // Update UI
        this.renderExpenses();
        this.updateSummary();
        
        this.showSuccess(`Expense added: ${description} - ₹${inrAmount.toFixed(2)}`);
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.showSuccess('Expense deleted successfully');
        }
    }

    switchTab(tab) {
        this.currentView = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Show/hide appropriate date filter
        const dateFilter = document.getElementById('filter-date');
        const monthFilter = document.getElementById('filter-month');
        
        if (tab === 'daily') {
            dateFilter.style.display = 'block';
            monthFilter.style.display = 'none';
            document.getElementById('summary-title').textContent = 'Daily Total';
        } else {
            dateFilter.style.display = 'none';
            monthFilter.style.display = 'block';
            document.getElementById('summary-title').textContent = 'Monthly Total';
        }
        
        this.updateSummary();
        this.renderExpenses();
    }

    updateSummary() {
        let filteredExpenses = [];
        
        if (this.currentView === 'daily') {
            const selectedDate = document.getElementById('filter-date').value;
            filteredExpenses = this.expenses.filter(expense => expense.date === selectedDate);
        } else {
            const selectedMonth = document.getElementById('filter-month').value;
            filteredExpenses = this.expenses.filter(expense => 
                expense.date.startsWith(selectedMonth)
            );
        }
        
        const total = filteredExpenses.reduce((sum, expense) => sum + expense.inrAmount, 0);
        document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
    }

    renderExpenses() {
        const expenseList = document.getElementById('expense-list');
        let filteredExpenses = [];
        
        if (this.currentView === 'daily') {
            const selectedDate = document.getElementById('filter-date').value;
            filteredExpenses = this.expenses.filter(expense => expense.date === selectedDate);
        } else {
            const selectedMonth = document.getElementById('filter-month').value;
            filteredExpenses = this.expenses.filter(expense => 
                expense.date.startsWith(selectedMonth)
            );
        }
        
        if (filteredExpenses.length === 0) {
            expenseList.innerHTML = `
                <div class="no-expenses">
                    <p>No expenses found for the selected ${this.currentView === 'daily' ? 'date' : 'month'}. 📝</p>
                </div>
            `;
            return;
        }
        
        expenseList.innerHTML = filteredExpenses.map(expense => `
            <div class="expense-item" data-id="${expense.id}">
                <div class="expense-details">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-meta">
                        ${this.formatDate(expense.date)} • ${expense.timestamp ? new Date(expense.timestamp).toLocaleTimeString() : ''}
                    </div>
                </div>
                <div class="expense-amount">
                    <div class="original-amount">${expense.amount} ${expense.currency}</div>
                    <div class="inr-amount">₹${expense.inrAmount.toFixed(2)}</div>
                </div>
                <button class="delete-btn" onclick="tracker.deleteExpense(${expense.id})">🗑️</button>
            </div>
        `).join('');
    }

    setupQuickConverter() {
        this.updateQuickConverter();
    }

    updateQuickConverter() {
        const amount = parseFloat(document.getElementById('convert-amount').value);
        const fromCurrency = document.getElementById('convert-from').value;
        const resultElement = document.getElementById('converted-amount');
        
        if (!amount || amount <= 0) {
            resultElement.textContent = '0.00';
            return;
        }
        
        const inrAmount = this.convertToINR(amount, fromCurrency);
        resultElement.textContent = inrAmount.toFixed(2);
    }

    exportToCSV() {
        if (this.expenses.length === 0) {
            this.showError('No expenses to export');
            return;
        }
        
        const headers = ['Date', 'Description', 'Original Amount', 'Currency', 'INR Amount'];
        const csvContent = [
            headers.join(','),
            ...this.expenses.map(expense => [
                expense.date,
                `"${expense.description}"`,
                expense.amount,
                expense.currency,
                expense.inrAmount.toFixed(2)
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showSuccess('Expenses exported to CSV successfully');
    }

    clearAllExpenses() {
        if (this.expenses.length === 0) {
            this.showError('No expenses to clear');
            return;
        }
        
        if (confirm('Are you sure you want to delete ALL expenses? This action cannot be undone.')) {
            this.expenses = [];
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.showSuccess('All expenses cleared successfully');
        }
    }

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    updateExchangeRateDisplay() {
        const lastUpdated = this.lastRateUpdate ? 
            new Date(parseInt(this.lastRateUpdate)).toLocaleString() : 'Never';
        
        document.getElementById('last-updated').textContent = lastUpdated;
        document.getElementById('exchange-rate-display').textContent = 
            `Exchange rates updated: ${lastUpdated}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showLoadingState() {
        // You can implement a loading overlay here if needed
        console.log('Loading exchange rates...');
    }

    hideLoadingState() {
        console.log('Exchange rates loaded');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of main content
        const main = document.querySelector('main');
        main.insertBefore(messageDiv, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new CurrencyExpenseTracker();
});

// Refresh exchange rates every hour
setInterval(() => {
    if (window.tracker) {
        window.tracker.loadExchangeRates();
    }
}, 60 * 60 * 1000); // 1 hour

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.tracker) {
        window.tracker.loadExchangeRates();
        window.tracker.showSuccess('Back online! Exchange rates updated.');
    }
});

window.addEventListener('offline', () => {
    if (window.tracker) {
        window.tracker.showError('You are offline. Using cached exchange rates.');
    }
});

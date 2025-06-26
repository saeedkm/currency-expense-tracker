# Currency Expense Tracker

A modern, responsive web application for tracking expenses with real-time currency conversion to Indian Rupees (INR). Perfect for travelers, international shoppers, or anyone dealing with multiple currencies.

## Features

### 💰 Real-time Currency Conversion
- Live exchange rates from ExchangeRate-API
- Automatic conversion to INR (base currency)
- Support for 10+ major currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SGD)
- Exchange rates cached for 1 hour to minimize API calls

### 📊 Expense Tracking
- Add expenses in any supported currency
- Automatic conversion and storage in INR
- Daily and monthly expense summaries
- Real-time conversion preview while typing
- Detailed expense history with timestamps

### 📱 User-Friendly Interface
- Clean, modern design with gradient backgrounds
- Fully responsive (mobile, tablet, desktop)
- Intuitive form with validation
- Visual feedback for all actions
- Smooth animations and transitions

### 🔧 Advanced Features
- **Quick Currency Converter**: Convert any amount between currencies
- **Export to CSV**: Download expense data for external analysis
- **Local Storage**: All data persists in browser (no server required)
- **Offline Support**: Works with cached exchange rates when offline
- **Date Filtering**: View expenses by specific date or month
- **Delete Individual Expenses**: Remove unwanted entries
- **Clear All Data**: Reset all expenses with confirmation

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for live exchange rates

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start tracking your expenses!

### File Structure
```
currency-expense-tracker/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Usage

### Adding Expenses
1. Enter the expense amount
2. Select the currency from the dropdown
3. Add a description (e.g., "Lunch", "Transport")
4. Choose the date (defaults to today)
5. Click "Add Expense"

The app will automatically:
- Convert the amount to INR using current exchange rates
- Show a preview of the conversion
- Add the expense to your history
- Update daily/monthly totals

### Viewing Expenses
- **Daily View**: See expenses for a specific date
- **Monthly View**: See all expenses for a selected month
- Use the date/month picker to filter expenses
- View both original currency and INR amounts

### Quick Currency Converter
Use the built-in converter to quickly check exchange rates:
1. Enter an amount
2. Select the source currency
3. See the equivalent in INR instantly

### Exporting Data
Click "Export CSV" to download your expense data in spreadsheet format, including:
- Date and description
- Original amount and currency
- Converted INR amount

## Technical Details

### Currency API
- Uses ExchangeRate-API (free tier)
- Rates updated hourly
- Fallback to cached rates if API unavailable
- Base currency: Indian Rupee (INR)

### Data Storage
- All data stored locally in browser's localStorage
- No server or database required
- Data persists between sessions
- Privacy-focused (no data sent to external servers except for exchange rates)

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Supported Currencies

| Currency | Code | Symbol |
|----------|------|--------|
| Indian Rupee | INR | ₹ |
| US Dollar | USD | $ |
| Euro | EUR | € |
| British Pound | GBP | £ |
| Japanese Yen | JPY | ¥ |
| Australian Dollar | AUD | A$ |
| Canadian Dollar | CAD | C$ |
| Swiss Franc | CHF | CHF |
| Chinese Yuan | CNY | ¥ |
| Singapore Dollar | SGD | S$ |

## Features in Detail

### Real-time Conversion Preview
As you type an expense amount, the app shows a live preview of the INR equivalent, helping you understand the cost before adding the expense.

### Smart Caching
Exchange rates are cached for 1 hour to:
- Reduce API calls
- Improve performance
- Work offline with recent rates
- Minimize data usage

### Responsive Design
The interface adapts to different screen sizes:
- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single-column layout with touch-friendly buttons

### Data Export
Export your expense data as CSV for:
- Importing into Excel or Google Sheets
- Creating custom reports
- Backup purposes
- Tax preparation

## Privacy & Security

- **No Account Required**: Use immediately without registration
- **Local Storage Only**: Your expense data never leaves your device
- **No Tracking**: No analytics or user tracking
- **Secure API**: Exchange rates fetched over HTTPS

## Troubleshooting

### Exchange Rates Not Loading
- Check your internet connection
- The app will use cached rates if available
- Rates are updated automatically when connection is restored

### Data Not Saving
- Ensure your browser allows localStorage
- Check if you're in private/incognito mode
- Clear browser cache if issues persist

### Mobile Display Issues
- Ensure you're using a modern mobile browser
- Try refreshing the page
- Check if JavaScript is enabled

## Future Enhancements

Potential features for future versions:
- More currency support
- Expense categories and tags
- Charts and visual analytics
- Data sync across devices
- Recurring expense tracking
- Budget setting and alerts

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Ensure you're using a supported browser
3. Try refreshing the page or clearing browser cache

---

**Made with ❤️ for expense tracking enthusiasts**

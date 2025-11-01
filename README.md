# Monthly Budget Tracker

A standalone web application for tracking monthly income and expenses using local storage.

## Features

### 📊 **Dashboard Overview**
- Real-time summary cards showing:
  - Total Income (in Indian Rupees ₹)
  - Total Expenses (in Indian Rupees ₹)
  - Net Balance (with visual indicators for positive/negative)
- Month selector to view data for different months

### 💰 **Transaction Management**
- **Quick Notes**: Rapidly capture income/expense amounts and notes without creating transactions
- Add detailed income and expense transactions with:
  - Description (optional - defaults to "No description")
  - Amount (in Indian Rupees ₹)
  - Category (automatically filtered based on income/expense type)
  - Payment Mode (Cash 💵 or Digital 💳)
  - Date
- Complete quick notes by adding full transaction details
- Edit existing transactions
- Delete transactions with confirmation
- Form validation to ensure data integrity

### 🗂️ **Categories**
**Income Categories:**
- Salary
- Freelance
- Investment
- Business
- Other Income

**Expense Categories:**
- Food & Dining
- Transportation
- Utilities
- Housing/Rent
- Healthcare
- Entertainment
- Shopping
- Education
- Insurance
- Other Expense

### 🎨 **User Interface**
- Modern, responsive tabbed design that works on desktop and mobile
- **Three main tabs**: Home, Add Transaction, Transaction History
- Clean, intuitive interface with smooth animations and tab transitions
- Visual distinction between income (green) and expenses (red)
- Hover effects and smooth transitions
- Toast notifications for user feedback

### 💾 **Data Storage & Export**
- All data stored locally in browser's localStorage
- No server required - completely standalone
- Data persists between browser sessions
- **CSV Export**: Download all transactions as a CSV file for external analysis
- Clear all data option with confirmation

### ⌨️ **Keyboard Shortcuts**
- `Ctrl+S`: Shows auto-save notification
- `Ctrl+E`: Open quick expense modal
- `Ctrl+I`: Open quick income modal
- `Escape`: Cancel edit mode or close quick modals

## Getting Started

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - No installation or server setup required

2. **Navigate Using Tabs**
   - **🏠 Home**: View monthly summary and recent transactions
   - **➕ Add Transaction**: Add new income/expense entries  
   - **📊 Transaction History**: View and manage all transactions

3. **Select Month (Home Tab)**
   - Use the month selector dropdown to choose which month to view
   - Summary cards update automatically
   - Recent transactions show last 5 entries for selected month

3. **Quick Notes (Home Tab)**
   - Click "⚡ Quick Income" button to capture income quickly
   - Click "⚡ Quick Expense" button to capture expenses quickly
   - Enter amount and optional notes
   - Date automatically set to today
   - Notes appear on Home tab for later completion
   - Click "Complete Transaction" to add full details

4. **Complete Quick Notes**
   - Click "Complete Transaction" on any quick note
   - Automatically switches to Add Transaction tab with pre-filled data
   - Add category, payment mode, and other details
   - Submit to create final transaction and remove from notes

5. **Add Detailed Transactions (Add Transaction Tab)**
   - Fill out the complete form with transaction details
   - Select income or expense type
   - Choose appropriate category
   - Select payment mode (Cash or Digital)
   - Description is optional
   - Click "Add Transaction"

6. **Manage Transactions (Transaction History Tab)**
   - Filter by specific month or view all transactions
   - Edit any transaction by clicking "Edit" (switches to Add Transaction tab)
   - Delete transactions with confirmation
   - Export all data to CSV
   - Clear all data option with confirmation

## Technical Details

### Files Structure
```
budget-tracker/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript functionality and logic
└── README.md       # Documentation (this file)
```

### Browser Compatibility
- Chrome, Firefox, Safari, Edge (modern versions)
- Requires JavaScript enabled
- Uses localStorage API

### Data Format
Data is stored in localStorage as JSON with the following structure:
```json
[
  {
    "id": "unique-id",
    "type": "income|expense",
    "description": "Transaction description",
    "amount": 123.45,
    "category": "category-name",
    "date": "YYYY-MM-DD",
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  }
]
```

## Features in Detail

### Quick Notes System
- **Dual Capture**: Separate buttons for quick income and quick expense capture
- **Home Tab Display**: Both income and expense notes shown in unified list with distinct styling
- **Two-Step Workflow**: Capture first, complete details later when convenient
- **Pre-populated Forms**: Clicking "Complete Transaction" pre-fills the add transaction form
- **Automatic Cleanup**: Completed notes are automatically removed from the list
- **Visual Design**: Blue styling for income notes, amber styling for expense notes

### CSV Export
- **One-click Export**: Download all transactions as a CSV file
- **Proper Formatting**: Includes headers and properly escaped data
- **Complete Fields**: Date, Type, Description, Category, Payment Mode, Amount
- **Date-based Filename**: Automatically names file with current date
- **Excel Compatible**: Can be opened in Excel, Google Sheets, or any spreadsheet application
- **Complete Data**: Exports all transactions across all months

### Responsive Design
- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly buttons and inputs
- Horizontal scroll for table on small screens

### Data Validation
- All fields required before submission
- Amount must be positive number
- Date validation
- Category selection based on transaction type

### Visual Feedback
- Color-coded transaction types
- Smooth animations and transitions
- Loading states and hover effects
- Success/error notifications

### Month Navigation
- Easy switching between months
- Automatic calculation updates
- Preserved form state when switching months

## Privacy & Security

- **No Data Collection**: All data stays on your device
- **No Network Requests**: Completely offline after initial load
- **No Account Required**: No registration or login needed
- **Local Storage Only**: Data stored in browser's localStorage

## Customization

The application can be easily customized by modifying:
- Categories in the HTML select options
- Colors and styling in `styles.css`
- Functionality and features in `script.js`

## Browser Storage Limits

- localStorage typically has a 5-10MB limit per domain
- This application uses minimal storage space
- Can handle thousands of transactions without issues

## Backup & Export

The application now includes comprehensive export functionality:

### CSV Export
- **Format**: Standard CSV format compatible with Excel and Google Sheets
- **Content**: All transactions with Date, Type, Description, Category, Payment Mode, and Amount
- **Filename**: Auto-generated with current date (e.g., `budget-tracker-transactions-2025-10-31.csv`)
- **Sorting**: Transactions sorted by date (newest first)
- **Data Safety**: Properly escaped special characters and quotes

### JSON Export (Developer Feature)
While the app includes JSON export functionality in the code, the CSV export is the primary user-facing feature for data backup and analysis.

## Future Enhancements

Potential features that could be added:
- Data export/import functionality
- Category-wise spending charts
- Monthly trends and analytics
- Budget setting and tracking
- Recurring transaction templates
- Search and filter functionality

## Troubleshooting

**Data Not Saving?**
- Ensure JavaScript is enabled
- Check if localStorage is available
- Try refreshing the page

**Layout Issues?**
- Ensure you're using a modern browser
- Try clearing browser cache
- Check browser console for errors

**Performance Issues?**
- Clear old data using "Clear All Data" button
- Close other browser tabs
- Restart browser if needed

---

## 🌾 Farming Tab Features

### Overview
The Budget Tracker includes a specialized **Farming Tab** designed for agricultural income tracking and analytics.

### Features
- **Fixed Filters**: Category set to "Farming" and Type set to "Income" (non-editable)
- **Editable Filters**: Subcategory and Month dropdowns
- **Two Sub-tabs**: Summary analytics and detailed transaction listing

### Summary Sub-tab
Advanced analytics with customizable grouping:
- **Group By Options**: Month, Subcategory, Unit (checkboxes)
- **Columns**: Dynamically shows selected grouping + Total Quantity + Total Amount (₹) + Average Rate (₹)
- **Calculations**: Average rate = Total Amount ÷ Total Quantity (rounded to 2 decimal places)

### Transactions Sub-tab
Detailed farming transaction listing:
- **Columns**: Date, Subcategory, Quantity, Unit, Amount (₹), Comments
- **Sorting**: Newest transactions first
- **Filtering**: Uses same filters as summary tab

### Usage
1. Create farming transactions by selecting Category "Farming" and Type "Income"
2. Complete the farming details section (Quantity, Unit, Sale Type, Comments)
3. Use the Farming tab to view analytics and detailed transaction lists
4. Filter and group data for better insights

---

**Created**: October 2025  
**Version**: 2.0 (with Farming Analytics)  
**License**: Free to use and modify
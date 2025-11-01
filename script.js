// Budget Tracker JavaScript Application
class BudgetTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.quickNotes = this.loadQuickNotes();
        this.currentMonth = this.getCurrentMonth();
        this.historyMonth = this.currentMonth;
        this.activeTab = 'home';
        this.editingId = null;
        this.completingNoteId = null;
        
        // Farming tab state
        this.farmingFilters = {
            category: 'farming',
            subcategory: '',
            month: '',
            type: 'income'
        };
        this.farmingGroupBy = {
            month: true,
            subcategory: true,
            unit: true
        };
        this.activeFarmingSubtab = 'summary';
        
        this.initializeApp();
        this.bindEvents();
        this.updateDisplay();
    }

    // Initialize the application
    initializeApp() {
        // Set current month in selector
        const monthSelect = document.getElementById('monthSelect');
        monthSelect.value = this.currentMonth;
        
        // Set current month in history selector
        const historyMonthSelect = document.getElementById('historyMonthSelect');
        historyMonthSelect.value = this.currentMonth;
        this.historyMonth = this.currentMonth;
        
        // Set today's date in the form
        const dateInput = document.getElementById('date');
        dateInput.value = new Date().toISOString().split('T')[0];
        
        // Initialize category selector
        this.updateCategoryOptions();
    }

    // Get current month in YYYY-MM format
    getCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return year + '-' + month;
    }

    // Load transactions from localStorage
    loadTransactions() {
        const stored = localStorage.getItem('budgetTrackerTransactions');
        return stored ? JSON.parse(stored) : [];
    }

    // Load quick notes from localStorage
    loadQuickNotes() {
        const stored = localStorage.getItem('budgetTrackerQuickNotes');
        return stored ? JSON.parse(stored) : [];
    }

    // Save transactions to localStorage
    saveTransactions() {
        localStorage.setItem('budgetTrackerTransactions', JSON.stringify(this.transactions));
    }

    // Save quick notes to localStorage
    saveQuickNotes() {
        localStorage.setItem('budgetTrackerQuickNotes', JSON.stringify(this.quickNotes));
    }

    // Bind events
    bindEvents() {
        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Month selector change
        document.getElementById('monthSelect').addEventListener('change', (e) => {
            this.currentMonth = e.target.value;
            this.updateDisplay();
        });

        // History month selector change
        document.getElementById('historyMonthSelect').addEventListener('change', (e) => {
            this.historyMonth = e.target.value;
            this.updateTransactionsTable();
        });

        // History filter selectors change
        document.getElementById('historyTypeSelect').addEventListener('change', () => {
            this.updateTransactionsTable();
        });

        document.getElementById('historyCategorySelect').addEventListener('change', (e) => {
            this.updateHistorySubcategoryOptions(e.target.value);
            this.updateTransactionsTable();
        });

        document.getElementById('historySubcategorySelect').addEventListener('change', () => {
            this.updateTransactionsTable();
        });

        // Clear filters button
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Type selector change (for category filtering)
        document.getElementById('type').addEventListener('change', () => {
            this.updateCategoryOptions();
        });

        // Category selector change (for subcategory filtering)
        document.getElementById('category').addEventListener('change', (e) => {
            this.updateSubcategoryOptions(e.target.value);
        });

        // Clear all data button
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Export CSV button
        document.getElementById('exportCsvBtn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Cancel edit button
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Quick expense button
        document.getElementById('quickExpenseBtn').addEventListener('click', () => {
            this.openQuickExpenseModal();
        });

        // Quick income button
        document.getElementById('quickIncomeBtn').addEventListener('click', () => {
            this.openQuickIncomeModal();
        });

        // Quick expense form
        document.getElementById('quickExpenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickExpenseSubmit();
        });

        // Quick income form
        document.getElementById('quickIncomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickIncomeSubmit();
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const expenseModal = document.getElementById('quickExpenseModal');
            const incomeModal = document.getElementById('quickIncomeModal');
            if (e.target === expenseModal) {
                expenseModal.style.display = 'none';
            }
            if (e.target === incomeModal) {
                incomeModal.style.display = 'none';
            }
        });

        // Farming subtab navigation
        document.querySelectorAll('.farming-subtab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchFarmingSubtab(e.target.dataset.subtab);
            });
        });

        // Farming filters
        document.getElementById('farmingSubcategoryFilter').addEventListener('change', () => {
            this.farmingFilters.subcategory = document.getElementById('farmingSubcategoryFilter').value;
            this.updateFarmingDisplay();
        });

        document.getElementById('farmingMonthFilter').addEventListener('change', () => {
            this.farmingFilters.month = document.getElementById('farmingMonthFilter').value;
            this.updateFarmingDisplay();
        });

        document.getElementById('farmingClearFilters').addEventListener('click', () => {
            this.clearFarmingFilters();
        });

        // Farming group by checkboxes
        document.getElementById('groupByMonth').addEventListener('change', (e) => {
            this.farmingGroupBy.month = e.target.checked;
            this.updateFarmingSummary();
        });

        document.getElementById('groupBySubcategory').addEventListener('change', (e) => {
            this.farmingGroupBy.subcategory = e.target.checked;
            this.updateFarmingSummary();
        });

        document.getElementById('groupByUnit').addEventListener('change', (e) => {
            this.farmingGroupBy.unit = e.target.checked;
            this.updateFarmingSummary();
        });
    }

    // Update display
    updateDisplay() {
        this.updateSummaryCards();
        this.updateTransactionsTable();
        this.updateQuickNotes();
    }

    // Switch tab
    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector('[data-tab="' + tabName + '"]');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(tabName + '-tab');
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Update display when switching to relevant tabs
        if (tabName === 'home' || tabName === 'history') {
            this.updateDisplay();
        } else if (tabName === 'farming') {
            this.initializeFarmingTab();
            this.updateFarmingDisplay();
        }
        
        // Reset form title when switching away from edit mode
        if (tabName !== 'add-transaction' && this.editingId) {
            this.cancelEdit();
        }
    }

    updateCategoryOptions() {
        const typeSelect = document.getElementById('type');
        const categorySelect = document.getElementById('category');
        const incomeGroup = document.getElementById('incomeCategories');
        const expenseGroup = document.getElementById('expenseCategories');

        // Reset category selection
        categorySelect.value = '';
        
        // Reset subcategory
        document.getElementById('subcategory').value = '';
        this.updateSubcategoryOptions('');

        if (typeSelect.value === 'income') {
            incomeGroup.style.display = 'block';
            expenseGroup.style.display = 'none';
        } else if (typeSelect.value === 'expense') {
            incomeGroup.style.display = 'none';
            expenseGroup.style.display = 'block';
        } else {
            incomeGroup.style.display = 'none';
            expenseGroup.style.display = 'none';
        }
        
        // Hide farming fields when category changes
        this.toggleFarmingFields('');
    }

    // Toggle farming fields based on category
    toggleFarmingFields(category) {
        const farmingFields = document.getElementById('farmingFields');
        if (farmingFields) {
            if (category === 'farming') {
                farmingFields.style.display = 'block';
            } else {
                farmingFields.style.display = 'none';
                // Clear farming fields when hidden
                this.clearFarmingFields();
            }
        }
    }

    // Clear farming fields
    clearFarmingFields() {
        document.getElementById('quantity').value = '';
        document.getElementById('farmingComments').value = '';
        
        // Clear radio buttons
        document.querySelectorAll('input[name="unit"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="saleType"]').forEach(radio => radio.checked = false);
    }

    // Update subcategory options based on selected category
    updateSubcategoryOptions(selectedCategory) {
        const subcategoryInput = document.getElementById('subcategory');
        const datalist = document.getElementById('subcategoryOptions');
        
        // Clear existing options
        datalist.innerHTML = '';
        
        if (!selectedCategory) {
            subcategoryInput.value = '';
            return;
        }

        // Toggle farming fields based on category
        this.toggleFarmingFields(selectedCategory);

        // Get unique subcategories for the selected category from existing transactions
        const subcategories = [...new Set(
            this.transactions
                .filter(t => t.category === selectedCategory && t.subcategory)
                .map(t => t.subcategory)
                .sort()
        )];

        // Populate datalist with existing subcategories
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            datalist.appendChild(option);
        });
    }

    // Update history filter options
    updateHistoryFilterOptions() {
        this.updateHistoryCategoryOptions();
        this.updateHistorySubcategoryOptions('all');
    }

    // Update category options for history filter
    updateHistoryCategoryOptions() {
        const categorySelect = document.getElementById('historyCategorySelect');
        
        // Get unique categories from all transactions
        const categories = [...new Set(this.transactions.map(t => t.category))].sort();
        
        // Clear existing options (except "All Categories")
        categorySelect.innerHTML = '<option value="all">All Categories</option>';
        
        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.formatCategory(category);
            categorySelect.appendChild(option);
        });
    }

    // Update subcategory options for history filter
    updateHistorySubcategoryOptions(selectedCategory) {
        const subcategorySelect = document.getElementById('historySubcategorySelect');
        
        // Clear existing options
        subcategorySelect.innerHTML = '<option value="all">All Subcategories</option>';
        
        if (selectedCategory === 'all') {
            // If "All Categories" selected, show all subcategories
            const allSubcategories = [...new Set(
                this.transactions
                    .filter(t => t.subcategory)
                    .map(t => t.subcategory)
                    .sort()
            )];
            
            allSubcategories.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory;
                subcategorySelect.appendChild(option);
            });
        } else {
            // Show subcategories for selected category only
            const subcategories = [...new Set(
                this.transactions
                    .filter(t => t.category === selectedCategory && t.subcategory)
                    .map(t => t.subcategory)
                    .sort()
            )];
            
            subcategories.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory;
                subcategorySelect.appendChild(option);
            });
        }
    }

    // Clear all filters
    clearAllFilters() {
        document.getElementById('historyMonthSelect').value = 'all';
        document.getElementById('historyTypeSelect').value = 'all';
        document.getElementById('historyCategorySelect').value = 'all';
        document.getElementById('historySubcategorySelect').value = 'all';
        this.updateHistorySubcategoryOptions('all');
        this.updateTransactionsTable();
    }

    // Handle form submission
    handleFormSubmit() {
        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            return;
        }

        if (this.editingId) {
            this.updateTransaction(this.editingId, formData);
            this.resetForm();
            this.switchTab('history');
        } else {
            this.addTransaction(formData);
            this.resetForm();
        }
        
        this.updateDisplay();
    }

    // Get form data
    getFormData() {
        const paymentModeElement = document.querySelector('input[name="paymentMode"]:checked');
        const data = {
            type: document.getElementById('type').value,
            description: document.getElementById('description').value.trim() || 'No description',
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value.trim(),
            paymentMode: paymentModeElement ? paymentModeElement.value : '',
            date: document.getElementById('date').value
        };

        // Add farming-specific data if category is farming
        if (data.category === 'farming') {
            const unitElement = document.querySelector('input[name="unit"]:checked');
            const saleTypeElement = document.querySelector('input[name="saleType"]:checked');
            
            data.farmingDetails = {
                quantity: parseFloat(document.getElementById('quantity').value) || 0,
                unit: unitElement ? unitElement.value : '',
                saleType: saleTypeElement ? saleTypeElement.value : '',
                comments: document.getElementById('farmingComments').value.trim() || ''
            };
        }

        return data;
    }

    // Validate form data
    validateFormData(data) {
        if (!data.type || !data.amount || !data.category || !data.paymentMode || !data.date) {
            alert('Please fill in all required fields.');
            return false;
        }

        if (data.amount <= 0) {
            alert('Amount must be greater than 0.');
            return false;
        }

        // Additional validation for farming transactions
        if (data.category === 'farming' && data.farmingDetails) {
            if (!data.farmingDetails.quantity || data.farmingDetails.quantity <= 0) {
                alert('Please enter a valid quantity for farming transaction.');
                return false;
            }
            if (!data.farmingDetails.unit) {
                alert('Please select a unit for farming transaction.');
                return false;
            }
            if (!data.farmingDetails.saleType) {
                alert('Please select a sale type for farming transaction.');
                return false;
            }
        }

        return true;
    }

    // Add new transaction
    addTransaction(data) {
        const transaction = {
            id: this.generateId(),
            ...data,
            createdAt: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        
        this.showNotification((data.type === 'income' ? 'Income' : 'Expense') + ' added successfully!', 'success');
    }

    // Update existing transaction
    updateTransaction(id, data) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions[index] = {
                ...this.transactions[index],
                ...data,
                updatedAt: new Date().toISOString(),
                isQuickEntry: false // Remove quick entry flag when edited
            };
            this.saveTransactions();
            this.showNotification('Transaction updated successfully!', 'success');
        }
    }

    // Delete transaction
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateDisplay();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
    }

    // Edit transaction
    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        // Populate form with transaction data
        document.getElementById('type').value = transaction.type;
        document.getElementById('description').value = transaction.description === 'No description' ? '' : transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('date').value = transaction.date;
        
        // Set payment mode
        const paymentModeElement = document.querySelector('input[name="paymentMode"][value="' + transaction.paymentMode + '"]');
        if (paymentModeElement) {
            paymentModeElement.checked = true;
        }
        
        // Update category options and set category
        this.updateCategoryOptions();
        document.getElementById('category').value = transaction.category;
        
        // Update subcategory options and set subcategory
        this.updateSubcategoryOptions(transaction.category);
        document.getElementById('subcategory').value = transaction.subcategory || '';

        // Populate farming fields if it's a farming transaction
        if (transaction.category === 'farming' && transaction.farmingDetails) {
            document.getElementById('quantity').value = transaction.farmingDetails.quantity || '';
            document.getElementById('farmingComments').value = transaction.farmingDetails.comments || '';
            
            // Set unit radio button
            if (transaction.farmingDetails.unit) {
                const unitElement = document.querySelector('input[name="unit"][value="' + transaction.farmingDetails.unit + '"]');
                if (unitElement) unitElement.checked = true;
            }
            
            // Set sale type radio button
            if (transaction.farmingDetails.saleType) {
                const saleTypeElement = document.querySelector('input[name="saleType"][value="' + transaction.farmingDetails.saleType + '"]');
                if (saleTypeElement) saleTypeElement.checked = true;
            }
        }

        // Show cancel button and update form title
        document.getElementById('cancelEdit').style.display = 'inline-block';
        document.querySelector('.form-container h2').textContent = 'Edit Transaction';
        
        this.editingId = id;
        
        // Switch to add transaction tab for editing
        this.switchTab('add-transaction');
        
        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }

    // Cancel edit
    cancelEdit() {
        this.resetForm();
        document.getElementById('cancelEdit').style.display = 'none';
        document.querySelector('.form-container h2').textContent = 'Add New Transaction';
        this.editingId = null;
    }

    // Reset form
    resetForm() {
        document.getElementById('transactionForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        this.updateCategoryOptions();
        
        // Clear payment mode selection
        const paymentModeElements = document.querySelectorAll('input[name="paymentMode"]');
        paymentModeElements.forEach(element => element.checked = false);
        
        // Clear subcategory field and options
        document.getElementById('subcategory').value = '';
        this.updateSubcategoryOptions('');
        
        // Clear farming fields
        this.clearFarmingFields();
        
        this.editingId = null;
        this.completingNoteId = null;
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all data including quick notes? This action cannot be undone.')) {
            this.transactions = [];
            this.quickNotes = [];
            this.saveTransactions();
            this.saveQuickNotes();
            this.updateDisplay();
            this.showNotification('All data cleared successfully!', 'success');
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get transactions for current month
    getTransactionsForMonth(month) {
        return this.transactions.filter(t => t.date.startsWith(month));
    }

    // Update summary cards
    updateSummaryCards() {
        const currentTransactions = this.getTransactionsForMonth(this.currentMonth);
        const income = currentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = currentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;

        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(expenses);
        
        const netBalanceEl = document.getElementById('netBalance');
        netBalanceEl.textContent = this.formatCurrency(balance);
        netBalanceEl.className = balance >= 0 ? 'positive' : 'negative';
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    }

    // Format category for display
    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format month for display (e.g., "2024-11" -> "November 2024")
    formatMonthDisplay(monthString) {
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long'
        });
    }

    // Update transactions table
    updateTransactionsTable() {
        const tbody = document.getElementById('transactionsBody');
        let filteredTransactions = this.transactions;

        // Apply month filter
        const monthFilter = document.getElementById('historyMonthSelect').value;
        if (monthFilter && monthFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.date.startsWith(monthFilter));
        }

        // Apply type filter
        const typeFilter = document.getElementById('historyTypeSelect').value;
        if (typeFilter && typeFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
        }

        // Apply category filter
        const categoryFilter = document.getElementById('historyCategorySelect').value;
        if (categoryFilter && categoryFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
        }

        // Apply subcategory filter
        const subcategoryFilter = document.getElementById('historySubcategorySelect').value;
        if (subcategoryFilter && subcategoryFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.subcategory === subcategoryFilter);
        }

        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = filteredTransactions.map(transaction => this.createTransactionRow(transaction)).join('');

        // Update no data message
        const noDataMessage = document.querySelector('.no-transactions');
        if (noDataMessage) {
            noDataMessage.style.display = filteredTransactions.length === 0 ? 'block' : 'none';
        }

        // Update filter options when data changes
        this.updateHistoryFilterOptions();
    }

    // Create transaction row HTML
    createTransactionRow(transaction) {
        const formattedDate = this.formatDate(transaction.date);
        const formattedAmount = this.formatCurrency(transaction.amount);
        const rowClass = transaction.type === 'income' ? 'income-row' : 'expense-row';
        const amountClass = transaction.type === 'income' ? 'amount-income' : 'amount-expense';
        const typeClass = transaction.type === 'income' ? 'type-income' : 'type-expense';
        const paymentModeIcon = transaction.paymentMode === 'cash' ? '💵' : '💳';
        const paymentModeText = transaction.paymentMode === 'cash' ? 'Cash' : 'Digital';
        
        // Add quick entry indicator
        const quickEntryIndicator = transaction.isQuickEntry ? ' <span class="quick-entry-badge">⚡</span>' : '';
        
        // Format farming details if available
        let farmingInfo = '';
        if (transaction.category === 'farming' && transaction.farmingDetails) {
            const details = transaction.farmingDetails;
            farmingInfo = '<br><small class="farming-details">' +
                '🚜 ' + details.quantity + ' ' + details.unit + ' | ' +
                this.formatSaleType(details.saleType) +
                (details.comments ? ' | ' + this.escapeHtml(details.comments) : '') +
                '</small>';
        }
        
        return '<tr class="' + rowClass + ' fade-in">' +
            '<td>' + formattedDate + '</td>' +
            '<td><span class="type-badge ' + typeClass + '">' + transaction.type + '</span></td>' +
            '<td>' + this.formatCategory(transaction.category) + farmingInfo + '</td>' +
            '<td>' + this.escapeHtml(transaction.subcategory || '') + quickEntryIndicator + '</td>' +
            '<td><span class="payment-mode">' + paymentModeIcon + ' ' + paymentModeText + '</span></td>' +
            '<td class="' + amountClass + '">' + formattedAmount + '</td>' +
            '<td>' +
                '<button class="btn-edit" onclick="budgetTracker.editTransaction(\'' + transaction.id + '\')">' +
                    'Edit' +
                '</button>' +
                '<button class="btn-delete" onclick="budgetTracker.deleteTransaction(\'' + transaction.id + '\')">' +
                    'Delete' +
                '</button>' +
            '</td>' +
        '</tr>';
    }

    // Format sale type for display
    formatSaleType(saleType) {
        if (!saleType) return '';
        return saleType.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'success' ? '#10b981' : 
                           type === 'error' ? '#ef4444' : 
                           type === 'warning' ? '#f59e0b' : '#3b82f6'
        });
        
        // Add to page
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Quick expense functions
    openQuickExpenseModal() {
        document.getElementById('quickExpenseModal').style.display = 'block';
        document.getElementById('quickAmount').focus();
    }

    closeQuickExpenseModal() {
        document.getElementById('quickExpenseModal').style.display = 'none';
        document.getElementById('quickExpenseForm').reset();
    }

    openQuickIncomeModal() {
        document.getElementById('quickIncomeModal').style.display = 'block';
        document.getElementById('quickIncomeAmount').focus();
    }

    closeQuickIncomeModal() {
        document.getElementById('quickIncomeModal').style.display = 'none';
        document.getElementById('quickIncomeForm').reset();
    }

    handleQuickExpenseSubmit() {
        const amount = parseFloat(document.getElementById('quickAmount').value);
        const description = document.getElementById('quickDescription').value.trim() || 'Quick expense';

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const quickNote = {
            id: this.generateId(),
            type: 'expense',
            amount: amount,
            description: description,
            createdAt: new Date().toISOString()
        };

        this.quickNotes.push(quickNote);
        this.saveQuickNotes();
        this.updateQuickNotes();
        this.closeQuickExpenseModal();
        
        this.showNotification('Quick expense note added!', 'success');
    }

    handleQuickIncomeSubmit() {
        const amount = parseFloat(document.getElementById('quickIncomeAmount').value);
        const description = document.getElementById('quickIncomeDescription').value.trim() || 'Quick income';

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const quickNote = {
            id: this.generateId(),
            type: 'income',
            amount: amount,
            description: description,
            createdAt: new Date().toISOString()
        };

        this.quickNotes.push(quickNote);
        this.saveQuickNotes();
        this.updateQuickNotes();
        this.closeQuickIncomeModal();
        
        this.showNotification('Quick income note added!', 'success');
    }

    // Update quick notes display
    updateQuickNotes() {
        const notesList = document.getElementById('quickExpenseNotesList');
        const noNotesMessage = document.getElementById('noQuickNotes');

        if (this.quickNotes.length === 0) {
            notesList.innerHTML = '';
            noNotesMessage.style.display = 'block';
            return;
        }

        noNotesMessage.style.display = 'none';
        
        // Sort by creation time (newest first)
        const sortedNotes = [...this.quickNotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        notesList.innerHTML = sortedNotes.map(note => {
            const noteClass = note.type === 'income' ? 'quick-income-note' : 'quick-expense-note';
            const icon = note.type === 'income' ? '💰' : '💸';
            
            return '<div class="quick-note-item ' + noteClass + '">' +
                '<div class="quick-note-content">' +
                    '<div class="quick-note-header">' +
                        '<span class="quick-note-icon">' + icon + '</span>' +
                        '<span class="quick-note-amount">' + this.formatCurrency(note.amount) + '</span>' +
                        '<span class="quick-note-type">(' + note.type + ')</span>' +
                    '</div>' +
                    '<div class="quick-note-description">' + this.escapeHtml(note.description) + '</div>' +
                    '<div class="quick-note-time">' + this.formatDate(note.createdAt.split('T')[0]) + '</div>' +
                '</div>' +
                '<div class="quick-note-actions">' +
                    '<button class="btn-complete-note" onclick="budgetTracker.completeQuickNote(\'' + note.id + '\')" title="Convert to Transaction">' +
                        '✓' +
                    '</button>' +
                    '<button class="btn-delete-note" onclick="budgetTracker.deleteQuickNote(\'' + note.id + '\', \'' + note.type + '\')" title="Delete Note">' +
                        '🗑️' +
                    '</button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    // Complete quick note (convert to transaction)
    completeQuickNote(noteId) {
        const note = this.quickNotes.find(n => n.id === noteId);
        if (!note) return;

        // Pre-fill the transaction form
        document.getElementById('type').value = note.type;
        document.getElementById('amount').value = note.amount;
        document.getElementById('description').value = note.description;
        document.getElementById('date').value = new Date().toISOString().split('T')[0];

        // Update category options
        this.updateCategoryOptions();

        // Set editing mode for quick note completion
        this.completingNoteId = noteId;

        // Switch to transaction form
        this.switchTab('add-transaction');

        // Show a message
        this.showNotification('Complete the ' + note.type + ' transaction details below', 'info');
        
        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete quick note
    deleteQuickNote(noteId, noteType) {
        if (confirm('Are you sure you want to delete this quick ' + noteType + ' note?')) {
            this.quickNotes = this.quickNotes.filter(n => n.id !== noteId);
            this.saveQuickNotes();
            this.updateQuickNotes();
            this.showNotification('Quick ' + noteType + ' note deleted!', 'success');
        }
    }

    // Export data as CSV
    exportToCSV() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to export!', 'error');
            return;
        }

        // CSV headers
        const headers = ['Date', 'Type', 'Description', 'Category', 'Subcategory', 'Payment Mode', 'Amount (₹)', 'Farming Quantity', 'Farming Unit', 'Sale Type', 'Farming Comments'];
        
        // Convert transactions to CSV format
        const csvData = this.transactions.map(transaction => {
            const baseData = [
                transaction.date,
                transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
                '"' + transaction.description.replace(/"/g, '""') + '"', // Escape quotes in description
                this.formatCategory(transaction.category),
                '"' + (transaction.subcategory || '').replace(/"/g, '""') + '"', // Escape quotes in subcategory
                transaction.paymentMode ? transaction.paymentMode.charAt(0).toUpperCase() + transaction.paymentMode.slice(1) : 'Cash',
                transaction.amount.toFixed(2)
            ];

            // Add farming details if available
            if (transaction.category === 'farming' && transaction.farmingDetails) {
                const farming = transaction.farmingDetails;
                baseData.push(
                    farming.quantity || '',
                    farming.unit || '',
                    this.formatSaleType(farming.saleType) || '',
                    '"' + (farming.comments || '').replace(/"/g, '""') + '"'
                );
            } else {
                baseData.push('', '', '', ''); // Empty farming columns for non-farming transactions
            }

            return baseData;
        });

        // Sort by date (newest first)
        csvData.sort((a, b) => new Date(b[0]) - new Date(a[0]));

        // Combine headers and data
        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            
            // Generate filename with current date
            const today = new Date().toISOString().split('T')[0];
            link.setAttribute('download', 'budget-tracker-transactions-' + today + '.csv');
            
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Exported ' + this.transactions.length + ' transactions to CSV!', 'success');
        } else {
            this.showNotification('CSV export not supported in this browser', 'error');
        }
    }

    // Export all data as JSON
    exportData() {
        const data = {
            transactions: this.transactions,
            quickNotes: this.quickNotes,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'budget-tracker-export-' + new Date().toISOString().split('T')[0] + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import data from JSON file
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.transactions && Array.isArray(data.transactions)) {
                    if (confirm('This will replace all existing data. Are you sure?')) {
                        this.transactions = data.transactions;
                        this.quickNotes = data.quickNotes || [];
                        this.saveTransactions();
                        this.saveQuickNotes();
                        this.updateDisplay();
                        this.showNotification('Data imported successfully!', 'success');
                    }
                } else {
                    this.showNotification('Invalid file format!', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Farming Tab Methods
    initializeFarmingTab() {
        // Populate month filter
        this.populateFarmingMonthFilter();
        
        // Populate subcategory filter
        this.populateFarmingSubcategoryFilter();
    }

    populateFarmingMonthFilter() {
        const monthSelect = document.getElementById('farmingMonthFilter');
        const farmingTransactions = this.getFarmingTransactions();
        
        // Get unique months from farming transactions
        const months = [...new Set(farmingTransactions.map(t => t.date.substring(0, 7)))].sort().reverse();
        
        // Clear existing options except "All Months"
        monthSelect.innerHTML = '<option value="">All Months</option>';
        
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = this.formatMonthDisplay(month);
            monthSelect.appendChild(option);
        });
    }

    populateFarmingSubcategoryFilter() {
        const subcategorySelect = document.getElementById('farmingSubcategoryFilter');
        const farmingTransactions = this.getFarmingTransactions();
        
        // Get unique subcategories from farming transactions
        const subcategories = [...new Set(farmingTransactions
            .map(t => t.subcategory)
            .filter(sub => sub && sub.trim() !== '')
        )].sort();
        
        // Clear existing options except "All Subcategories"
        subcategorySelect.innerHTML = '<option value="">All Subcategories</option>';
        
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }

    getFarmingTransactions() {
        return this.transactions.filter(t => 
            t.category === 'farming' && 
            t.type === 'income' &&
            t.farmingDetails
        );
    }

    switchFarmingSubtab(subtabName) {
        this.activeFarmingSubtab = subtabName;
        
        // Update subtab buttons
        document.querySelectorAll('.farming-subtab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector('[data-subtab="' + subtabName + '"]');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update subtab content
        document.querySelectorAll('.farming-subtab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById('farming-' + subtabName + '-subtab');
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Update display for the active subtab
        if (subtabName === 'summary') {
            this.updateFarmingSummary();
        } else if (subtabName === 'transactions') {
            this.updateFarmingTransactions();
        }
    }

    clearFarmingFilters() {
        this.farmingFilters.subcategory = '';
        this.farmingFilters.month = '';
        
        document.getElementById('farmingSubcategoryFilter').value = '';
        document.getElementById('farmingMonthFilter').value = '';
        
        this.updateFarmingDisplay();
    }

    updateFarmingDisplay() {
        if (this.activeFarmingSubtab === 'summary') {
            this.updateFarmingSummary();
        } else if (this.activeFarmingSubtab === 'transactions') {
            this.updateFarmingTransactions();
        }
    }

    getFilteredFarmingTransactions() {
        let filtered = this.getFarmingTransactions();
        
        // Apply subcategory filter
        if (this.farmingFilters.subcategory) {
            filtered = filtered.filter(t => t.subcategory === this.farmingFilters.subcategory);
        }
        
        // Apply month filter
        if (this.farmingFilters.month) {
            filtered = filtered.filter(t => t.date.startsWith(this.farmingFilters.month));
        }
        
        return filtered;
    }

    updateFarmingSummary() {
        const filtered = this.getFilteredFarmingTransactions();
        const tbody = document.querySelector('#farmingSummaryTable tbody');
        const noDataDiv = document.getElementById('noFarmingSummary');
        
        if (filtered.length === 0) {
            tbody.innerHTML = '';
            noDataDiv.style.display = 'block';
            document.querySelector('#farmingSummaryTable').style.display = 'none';
            return;
        }
        
        // Group transactions based on selected groupBy options
        const grouped = this.groupFarmingTransactions(filtered);
        
        // Update table headers based on groupBy selection
        this.updateFarmingSummaryHeaders();
        
        // Generate table rows
        tbody.innerHTML = '';
        Object.entries(grouped).forEach(([key, transactions]) => {
            const row = this.createFarmingSummaryRow(key, transactions);
            tbody.appendChild(row);
        });
        
        noDataDiv.style.display = 'none';
        document.querySelector('#farmingSummaryTable').style.display = 'table';
    }

    groupFarmingTransactions(transactions) {
        const grouped = {};
        
        transactions.forEach(t => {
            let key = [];
            
            if (this.farmingGroupBy.month) {
                key.push(this.formatMonthDisplay(t.date.substring(0, 7)));
            }
            if (this.farmingGroupBy.subcategory) {
                key.push(t.subcategory || 'No Subcategory');
            }
            if (this.farmingGroupBy.unit) {
                key.push(t.farmingDetails.unit || 'No Unit');
            }
            
            const keyStr = key.join(' | ');
            
            if (!grouped[keyStr]) {
                grouped[keyStr] = [];
            }
            grouped[keyStr].push(t);
        });
        
        return grouped;
    }

    updateFarmingSummaryHeaders() {
        const thead = document.querySelector('#farmingSummaryTable thead tr');
        thead.innerHTML = '';
        
        if (this.farmingGroupBy.month) {
            thead.innerHTML += '<th>Month</th>';
        }
        if (this.farmingGroupBy.subcategory) {
            thead.innerHTML += '<th>Subcategory</th>';
        }
        if (this.farmingGroupBy.unit) {
            thead.innerHTML += '<th>Unit</th>';
        }
        
        thead.innerHTML += '<th>Total Quantity</th>';
        thead.innerHTML += '<th>Total Amount (₹)</th>';
        thead.innerHTML += '<th>Average Rate (₹)</th>';
    }

    createFarmingSummaryRow(key, transactions) {
        const row = document.createElement('tr');
        const keyParts = key.split(' | ');
        let keyIndex = 0;
        
        // Add group by columns
        if (this.farmingGroupBy.month) {
            const cell = document.createElement('td');
            cell.textContent = keyParts[keyIndex++] || '';
            row.appendChild(cell);
        }
        if (this.farmingGroupBy.subcategory) {
            const cell = document.createElement('td');
            cell.textContent = keyParts[keyIndex++] || '';
            row.appendChild(cell);
        }
        if (this.farmingGroupBy.unit) {
            const cell = document.createElement('td');
            cell.textContent = keyParts[keyIndex++] || '';
            row.appendChild(cell);
        }
        
        // Calculate totals
        const totalQuantity = transactions.reduce((sum, t) => sum + (parseFloat(t.farmingDetails.quantity) || 0), 0);
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        const averageRate = totalQuantity > 0 ? (totalAmount / totalQuantity) : 0;
        
        // Total Quantity
        const quantityCell = document.createElement('td');
        quantityCell.textContent = totalQuantity.toFixed(2);
        row.appendChild(quantityCell);
        
        // Total Amount
        const amountCell = document.createElement('td');
        amountCell.textContent = '₹' + totalAmount.toFixed(2);
        row.appendChild(amountCell);
        
        // Average Rate
        const rateCell = document.createElement('td');
        rateCell.textContent = '₹' + averageRate.toFixed(2);
        row.appendChild(rateCell);
        
        return row;
    }

    updateFarmingTransactions() {
        const filtered = this.getFilteredFarmingTransactions();
        const tbody = document.querySelector('#farmingTransactionsTable tbody');
        const noDataDiv = document.getElementById('noFarmingTransactions');
        
        if (filtered.length === 0) {
            tbody.innerHTML = '';
            noDataDiv.style.display = 'block';
            document.querySelector('#farmingTransactionsTable').style.display = 'none';
            return;
        }
        
        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = '';
        filtered.forEach(transaction => {
            const row = this.createFarmingTransactionRow(transaction);
            tbody.appendChild(row);
        });
        
        noDataDiv.style.display = 'none';
        document.querySelector('#farmingTransactionsTable').style.display = 'table';
    }

    createFarmingTransactionRow(transaction) {
        const row = document.createElement('tr');
        
        // Date
        const dateCell = document.createElement('td');
        dateCell.textContent = this.formatDate(transaction.date);
        row.appendChild(dateCell);
        
        // Subcategory
        const subcategoryCell = document.createElement('td');
        subcategoryCell.textContent = transaction.subcategory || '-';
        row.appendChild(subcategoryCell);
        
        // Quantity
        const quantityCell = document.createElement('td');
        quantityCell.textContent = transaction.farmingDetails.quantity || '-';
        row.appendChild(quantityCell);
        
        // Unit
        const unitCell = document.createElement('td');
        unitCell.textContent = transaction.farmingDetails.unit || '-';
        row.appendChild(unitCell);
        
        // Amount
        const amountCell = document.createElement('td');
        amountCell.textContent = '₹' + transaction.amount.toFixed(2);
        row.appendChild(amountCell);
        
        // Comments
        const commentsCell = document.createElement('td');
        commentsCell.textContent = transaction.farmingDetails.comments || '-';
        row.appendChild(commentsCell);
        
        return row;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetTracker = new BudgetTracker();
});
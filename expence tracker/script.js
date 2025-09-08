class ExpenseTracker {
  constructor() {
    this.expenses = this.loadExpenses();
    this.selectedCategory = 'all';
    this.initializeEventListeners();
    this.updateDisplay();
  }

  // Load expenses from localStorage
  loadExpenses() {
    const stored = localStorage.getItem('expenses');
    return stored ? JSON.parse(stored) : [];
  }

  // Save expenses to localStorage
  saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Add new expense
  addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;

    // Validation
    if (!amount || amount <= 0) {
      this.showToast('Please enter a valid amount', 'error');
      return;
    }

    if (!description) {
      this.showToast('Please enter a description', 'error');
      return;
    }

    // Create expense object
    const expense = {
      id: this.generateId(),
      amount: amount,
      description: description,
      category: category,
      date: new Date().toISOString()
    };

    // Add to expenses array
    this.expenses.unshift(expense);
    this.saveExpenses();
    this.updateDisplay();
    this.clearForm();
    this.showToast('Expense added successfully!');
  }

  // Delete expense
  deleteExpense(id) {
    this.expenses = this.expenses.filter(expense => expense.id !== id);
    this.saveExpenses();
    this.updateDisplay();
    this.showToast('Expense deleted successfully!');
  }

  // Clear form inputs
  clearForm() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').selectedIndex = 0;
  }

  // Get filtered expenses
  getFilteredExpenses() {
    if (this.selectedCategory === 'all') {
      return this.expenses;
    }
    return this.expenses.filter(expense => expense.category === this.selectedCategory);
  }

  // Calculate total expenses
  getTotalExpenses() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  // Calculate current month expenses
  getCurrentMonthExpenses() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth &&
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  }

  // Get active categories count
  getActiveCategoriesCount() {
    const categories = new Set(this.expenses.map(expense => expense.category));
    return categories.size;
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get category emoji
  getCategoryEmoji(category) {
    const emojis = {
      'Food': '🍔',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '💡',
      'Healthcare': '🏥',
      'Education': '📚',
      'Other': '📦'
    };
    return emojis[category] || '📦';
  }

  // Update summary cards
  updateSummaryCards() {
    document.getElementById('total-amount').textContent =
      this.formatCurrency(this.getTotalExpenses());

    document.getElementById('month-amount').textContent =
      this.formatCurrency(this.getCurrentMonthExpenses());

    document.getElementById('category-count').textContent =
      this.getActiveCategoriesCount();
  }

  // Update expenses list
  updateExpensesList() {
    const expensesList = document.getElementById('expenses-list');
    const filteredExpenses = this.getFilteredExpenses();

    if (filteredExpenses.length === 0) {
      expensesList.innerHTML = `
        <div class="no-expenses">
          <p>No expenses found. Add your first expense above!</p>
        </div>
      `;
      return;
    }

    expensesList.innerHTML = filteredExpenses
      .map(expense => `
        <div class="expense-item">
          <div class="expense-details">
            <div class="expense-category">
              ${this.getCategoryEmoji(expense.category)} ${expense.category}
            </div>
            <div class="expense-description">${expense.description}</div>
            <div class="expense-date">${this.formatDate(expense.date)}</div>
          </div>
          <div class="expense-amount">-${this.formatCurrency(expense.amount)}</div>
          <button class="delete-btn" onclick="expenseTracker.deleteExpense('${expense.id}')">
            Delete
          </button>
        </div>
      `)
      .join('');
  }

  // Update filter buttons
  updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === this.selectedCategory);
    });
  }

  // Update all displays
  updateDisplay() {
    this.updateSummaryCards();
    this.updateExpensesList();
    this.updateFilterButtons();
  }

  // Show toast message
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Add expense button
    document.getElementById('add-expense').addEventListener('click', () => this.addExpense());

    // Enter key in inputs
    document.querySelectorAll('#amount, #description').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addExpense();
        }
      });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.category;
        this.updateDisplay();
      });
    });
  }
}

// Initialize app
const expenseTracker = new ExpenseTracker();

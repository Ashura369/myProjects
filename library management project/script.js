// Helpers for localStorage
function getBooks() {
  return JSON.parse(localStorage.getItem('books') || '[]');
}
function saveBooks(books) {
  localStorage.setItem('books', JSON.stringify(books));
}

// Render all books
function renderBooks() {
  const books = getBooks();
  const booksList = document.getElementById('books-list');
  booksList.innerHTML = '';
  books.forEach((book, i) => {
    const card = document.createElement('div');
    card.className = 'book-card' + (book.status === 'Borrowed' ? ' borrowed' : '');
    const details = document.createElement('div');
    details.className = 'book-details';
    details.innerHTML = `
      <span class="book-title">${book.title}</span>
      <span class="book-meta">Author: ${book.author}</span>
      <span class="book-meta">Year: ${book.year}</span>
      <span class="book-meta">Status: ${book.status}</span>
    `;
    card.appendChild(details);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'book-actions';
    // Borrow/Return button
    if (book.status === 'Available') {
      const borrowBtn = document.createElement('button');
      borrowBtn.className = 'borrow-btn';
      borrowBtn.textContent = 'Borrow';
      borrowBtn.onclick = () => borrowBook(i);
      actions.appendChild(borrowBtn);
    } else {
      const returnBtn = document.createElement('button');
      returnBtn.className = 'return-btn';
      returnBtn.textContent = 'Return';
      returnBtn.onclick = () => returnBook(i);
      actions.appendChild(returnBtn);
    }
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteBook(i);
    actions.appendChild(delBtn);

    card.appendChild(actions);
    booksList.appendChild(card);
  });
}

// Add a new book
document.getElementById('book-form').onsubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const year = document.getElementById('year').value.trim();
  if (!title || !author || !year) return;
  const books = getBooks();
  books.push({
    title,
    author,
    year,
    status: 'Available'
  });
  saveBooks(books);
  this.reset();
  renderBooks();
};

// Borrow a book
function borrowBook(idx) {
  const books = getBooks();
  books[idx].status = 'Borrowed';
  saveBooks(books);
  renderBooks();
}

// Return a book
function returnBook(idx) {
  const books = getBooks();
  books[idx].status = 'Available';
  saveBooks(books);
  renderBooks();
}

// Delete a book
function deleteBook(idx) {
  const books = getBooks();
  books.splice(idx, 1);
  saveBooks(books);
  renderBooks();
}

renderBooks();
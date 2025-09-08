// Get DOM elements
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');

// Load habits from localStorage
function getHabits() {
  return JSON.parse(localStorage.getItem('habits') || '[]');
}

// Save habits to localStorage
function saveHabits(habits) {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Render habits to the list
function renderHabits() {
  const habits = getHabits();
  habitList.innerHTML = '';
  habits.forEach((habit, i) => {
    const li = document.createElement('li');
    if (habit.completed) li.classList.add('completed');
    const left = document.createElement('span');
    left.className = 'li-left';
    left.innerHTML = `
      <button class="complete-btn" onclick="toggleHabit(${i})">${habit.completed ? "✓" : " "}</button>
      ${habit.name}
    `;
    li.appendChild(left);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteHabit(i);
    li.appendChild(delBtn);

    habitList.appendChild(li);
  });
}

// Add a new habit
habitForm.onsubmit = (e) => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;
  const habits = getHabits();
  habits.push({ name, completed: false });
  saveHabits(habits);
  habitInput.value = '';
  renderHabits();
};

// Mark habit as complete/incomplete
window.toggleHabit = function(index) {
  const habits = getHabits();
  habits[index].completed = !habits[index].completed;
  saveHabits(habits);
  renderHabits();
};

// Delete habit
function deleteHabit(index) {
  const habits = getHabits();
  habits.splice(index, 1);
  saveHabits(habits);
  renderHabits();
}

renderHabits();
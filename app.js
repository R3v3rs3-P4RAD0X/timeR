const entries = JSON.parse(localStorage.getItem('entries') || '[]');

function saveEntries() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

function computeHours(entry) {
  const start = new Date(`${entry.date}T${entry.start}`);
  const finish = new Date(`${entry.date}T${entry.finish}`);
  let diff = (finish - start) / 3600000; // hours
  if (entry.lunch) diff -= 0.5;
  return diff;
}

document.getElementById('entry-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const entry = {
    date: document.getElementById('date').value,
    start: document.getElementById('start').value,
    finish: document.getElementById('finish').value,
    lunch: document.getElementById('lunch').checked,
    description: document.getElementById('description').value,
  };
  entries.push(entry);
  saveEntries();
  e.target.reset();
});

function displayEntries(from, to) {
  const tbody = document.querySelector('#entries-table tbody');
  tbody.innerHTML = '';
  let total = 0;
  entries.forEach((e) => {
    const entryDate = new Date(e.date);
    if (entryDate >= from && entryDate <= to) {
      const hrs = computeHours(e);
      total += hrs;
      const row = document.createElement('tr');
      row.innerHTML = `<td>${e.date}</td><td>${e.start}</td><td>${e.finish}</td><td>${e.lunch ? 'Yes' : 'No'}</td><td>${hrs.toFixed(2)}</td><td>${e.description}</td>`;
      tbody.appendChild(row);
    }
  });
  document.getElementById('total-hours').textContent = total.toFixed(2);
}

document.getElementById('search-btn').addEventListener('click', () => {
  const from = new Date(document.getElementById('from-date').value);
  const to = new Date(document.getElementById('to-date').value);
  if (!isNaN(from) && !isNaN(to)) {
    displayEntries(from, to);
  }
});

document.querySelectorAll('button[data-range]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const today = new Date();
    let from, to;
    if (btn.dataset.range === 'last-week') {
      to = new Date(today);
      from = new Date(today);
      from.setDate(from.getDate() - 7);
    } else if (btn.dataset.range === 'last-month') {
      to = new Date(today);
      from = new Date(today);
      from.setMonth(from.getMonth() - 1);
    }
    displayEntries(from, to);
  });
});

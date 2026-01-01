'use strict';

const tbody = document.querySelector('tbody');
let activeRow = null;

tbody.addEventListener('click', (e) => {
  if (e.target.closest('button, a')) {
    return;
  }

  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (row === activeRow) {
    activeRow.classList.remove('active');
    activeRow = null;

    return;
  }

  row.classList.add('active');
  activeRow = row;
});

const thead = document.querySelector('thead');
const sortState = { key: null, dir: 'asc' };

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const thKey = th.dataset.key;

  if (!thKey) {
    return;
  }

  if (thKey === sortState.key) {
    sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = thKey;
    sortState.dir = 'asc';
  }

  const rows = getDataFromDom();

  const sorted = rows
    .slice()
    .sort((a, b) => compare(a, b, sortState.key, sortState.dir));

  renderTableFromData(sorted);
});

function compare(a, b, key, dir = 'asc') {
  const va = a[key];
  const vb = b[key];
  const aNum = Number(va);
  const bNum = Number(vb);
  let result;

  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    result = aNum - bNum;
  } else {
    result = String(va).localeCompare(String(vb), undefined, { numeric: true });
  }

  return dir === 'asc' ? result : -result;
}

function getDataFromDom() {
  const rows = [];
  const trList = tbody.querySelectorAll('tr');

  trList.forEach((tr) => {
    const tds = tr.querySelectorAll('td');

    if (tds.length >= 5) {
      const fullName = tds[0].textContent.trim();
      const position = tds[1].textContent.trim();
      const office = tds[2].textContent.trim();
      const age = tds[3].textContent.trim();
      const cleanedAge = age.replace(/[^\d.-]/g, '');
      const salary = tds[4].textContent.trim();
      const cleanedSalary = salary.replace(/[^\d.-]/g, '');

      rows.push({
        id: tr.dataset.id,
        fullName,
        position,
        office,
        age: Number(cleanedAge),
        salary: Number(cleanedSalary),
      });
    }
  });

  return rows;
}

function renderTableFromData(data) {
  const activeRowId = activeRow?.dataset?.id;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  data.forEach((item) => {
    const tr = document.createElement('tr');

    if (item.id != null) {
      tr.dataset.id = item.id;
    }

    const tdName = document.createElement('td');

    tdName.textContent = item.fullName;

    tr.appendChild(tdName);

    const tdPosition = document.createElement('td');

    tdPosition.textContent = item.position;

    tr.appendChild(tdPosition);

    const tdOffice = document.createElement('td');

    tdOffice.textContent = item.office;

    tr.appendChild(tdOffice);

    const tdAge = document.createElement('td');

    tdAge.textContent = item.age ?? '';

    tr.appendChild(tdAge);

    const tdSalary = document.createElement('td');

    tdSalary.textContent = item.salary ?? '';

    tr.appendChild(tdSalary);

    tbody.appendChild(tr);
  });

  if (!activeRowId) {
    return;
  }

  const restored = tbody.querySelector(`tr[data-id="${activeRowId}"]`);

  if (restored) {
    restored.classList.add('active');
    activeRow = restored;
  } else {
    activeRow = null;
  }
}

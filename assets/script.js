const localBooksDataKey = 'BooksData';
const bookForm = document.getElementById('book-form');
const searchForm = document.getElementById('search-form');
const finishedReadingList = document.querySelector(
  '.finished-list-container > .list-item-container'
);
const currentlyReadingList = document.querySelector(
  '.unfinished-list-container > .list-item-container'
);

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('writer').value = '';
  document.getElementById('year').value = '';
  document
    .getElementsByName('reading-status')
    .forEach((option) => (option.checked = false));
}

function clearCurrentBookList() {
  finishedReadingList.innerHTML = '';
  currentlyReadingList.innerHTML = '';
}

function getLocalBookData() {
  return JSON.parse(localStorage.getItem(localBooksDataKey));
}

function getFormData() {
  const inputTitle = document.getElementById('title').value;
  const inputWriter = document.getElementById('writer').value;
  const inputYear = Number(document.getElementById('year').value);
  const isFinishedReadingRadioGroup =
    document.getElementsByName('reading-status');
  let inputIsFinishedReading = null;

  for (const option of isFinishedReadingRadioGroup) {
    if (option.checked) {
      inputIsFinishedReading = true;
    } else {
      inputIsFinishedReading = false;
    }
  }

  const newBookData = {
    id: +new Date(),
    title: inputTitle,
    writer: inputWriter,
    year: inputYear,
    isComplete: inputIsFinishedReading,
  };

  return newBookData;
}

function searchBookData() {
  const keyword = (document.getElementById('search-box').value).toLowerCase();
  const booksData = getLocalBookData();
  const searchResult = booksData.filter((data) =>
    (data.title).toLowerCase().includes(keyword) || (data.writer).toLowerCase().includes(keyword)
  );

  if (searchResult.length === 0) {
    return alert('Data tidak ditemukan...');
    
  }

  renderBookList(searchResult)
}

function storeBookData(data) {
  let booksData = [];

  if (localStorage.getItem(localBooksDataKey) !== null) {
    booksData = getLocalBookData();
  }

  booksData.unshift(data);
  localStorage.setItem(localBooksDataKey, JSON.stringify(booksData));
  renderBookList(getLocalBookData());
  clearForm();
}

function deleteBookData(id) {
  const booksData = getLocalBookData();
  const selectedBookDataIndex = booksData.findIndex((data) => data.id === id);

  booksData.splice(selectedBookDataIndex, 1);
  localStorage.setItem(localBooksDataKey, JSON.stringify(booksData));

  renderBookList(getLocalBookData());
}

function changeReadingStatus(id) {
  const booksData = getLocalBookData();
  const selectedBookDataIndex = booksData.findIndex((data) => data.id === id);
  const currentIsFinishedReading = booksData[selectedBookDataIndex].isComplete;

  booksData[selectedBookDataIndex].isComplete = currentIsFinishedReading
    ? false
    : true;
  localStorage.setItem(localBooksDataKey, JSON.stringify(booksData));

  renderBookList(getLocalBookData());
}

function createBookList(bookData) {
  const listItem = document.createElement('div');
  listItem.setAttribute('id', bookData.id);
  listItem.setAttribute('class', 'list-item');

  const title = document.createElement('h3');
  title.innerText = bookData.title;

  const writer = document.createElement('p');
  writer.innerText = `Penulis: ${bookData.writer}`;

  const year = document.createElement('p');
  year.innerText = `Tahun: ${bookData.year}`;

  const isFinished = document.createElement('p');
  isFinished.innerText = bookData.isComplete;

  const changeReadingStatusBtn = document.createElement('button');
  changeReadingStatusBtn.setAttribute('id', 'change-status-btn');
  changeReadingStatusBtn.innerText = bookData.isComplete
    ? 'Sedang Dibaca'
    : 'Selesaikan';

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('id', 'delete-btn');
  deleteBtn.innerText = 'Hapus Data';

  changeReadingStatusBtn.addEventListener('click', () => {
    changeReadingStatus(bookData.id);
  });

  deleteBtn.addEventListener('click', () => {
    deleteBookData(bookData.id);
  });

  listItem.append(
    title,
    writer,
    year,
    isFinished,
    changeReadingStatusBtn,
    deleteBtn
  );

  return listItem;
}

function renderBookList(booksData) {

  if (!booksData) {
    return;
  }

  clearCurrentBookList();

  for (const bookData of booksData) {
    const newBookListItem = createBookList(bookData);

    if (bookData.isComplete) {
      finishedReadingList.append(newBookListItem);
    } else {
      currentlyReadingList.append(newBookListItem);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof Storage === 'undefined') {
    alert('Maaf, browser yang anda tidak mendukung Web Storage.');
    return;
  }

  renderBookList(getLocalBookData());

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    storeBookData(getFormData());
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    searchBookData();
  })
});

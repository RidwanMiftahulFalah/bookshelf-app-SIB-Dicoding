const bookForm = document.getElementById('book-form');
const finishedReadingList = document.querySelector(
  '.finished-list-container > .list-item-container'
);
const currentlyReadingList = document.querySelector(
  '.unfinished-list-container > .list-item-container'
);
const localBooksDataKey = 'BooksData';

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('writer').value = '';
  document.getElementById('year').value = '';
  document
    .getElementsByName('reading-status')
    .forEach((option) => (option.checked = false));
}

function getBookData() {
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

function storeBookData(data) {
  let booksData = [];

  if (localStorage.getItem(localBooksDataKey) !== null) {
    booksData = JSON.parse(localStorage.getItem(localBooksDataKey));
  }

  booksData.unshift(data);
  localStorage.setItem(localBooksDataKey, JSON.stringify(booksData));
  renderBookList();
  clearForm();
}

function changeReadingStatus(id) {
  const booksData = JSON.parse(localStorage.getItem(localBooksDataKey));
  const selectedBookData = (booksData.findIndex((data) => data.id === id));
  const currentIsFinishedReading = booksData[selectedBookData].isComplete;

  booksData[selectedBookData].isComplete = currentIsFinishedReading ? false : true;
  localStorage.setItem(localBooksDataKey, JSON.stringify(booksData));

  renderBookList();
}

function clearCurrentBookList() {
  finishedReadingList.innerHTML = '';
  currentlyReadingList.innerHTML = '';
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
  changeReadingStatusBtn.setAttribute('id', 'change-status');
  changeReadingStatusBtn.innerText = bookData.isComplete
    ? 'Sedang Dibaca'
    : 'Selesaikan';

  changeReadingStatusBtn.addEventListener('click', () => {
    changeReadingStatus(bookData.id);
  });

  listItem.append(title, writer, year, isFinished, changeReadingStatusBtn);

  return listItem;
}

function renderBookList() {
  const booksData = JSON.parse(localStorage.getItem(localBooksDataKey));

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

  renderBookList();

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    storeBookData(getBookData());
  });
});

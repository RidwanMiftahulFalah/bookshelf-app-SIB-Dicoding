const bookForm = document.getElementById('book-form');
const localBooksDataKey = 'BooksData';

function getBookData() {
  const inputTitle = document.getElementById('title').value;
  const inputWriter = document.getElementById('writer').value;
  const inputYear = document.getElementById('year').value;
  const isFinishedReadingRadioGroup =
    document.getElementsByName('reading-status');
  let inputIsFinishedReading = null;

  for (const option of isFinishedReadingRadioGroup) {
    if (option.checked) {
      inputIsFinishedReading = option.value;
    }
  }

  const newBookData = {
    id: +new Date(),
    title: inputTitle,
    writer: inputWriter,
    year: inputYear,
    isComplete: inputIsFinishedReading,
  };

  // console.log(inputIsFinished);
  console.log(newBookData);
  return newBookData;
}

function storeBookData(data) {
  let booksData = [];

  if (localStorage.getItem(localBooksDataKey) !== null) {
    booksData = JSON.parse(localStorage.getItem(localBooksDataKey));
  }

  booksData.unshift(data);
  localStorage.setItem(localBooksDataKey, JSON.stringify(booksData));
  console.log(localStorage.getItem(localBooksDataKey));
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof Storage === 'undefined') {
    alert('Maaf, browser yang anda tidak mendukung Web Storage.');
    return;
  }
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    storeBookData(getBookData());
  });
});

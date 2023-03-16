window.addEventListener('DOMContentLoaded', () => {
  if (typeof Storage === 'undefined') {
    alert('Maaf, browser yang anda tidak mendukung Web Storage.');
    return;
  }

  const localBooksDataKey = 'BooksData';
  let formState = 'create';
  const bookForm = document.getElementById('book-form');
  const searchForm = document.getElementById('search-form');
  let formTitleState = document.getElementById('form-title-state');
  const existingDataId = document.getElementById('existing-data-id');
  const inputTitle = document.getElementById('title');
  const inputWriter = document.getElementById('writer');
  const inputYear = document.getElementById('year');
  const inputIsFinishedReadingRadioGroup =
    document.getElementsByName('reading-status');
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

  function populateForm(data) {
    clearForm();

    inputTitle.value = data.title;
    inputWriter.value = data.writer;
    inputYear.value = data.year;

    if (data.isComplete) {
      inputIsFinishedReadingRadioGroup[1].checked = true;
    } else {
      inputIsFinishedReadingRadioGroup[0].checked = true;
    }
  }

  function getSelectedBookDataIndex(id) {
    return getLocalBookData().findIndex((data) => data.id === id);
  }

  function getFormData() {
    let isFinishedReading = null;

    for (const option of inputIsFinishedReadingRadioGroup) {
      if (option.checked) {
        isFinishedReading = true;
      } else {
        isFinishedReading = false;
      }
    }

    if (!existingDataId.value) {
      const newBookData = {
        id: +new Date(),
        title: inputTitle.value,
        writer: inputWriter.value,
        year: Number(inputYear.value),
        isComplete: isFinishedReading,
      };
      return newBookData;
    } else {
      const updatedBookData = {
        updatedTitle: inputTitle.value,
        updatedWriter: inputWriter.value,
        updatedYear: Number(inputYear.value),
        updatedIsComplete: isFinishedReading,
      };
      return updatedBookData;
    }
  }

  function searchBookData() {
    const keyword = document.getElementById('search-box').value.toLowerCase();
    const tempBooksData = getLocalBookData();
    const searchResult = tempBooksData.filter(
      (data) =>
        data.title.toLowerCase().includes(keyword) ||
        data.writer.toLowerCase().includes(keyword)
    );

    if (searchResult.length === 0) {
      return alert('Data tidak ditemukan...');
    }

    renderBookList(searchResult);
  }

  function storeBookData(data) {
    let tempBooksData = [];

    if (!existingDataId.value) {
      if (localStorage.getItem(localBooksDataKey) !== null) {
        tempBooksData = getLocalBookData();
      }
      tempBooksData.unshift(data);
    } else {
      tempBooksData = getLocalBookData();
      const selectedData =
        tempBooksData[getSelectedBookDataIndex(Number(existingDataId.value))];
      const { updatedTitle, updatedWriter, updatedYear, updatedIsComplete } =
        getFormData();

      selectedData.title = updatedTitle;
      selectedData.writer = updatedWriter;
      selectedData.year = updatedYear;
      selectedData.isComplete = updatedIsComplete;

      formTitleState.innerText = 'Tambah';
    }

    localStorage.setItem(localBooksDataKey, JSON.stringify(tempBooksData));
    renderBookList(getLocalBookData());
    clearForm();
  }

  function editBookData(id) {
    const tempBooksData = getLocalBookData();

    formTitleState.innerText = 'Ubah';
    existingDataId.value = id;
    populateForm(tempBooksData[getSelectedBookDataIndex(id)]);
  }

  function deleteBookData(id) {
    const tempBooksData = getLocalBookData();

    tempBooksData.splice(getSelectedBookDataIndex(id), 1);
    localStorage.setItem(localBooksDataKey, JSON.stringify(tempBooksData));

    renderBookList(getLocalBookData());
  }

  function changeReadingStatus(id) {
    const tempBooksData = getLocalBookData();
    const currentIsFinishedReading =
      tempBooksData[getSelectedBookDataIndex(id)].isComplete;

    tempBooksData[getSelectedBookDataIndex(id)].isComplete =
      currentIsFinishedReading ? false : true;
    localStorage.setItem(localBooksDataKey, JSON.stringify(tempBooksData));

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

    const editBtn = document.createElement('button');
    editBtn.setAttribute('id', 'edit-btn');
    editBtn.innerText = 'Edit Data';

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('id', 'delete-btn');
    deleteBtn.innerText = 'Hapus Data';

    changeReadingStatusBtn.addEventListener('click', () => {
      changeReadingStatus(bookData.id);
    });

    editBtn.addEventListener('click', () => {
      editBookData(bookData.id);
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
      editBtn,
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

  renderBookList(getLocalBookData());

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    storeBookData(getFormData());
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    searchBookData();
  });
});

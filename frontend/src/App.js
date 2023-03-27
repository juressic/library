import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  //Component variables
  const [bookInput, setBookInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [authorSelect, setAuthorSelect] = useState(1);

  //Databases
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  const production = true;

  const serverAddress = () => {
    if (production === false) return 'http://localhost:5558';
    else return 'http://20.199.179.107:5558';
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    fetch(serverAddress + '/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data.authors));
  }, []);

  const bookInputHandler = (e) => {
    const inputVal = e.target.value;
    setBookInput(inputVal);
  };

  const authorInputHandler = (e) => {
    const inputVal = e.target.value;
    setAuthorInput(inputVal);
  };

  const newBookHandler = (e) => {
    e.preventDefault();

    const ids = books.map((object) => object.id);
    const max = Math.max(...ids);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bookInput,
        authorId: authorSelect,
        id: max + 1,
      }),
    };

    fetch(serverAddress + '/book', requestOptions)
      .then((res) => res.json())
      .then((data) => getBooks())
      .catch((err) => console.error(err));
  };

  const getBooks = () => {
    fetch(serverAddress + '/books')
      .then((res) => res.json())
      .then((data) => setBooks(data.books));
  };

  const deleteBookHandler = (e, bookName) => {
    e.preventDefault();
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: bookName }),
    };

    fetch(serverAddress + '/book', requestOptions)
      .then((res) => res.json())
      .then((data) => getBooks())
      .catch((err) => console.error(err));
  };

  const authorSelectHandler = (e) => {
    const author = authors.find((author) => author.name === e.target.value);
    const val = author.id;
    setAuthorSelect(val);
  };

  const newAuthorHandler = () => {
    const ids = authors.map((author) => author.id);
    const max = Math.max(...ids);

    const authorRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: max + 1,
        name: authorInput,
      }),
    };

    fetch(serverAddress + '/author', authorRequestOptions);
  };

  return (
    <div className="App">
      <form>
        <div className="form-field">
          <label htmlFor="bookName">Book Title</label>
          <input id="bookName" onChange={bookInputHandler} />
        </div>
        <div className="form-field">
          <label htmlFor="authorSelect">Select Author</label>
          <select
            type="dropdown"
            id="authorSelect"
            onChange={authorSelectHandler}
          >
            {authors.map((author, index) => {
              return (
                <option key={index} value={author.name}>
                  {author.name}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit" onClick={newBookHandler}>
          ADD BOOK
        </button>
      </form>
      <form>
        <div className="form-field">
          <label htmlFor="bookName">Author Name</label>
          <input id="authorName" onChange={authorInputHandler} />
        </div>
        <button type="submit" onClick={newAuthorHandler}>
          ADD AUTHOR
        </button>
      </form>
      <div>
        <h4>My Books</h4>
        {books.map((book) => {
          const author = authors.find((author) => author.id === book.authorId);
          return (
            <div key={book.id}>
              <span>{author?.name}</span>
              <span>{book.name}</span>
              <button onClick={(e) => deleteBookHandler(e, book.name)}>
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

import "./App.css";
import React from "react";

function App() {
  const apiUrl = "https://node-books-db.vercel.app/";
  const [books, setBooks] = React.useState();

  React.useEffect(() => {
    fetch(apiUrl).then((books) => {
      setBooks(books);
    });
  }, []);

  return (
    <div className="App">
      <h2>Libros</h2>
      <ul>
        {books?.map((book) => (
          <li>{book.title + "(" + book.author.name + ")"}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");


useEffect(() => {
  async function fetchQuestions() {
  try {
    const url = searchTerm
      ? `/question/search?q=${searchTerm}&page=${page}`
      : `/question?page=${page}`;

    const res = await api.get(url);

    setQuestions(res.data.questions);
    setTotalPages(res.data.totalPages);
  } catch {
    setError("Failed to load questions");
  }
}


  fetchQuestions();

  // Refresh current page when chat adds a new question
  function handleNewQuestion() {
    fetchQuestions();
  }

  window.addEventListener("newQuestionAdded", handleNewQuestion);

  return () => {
    window.removeEventListener("newQuestionAdded", handleNewQuestion);
  };
}, [page, searchTerm]);


  return (
    <div className="home-page">

      {/* Header Section */}
      <div className="home-header">
        <Link to="/ask">
          <button className="ask-btn">Ask Question</button>
        </Link>

        {user && (
          <p className="welcome-text">
            Welcome: {user.username}
          </p>
        )}
      </div>

      <h2>Questions</h2>

      {error && <p className="home-error">{error}</p>}

      <div className="home-search">
  <input
    type="text"
    placeholder="Search questions..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button onClick={() => setPage(1)}>Search</button>
</div>

      <div className="question-list">
        {questions.map((q) => (
          <Link
            to={`/question/${q.question_id}`}
            key={q.question_id}
            className="question-card-link"
          >
            <div className="question-card">

              <div className="question-left">
                <div className="avatar">
                  {q.username.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="question-middle">
                <h4>{q.title}</h4>
                <p className="question-meta">{q.username}</p>
              </div>

              <div className="question-right">
                <span className="arrow">›</span>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}

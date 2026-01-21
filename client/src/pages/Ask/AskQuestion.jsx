import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import "./AskQuestion.css";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // simple validation
    if (!title.trim() || !description.trim()) {
      setError("Both title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/question", {
        title,
        description
      });

      navigate("/home");
    } catch (err) {
      setError("Failed to post question. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-container">

      <div className="ask-steps">
        <h3>Steps to write a good question</h3>
        <ul>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Explain what you tried and what you expected.</li>
          <li>Review your question before posting.</li>
        </ul>
      </div>

      <div className="ask-form-card">
        <h2>Ask a public question</h2>

        {error && <p className="ask-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Question Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Your Question"}
          </button>

        </form>
      </div>

    </div>
  );
}

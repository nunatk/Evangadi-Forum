import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./Detail.css";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [text, setText] = useState("");
  const [pageError, setPageError] = useState("");
  const [answerError, setAnswerError] = useState("");

  // Question edit state
  const [editQuestionMode, setEditQuestionMode] = useState(false);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionContent, setEditQuestionContent] = useState("");

  // Answer edit state
  const [editAnswerId, setEditAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  // Load question and answers
  async function loadData() {
    try {
      const qRes = await api.get(`/question/${id}`);
      const aRes = await api.get(`/answer/${id}`);

      setQuestion(qRes.data);
      setAnswers(aRes.data.answers);
      setEditQuestionTitle(qRes.data.title);
      setEditQuestionContent(qRes.data.content);
    } catch {
      setPageError("Failed to load question");
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  /* =====================
     QUESTION DELETE
  ===================== */
  async function handleDeleteQuestion() {
    await api.delete(`/question/${id}`);
    navigate("/home");
  }

  /* =====================
     QUESTION UPDATE
  ===================== */
  async function handleUpdateQuestion(e) {
    e.preventDefault();

    await api.put(`/question/${id}`, {
      title: editQuestionTitle,
      content: editQuestionContent
    });

    setEditQuestionMode(false);
    loadData();
  }

  /* =====================
     ANSWER DELETE
  ===================== */
  async function deleteAnswer(answerId) {
    await api.delete(`/answer/${answerId}`);
    loadData();
  }

  /* =====================
     ANSWER EDIT START
  ===================== */
  function startEditAnswer(answer) {
    setEditAnswerId(answer.answer_id);
    setEditAnswerContent(answer.content);
  }

  /* =====================
     ANSWER UPDATE
  ===================== */
  async function handleUpdateAnswer(e) {
    e.preventDefault();

    await api.put(`/answer/${editAnswerId}`, {
      content: editAnswerContent
    });

    setEditAnswerId(null);
    setEditAnswerContent("");
    loadData();
  }

  /* =====================
     CREATE ANSWER
  ===================== */
  async function postAnswer(e) {
    e.preventDefault();
    setAnswerError("");

    try {
      await api.post("/answer", {
        questionid: id,
        answer: text
      });

      setText("");
      loadData();
    } catch (err) {
      setAnswerError(err.response?.data?.msg || "Error posting answer");
    }
  }

  /* ===================== */

  if (pageError) return <p className="home-error">{pageError}</p>;
  if (!question) return <p className="home-loading">Loading...</p>;

  return (
    <div className="detail-page">

      {/* QUESTION BOX */}
      <div className="question-box">

        {!editQuestionMode ? (
          <>
            <h2>{question.title}</h2>
            <p>{question.content}</p>
            <p className="question-meta">
              Asked by: {question.username}
            </p>

            {user?.username === question.username && (
              <div className="owner-controls" style={{ justifyContent: "flex-end" }}>
                <button onClick={() => setEditQuestionMode(true)}>Edit</button>
                <button onClick={handleDeleteQuestion}>Delete</button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleUpdateQuestion} className="edit-form">
            <input
              value={editQuestionTitle}
              onChange={(e) => setEditQuestionTitle(e.target.value)}
              required
            />
            <textarea
              value={editQuestionContent}
              onChange={(e) => setEditQuestionContent(e.target.value)}
              required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditQuestionMode(false)}>
              Cancel
            </button>
          </form>
        )}

      </div>

      {/* ANSWERS */}
      <h3 className="answer-title">Answers</h3>

      <div className="answers-section">
        {answers.length === 0 && <p>No answers yet.</p>}

        {answers.map((a) => (
          <div key={a.answer_id} className="answer-card">

            <p className="answer-user">{a.user_name}</p>

            {editAnswerId === a.answer_id ? (
              <form onSubmit={handleUpdateAnswer} className="edit-form">
                <textarea
                  value={editAnswerContent}
                  onChange={(e) => setEditAnswerContent(e.target.value)}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditAnswerId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <p className="answer-content">{a.content}</p>
            )}

            {a.user_name === user?.username && editAnswerId !== a.answer_id && (
              <div className="owner-controls">
                <button onClick={() => startEditAnswer(a)}>Edit</button>
                <button onClick={() => deleteAnswer(a.answer_id)}>Delete</button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* ANSWER FORM */}
      <div className="answer-form-box">
        <h4>Write your answer</h4>

        {answerError && <p className="answer-error">{answerError}</p>}

        <form onSubmit={postAnswer} className="answer-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your answer..."
            required
          />
          <button type="submit">Post Answer</button>
        </form>
      </div>

    </div>
  );
}

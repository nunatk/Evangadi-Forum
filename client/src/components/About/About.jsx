import "./About.css";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-section">
      <span className="about-label">About</span>
      <h2>Evangadi Networks Q&amp;A</h2>

      <p>
        Evangadi is a knowledge-sharing community built to connect learners,
        professionals, and problem-solvers. It is a place where people come
        together to ask meaningful questions, share practical experience,
        and help each other grow through collaboration.
      </p>

      <p>
        Every question posted on Evangadi becomes part of a growing knowledge
        base. Members learn not only by asking, but also by exploring answers
        shared by others who have faced similar challenges.
      </p>

      <p>
        The community thrives on participation. Whether you are seeking guidance,
        sharing insight, or contributing solutions, your involvement strengthens
        the network and creates opportunities for collective learning.
      </p>

      <button
        className="about-btn"
        onClick={() => navigate("/how-it-works")}
      >
        HOW IT WORKS
      </button>
    </div>
  );
}

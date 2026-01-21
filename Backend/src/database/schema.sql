CREATE DATABASE IF NOT EXISTS evangadi_forum
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE evangadi_forum;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QUESTIONS (UUID)
CREATE TABLE IF NOT EXISTS questions (
  question_id VARCHAR(36) PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ANSWERS (UUID reference)
CREATE TABLE IF NOT EXISTS answers (
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  question_id VARCHAR(36) NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- QUESTION LIKE
CREATE TABLE IF NOT EXISTS question_likes (
  question_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (question_id, user_id),
  CONSTRAINT fk_ql_question FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
  CONSTRAINT fk_ql_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ANSWER LIKE
CREATE TABLE IF NOT EXISTS answer_likes (
  answer_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (answer_id, user_id),
  CONSTRAINT fk_al_answer FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
  CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ANSWER COMMENT
CREATE TABLE IF NOT EXISTS answer_comments (
  comment_id INT NOT NULL AUTO_INCREMENT,
  answer_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  KEY idx_ac_answer (answer_id),
  KEY idx_ac_user (user_id),
  CONSTRAINT fk_ac_answer FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
  CONSTRAINT fk_ac_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

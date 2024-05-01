function StartScreen({ numQuestions, dispatch, category }) {
  return (
    <div className="start">
      <h2>Welcome to The Programming Quiz!</h2>
      <h3>
        {numQuestions} questions to test your knowledge of {category}
      </h3>

      <section className="questions-filter">
        <div>
          <label htmlFor="category">Category: </label>
          <select
            name="category"
            onChange={(e) =>
              dispatch({ type: "categoryChange", payload: e.target.value })
            }
          >
            <option value="linux">Linux</option>
            <option value="devops">DevOps</option>
            <option value="docker">Docker</option>
          </select>
        </div>

        <div>
          <label htmlFor="limit">Number of questions: </label>
          <select
            name="limit"
            onChange={(e) =>
              dispatch({ type: "limitChange", payload: e.target.value })
            }
          >
            <option value="-">-</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficulty">Difficulty: </label>
          <select
            name="difficulty"
            onChange={(e) =>
              dispatch({ type: "difficultyChange", payload: e.target.value })
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </section>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;

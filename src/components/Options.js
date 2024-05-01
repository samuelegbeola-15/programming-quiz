function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;
  const options = Object.values(question.answers).filter(
    (answer) => answer !== null
  );

  const answerArr = Object.values(question.correct_answers);
  const correctAnswer = answerArr.findIndex(checkAnswer);

  function checkAnswer(answer) {
    return answer === "true";
  }

  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered ? (index === correctAnswer ? "correct" : "wrong") : ""
          }`}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;

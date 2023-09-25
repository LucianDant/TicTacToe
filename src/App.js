import React from "react";
import { useState } from "react";

export default function Game() {

  // state
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    }
    else{
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )});
  // render
  let element = (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
  return element;
}

function Board({ xIsNext, squares, onPlay }) {
  // handlers
  function handleClick(index) {
    console.log("clicked " + index);

    // ignore if a square is already filled or game is over
    if (squares[index] || calculateWinner(squares)) {
      return;
    }

    // copy the squares array for immutability
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }

    // trigger event to notify parent component
    onPlay(nextSquares);
  }

  // calculate winner
  const winner = calculateWinner(squares);
  // status
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // inner components
  function BoardRow({ index }) {
    // render
    let element = (
      <div className="board-row">
        <Square value={squares[index]} onSquareClick={() => handleClick(index)} />
        <Square value={squares[index + 1]} onSquareClick={() => handleClick(index + 1)} />
        <Square value={squares[index + 2]} onSquareClick={() => handleClick(index + 2)} />
      </div>
    );
    return element;
  }

  // render
  let element = (
    <div>
      <div className="status">{status}</div>
      <BoardRow index={0} />
      <BoardRow index={3} />
      <BoardRow index={6} />
    </div>
  );
  return element;
}

function Square({ value, onSquareClick }) {
  // render
  let element = (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
  return element;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // left diagonal
    [2, 4, 6], // right diagonal
  ];

  // loop through all the winning line possibilities
  for (let i = 0; i < lines.length; i++) {
    // get the 3 squares in each winning line
    const [a, b, c] = lines[i];
    // check if all 3 squares have the same value
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return the winner (X or O)
      return squares[a];
    }
  }
  // if no winner, return null
  return null;
}


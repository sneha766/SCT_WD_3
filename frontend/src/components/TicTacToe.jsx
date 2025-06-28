import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const WIN_PATTERNS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(b) {
  for (let pattern of WIN_PATTERNS) {
    const [a, b1, c] = pattern;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isPvC, setIsPvC] = useState(false);
  const winner = checkWinner(board);
  const isDraw = !winner && board.every(cell => cell);

  // ✅ Computer move in useEffect
  useEffect(() => {
    if (isPvC && !xIsNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const aiMove = getComputerMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setXIsNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, isPvC, board, winner, isDraw]);

  const handleClick = (index) => {
    if (board[index] || winner || (!xIsNext && isPvC)) return; // block second player click in PvC
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const getComputerMove = (b) => {
    const empty = b.map((v, i) => v === null ? i : null).filter(i => i !== null);
    if (empty.length === 0) return -1;
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const toggleMode = () => {
    resetGame();
    setIsPvC(!isPvC);
  };

  return (
    <div className="ttt-container">
      <h1>Tic Tac Toe</h1>
      <p className="mode-toggle">
        Mode: <strong>{isPvC ? 'Player vs Computer' : 'Player vs Player'}</strong>
        <button onClick={toggleMode}>Switch</button>
      </p>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell ? 'filled' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <div className="status">
        {winner ? (
          <p>🎉 Winner: {winner}</p>
        ) : isDraw ? (
          <p>😐 It's a Draw!</p>
        ) : (
          <p>Next Turn: {xIsNext ? 'X' : 'O'}</p>
        )}
        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
}

export default TicTacToe;

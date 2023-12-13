import React from 'react';
import './ResultsCard.css';

function ResultsCard({ title, text, theme }) {
  return (
    <div className={`results-card ${theme}`}>
      <h2 className={`card-title text--md ${theme}`}>{title}</h2>
      <p className={`card-text ${theme}`}>{text}</p>
    </div>
  );
}

export default ResultsCard;

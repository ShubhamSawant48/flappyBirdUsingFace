import React from 'react';

const Leaderboard = ({ leaderboard }) => {
  return (
    <div style={styles.leaderboardContainer}>
      <h2 style={styles.leaderboardTitle}>🏆 Global Leaderboard 🏆</h2>
      <ul style={styles.leaderboardList}>
        {leaderboard.map((entry, index) => (
          <li key={entry._id || index} style={styles.leaderboardItem}>
            <span>{index + 1}. {entry.name}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
    leaderboardContainer: {
        width: '300px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    leaderboardTitle: {
        textAlign: 'center',
        color: '#333',
    },
    leaderboardList: {
        listStyle: 'none',
        padding: 0,
    },
    leaderboardItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #eee',
    }
};

export default Leaderboard;

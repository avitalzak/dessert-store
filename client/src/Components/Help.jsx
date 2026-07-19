import React, { useState } from 'react' 

export default function HelpButton() {
  const [isSent, setIsSent] = useState(false) 

  const handleHelpClick = () => {
    
    setIsSent(true) 

    // החזרת המצב לקדמותו אחרי 4 שניות
    setTimeout(() => {
      setIsSent(false) 
    }, 4000) 
  } 

  return (
    <div style={styles.container}>
      {!isSent ? (
        <button style={styles.button} onClick={handleHelpClick}>
          צריך עזרה? 🍦
        </button>
      ) : (
        <div style={styles.successMessage}>
          הקריאה נשלחה בהצלחה!
        </div>
      )}
    </div>
  ) 
} 

// עיצוב בתוך הקוד (Inline Styles) - מתאים לגלידרייה!
const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px', // שנה ל-right אם אתה מעדיף בצד ימין
    zIndex: 9999,
    fontFamily: 'sans-serif',
    direction: 'rtl',
  },
  button: {
    backgroundColor: '#ff6b8b', // ורוד תות גלידתי
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
  },
  successMessage: {
    backgroundColor: '#e21d51', // ירוק פיסטוק של הצלחה
    color: 'white',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '50px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.3s ease',
  }
} 


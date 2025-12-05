import { useEffect, useState } from 'react';

const emojis = ['❄️', '❄️', '🎁', '❄️', '❄️'];

function Snowflake({ style }) {
  const [emoji] = useState(() => emojis[Math.floor(Math.random() * emojis.length)]);

  return (
    <div className="snowflake" style={style}>
      {emoji}
    </div>
  );
}

function Snowfall({ count = 20, minSize = 20 }) {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 10,
        animationDelay: Math.random() * 5,
        fontSize: minSize + Math.random() * 8,
      });
    }
    setSnowflakes(flakes);
  }, [count, minSize]);

  return (
    <div className="snowfall">
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            fontSize: `${flake.fontSize}px`,
          }}
        />
      ))}
    </div>
  );
}

export default Snowfall;

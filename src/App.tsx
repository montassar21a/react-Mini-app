import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path if necessary
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication
import Arrow from './assets/Arrow';

function App() {
  const [isPressed, setIsPressed] = useState(false);
  const [points, setPoints] = useState(51144414);
  const [energy, setEnergy] = useState(6500);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 12;
  const energyToReduce = 20;

  const auth = getAuth();
  const user = auth.currentUser;

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const openGithub = () => {
    window.location.assign('/io.tsx');
  };

  const handleClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0 || !user) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = points + pointsToAdd;
    setPoints(newPoints);
    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setClicks([...clicks, { id: Date.now(), x, y }]);

    // Save the updated points to Firebase
    try {
      const userDoc = doc(db, "users", user.uid); // Use the authenticated user's UID
      await setDoc(userDoc, { points: newPoints }, { merge: true });
      console.log("Points successfully saved!");
    } catch (error) {
      console.error("Error saving points to Firebase: ", error);
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  // useEffect hook to restore energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 6500));
    }, 200); // Restore energy every 200ms

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium" style={{ userSelect: `none` }}>

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        <div className="fixed top-0 left-0 w-full px-6 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl backdrop-blur-md">
              <a href="./images/coin.png">
                <p className="text-lg">Join squad <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
              </a>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src='./images/coin.png' width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src='./images/bronze_trophy.png' width={24} height={24} />
            <a href="https://github.com/Malith-Rukshan" target="_blank" rel="noopener noreferrer">
              <span className="ml-1">Bronze <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
            </a>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-6 pb-8 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src='./images/high-voltage.png' width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / 6500) * 100}%`, marginBottom: '1rem' }}></div>
          </div>

          <div>
            <div className="w-full bg-[#8c4456] py-4 rounded-2xl flex justify-around">
              <button className="flex flex-col items-center gap-1" onClick={openGithub}>
                <img src='./images/bear.png' width={32} height={32} alt="Bear" />
                <span>Frens</span>
              </button>
              <button className="flex flex-col items-center gap-1" onClick={openGithub}>
                <img src='./images/coin.png' width={32} height={32} alt="Coin" />
                <span>Earn</span>
              </button>
              <button className="flex flex-col items-center gap-1" onClick={openGithub}>
                <img src='./images/rocket.png' width={32} height={32} alt="Rocket" />
                <span>Boosts</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center select-none">
          <div className="relative mt-4"
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp} 
            onTouchCancel={handleMouseUp}>
            <img src='./images/flowerinu.png' width={256} height={256} alt="flowerinu"
              draggable="false"
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                transform: isPressed ? 'translateY(4px)' : 'translateY(0px)',
                transition: 'transform 100ms ease',
              }}
              className='select-none'
            />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`,
                  pointerEvents: `none`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                {energyToReduce}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;

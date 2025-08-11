// App.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import confettiBlast from 'canvas-confetti';
import {FaMoon, FaSun,  FaHistory, FaTimes, FaWhatsapp,   FaTwitter, FaFacebook, FaInstagram, FaFacebookMessenger 
} from 'react-icons/fa';
import Flag from './Flag';

const App: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const targetDate = new Date('2025-08-14T00:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleCelebrate = () => {
    setShowConfetti(true);

    // Blast from top
    confettiBlast({
      particleCount: 400,
      spread: 140,
      startVelocity: 50,
      angle: 90,
      origin: { y: 0, x: Math.random() * 0.6 + 0.2 },
      colors: ['#006600', '#ffffff', '#FFD700']
    });

    // Central blast
    confettiBlast({
      particleCount: 300,
      spread: 360,
      startVelocity: 60,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#006600', '#ffffff']
    });

    // Fireworks blast
    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
      confettiBlast({
        particleCount: 10,
        startVelocity: 60,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: ['#006600', '#ffffff', '#FFD700']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Play sound
    const audio = new Audio('https://d.poppop.ai/ai_site/user/poppop_op02/text2SoundEffect/b86c49d7404f16bc2b410ea0c5f9e781.mp3');
    audio.play();

    // Show message
    setTimeout(() => setShowMessage(true), 1500);

    // Hide after 12s
    setTimeout(() => {
      setShowConfetti(false);
      setShowMessage(false);
    }, 14000);
  };

  const handleShare = async (platform?: string) => {
    const shareData = {
      title: 'Happy Independence Day Pakistan!',
      text: 'Celebrate Pakistan\'s Independence Day with this amazing app!',
      url: window.location.href,
    };

    try {
      if (platform) {
        let shareUrl = '';
        switch (platform) {
          case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
            break;
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
            break;
          case 'instagram':
            await navigator.clipboard.writeText(shareData.url);
            alert('Link copied! Open Instagram app and paste.');
            return;
          case 'messenger':
            shareUrl = `fb-messenger://share/?link=${encodeURIComponent(shareData.url)}`;
            break;
        }
        window.open(shareUrl, '_blank');
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  const paragraphText = "Celebrate the 78th Independence Day of Pakistan with pride and joy! Let’s honor our heroes and embrace the spirit of freedom.";

  return (
       <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-green-800 to-white' : 'bg-gradient-to-b from-green-200 to-white'} text-white flex flex-col items-center justify-center relative z-10 overflow-hidden transition-colors duration-300`}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#006600', '#ffffff', '#FFD700']}
          numberOfPieces={500}
          recycle={false}
          run={showConfetti}
          wind={0.01}
          gravity={0.2}
        />
      )}

      {showMessage && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-700 p-6 rounded-xl shadow-2xl text-white font-bold text-2xl md:text-4xl z-50 tracking-wide"
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          {'Jashn-e-Azadi Mubarak!'.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, scale: [1, 1.2, 1], color: ['#ffffff', '#006600', '#FFD700'][index % 3] }}
              transition={{ delay: index * 0.05, duration: 0.3, repeat: 2, repeatType: 'reverse' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      )}

      <Flag celebrate={showConfetti} />

      <motion.div
        className="relative z-10 text-center p-6 sm:p-8 md:p-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-lg"
        >
          {'Happy Independence Day!'.split('').map((char, index) => (
            <motion.span key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 font-semibold"
          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Pakistan Zindabad
        </motion.h2>

        <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto drop-shadow-md ${darkMode ? 'text-white' : 'text-gray-800'}`}>
             {paragraphText.split(' ').map((word, index) => (
               <motion.span
                 key={index}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1, duration: 0.5 }}
                style={{ display: 'inline-block', marginRight: '0.25rem' }}
               >
                 {word}
               </motion.span>
             ))}
           </p>

        <div className="text-lg sm:text-xl md:text-2xl mb-6 font-bold">
          Countdown: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <motion.button className="bg-green-600 text-white font-bold py-3 px-6 rounded-full" whileHover={{ scale: 1.1 }} onClick={handleCelebrate}>Celebrate Now!</motion.button>
          <motion.button className="bg-white text-green-600 font-bold py-3 px-6 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => handleShare()}>Share Celebration</motion.button>
          <motion.button className="bg-yellow-400 text-green-800 font-bold py-3 px-6 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => setShowHistory(true)}>
            <FaHistory className="inline mr-2" /> Learn History
          </motion.button>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <motion.button className="bg-green-500 p-3 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => handleShare('whatsapp')}><FaWhatsapp size={24} /></motion.button>
          <motion.button className="bg-blue-500 p-3 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => handleShare('twitter')}><FaTwitter size={24} /></motion.button>
          <motion.button className="bg-blue-700 p-3 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => handleShare('facebook')}><FaFacebook size={24} /></motion.button>
          <motion.button className="bg-pink-500 p-3 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => handleShare('instagram')}><FaInstagram size={24} /></motion.button>
          <motion.button className="bg-blue-400 p-3 rounded-full" whileHover={{ scale: 1.1 }} onClick={() => handleShare('messenger')}><FaFacebookMessenger size={24} /></motion.button>
        </div>
      </motion.div>
      {/* Animated Dark/Light Mode Toggle */}
      <motion.button
        className="absolute top-4 right-4 p-2 rounded-full z-50 shadow-lg 
        bg-yellow-400 text-gray-800 hover:bg-yellow-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
      >
        {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </motion.button>

      {/* Single History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
           <motion.div
                className="bg-green-900/95 p-6 rounded-xl max-w-lg text-white relative max-h-[80vh] overflow-y-auto shadow-xl z-70"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="absolute top-2 right-2 text-white"
                  onClick={() => setShowHistory(false)}
                >
                  <FaTimes size={24} />
                </button>
                <h3 className="text-2xl font-bold mb-4">Pakistan Independence Day</h3>
                <p className="text-lg">
                  On August 14, 1947, Pakistan gained independence from British colonial rule, marking the birth of a sovereign nation. This day celebrates the vision and sacrifices of leaders like Quaid-e-Azam Muhammad Ali Jinnah and the countless freedom fighters who fought for a homeland where Muslims could live freely. The struggle for independence was marked by determination, unity, and resilience, leading to the creation of Pakistan as a nation built on principles of freedom, equality, and justice. Today, we honor their legacy with pride and unity, celebrating our cultural heritage and commitment to a prosperous future.
                </p>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 w-full text-center py-4 bg-green-900 bg-opacity-50 text-sm">
        <p>Created with ❤️ by a proud Pakistani web developer ×͜Dʌʀкʟust×</p>
      </div>
    </div>
  );
};

export default App;

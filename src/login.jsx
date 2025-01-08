import React, { useEffect, useState } from 'react';
import './login.css';
import { getqr } from './api';

const Login = () => {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    // Fetch the QR code from the server
    const fetchQRCode = async () => {
      try {
        const response = await getqr(); // Call the getqr function from the API
        console.log('QR code response:', response);
        setQrCode(response.data); // Set the QR code state
      } catch (error) {
        console.error('Failed to fetch QR code:', error);
      }
    };
    fetchQRCode();

 
    const onYouTubeIframeAPIReady = () => {
      let player;
      player = new window.YT.Player('video-background', {
        videoId: 'yKcQ2-jx1GU',
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: 'yKcQ2-jx1GU',
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          start: 7,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
          },
        },
      });
    };

    // Load the YouTube API script dynamically
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Once the script is loaded, call the API ready function
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  }, []);

  // Check login function
  const check = (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'misha') {
      alert('Login success');
      window.location.href = '/home'; // Redirect to /home page
    } else {
      alert('Wrong password');
    }
  };
  const h6Style = {
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
    background: 'linear-gradient(to right, #ff2d55, #ff5f6d)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    animation: 'pulse 1.5s infinite',
  };
  return (
    <div>
      <div className="video-bg" id="video-background"></div>

      <div className="login-container">
        <h5 className="center-align">Login</h5>
        <form id="loginForm" onSubmit={check}>
          <div className="input-field">
            <i className="material-icons prefix">account_circle</i>
            <input id="username" type="text" name="username" required />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-field">
            <i className="material-icons prefix">lock</i>
            <input id="password" type="password" name="password" required />
            <label htmlFor="password">Password</label>
          </div>
          <div className="center-align">
            <button className="btn waves-effect waves-light" type="submit">
              Log In
              <i className="material-icons right">send</i>
            </button>
          </div>
        </form>
        <div className="qr-section center-align">
          <h6 style={h6Style}>Scan QR Code to Connect whatsapp</h6>
          {qrCode ? (
                  <img src={qrCode} /> // Render the QR code HTML
          ) : (
            <p style={{"color":"RED","fontSize":"25px"}}>ALREADY LINKED </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

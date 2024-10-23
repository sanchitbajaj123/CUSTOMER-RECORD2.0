import React, { useEffect } from 'react';
import './login.css'; // Assuming you store your CSS here

const Login = () => {
  useEffect(() => {
    // Initialize the YouTube Iframe API
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
      </div>
    </div>
  );
};

export default Login;

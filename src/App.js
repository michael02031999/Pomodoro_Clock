import logo from './logo.svg';
import './App.css';
import React from 'react';

import alarm from './sounds/alarm.wav';

let timesPlayIsPressed = 0;
let isReset = false; 

let sessionMinutes;
let seconds;

let breakTimeStarted = false;
let sessionTimeStarted = true;

let count = 0; 

function App() {

  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(25.00)

  let [minutesLeft, setMinutesLeft] = React.useState(25)
  let [secondsLeft, setSecondsLeft] = React.useState("00");

  let [timeLabel, setTimeLabel] = React.useState("Session");

  let [currentLabel, setCurrentLabel] = React.useState(timeLabel);

  let timeLabelRef = React.useRef(timeLabel);

  let [timestamp, setTimestamp] = React.useState("25:00");

  let [startTimer, setStartTimer] = React.useState(false);

  let [isPaused, setIsPaused] = React.useState(true);
  let [isReset, setIsReset] = React.useState(false);


  React.useEffect(() => {

    if (isReset === true) {
      setTimestamp(`${sessionLength}:00`);
      setIsReset(false);
      setIsPaused(true);
    }

    else if (timestamp === "00:00") {
      let audio = new Audio(alarm);
      audio.play();

      setCurrentLabel(prevCurrentLabel => {
        if (prevCurrentLabel === "Session") {

          if(breakLength < 11) {
            setTimestamp(`0${breakLength}:00`);
          }
          else {
            setTimestamp(`${breakLength}:00`);
          }
          return "Break";
        } else {
          if(sessionLength < 11) {
            setTimestamp(`0${sessionLength}:00`);
          }
          else {
            setTimestamp(`${sessionLength}:00`);
          }
         
          return "Session";
        }
      });
    }
  }, [timestamp, isReset, sessionLength]);



  React.useEffect(() => {
    let intervalId;
    let intervalStart;
    let intervalBreak;
    let intervalSession;

  if (isPaused === true) {
    clearInterval(intervalId);
  }
  else if (startTimer == true && currentLabel == "Session") {
      intervalId = setInterval(() => {
        let [minutes, seconds] = timestamp.split(":");
  
        if (seconds === "00") {
          minutes = parseInt(minutes) - 1;
          seconds = 59;
        } else {
          seconds = parseInt(seconds) - 1;
        }

        if (minutes.length == 2 && minutes[0] == 0) {
          minutes = minutes.slice(1, 2);
        }

        timestamp = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timestamp == "00:00") {
          console.log("WE HAD A FIRING");
          setStartTimer(false);
          clearInterval(intervalId);
        }
        
        setTimestamp(timestamp);
      }, 1000);
    }
    else if (currentLabel == "Break") {
      intervalId = setInterval(() => {
        let [minutes, seconds] = timestamp.split(":");
  
        if (seconds === "00") {
          minutes = parseInt(minutes) - 1;
          seconds = 59;
        } else {
          seconds = parseInt(seconds) - 1;
        }

        if (minutes.length == 2 && minutes[0] == 0) {
          minutes = minutes.slice(1, 2);
        }

        timestamp = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timestamp == "00:00") {
          setStartTimer(true);
          clearInterval(intervalId);
        }
        
        setTimestamp(timestamp);
      }, 1000);

    }

   
    return () => clearInterval(intervalId);
  }, [timestamp, startTimer, currentLabel, isPaused]);
    

  

  function handleOperator(event) {

    if (isPaused == true || isReset == true || timesPlayIsPressed == 0) {

      if (isPaused == true &&  event.target.id == "break-decrement" && breakLength > 1) {
        setBreakLength(prevBreakLength => {
          return (prevBreakLength - 1)
        })

        if(minutesLeft < 11) {
          console.log("BREAK DECREMENT TEST")
          setTimestamp("0" + (breakLength-1) + ":00")
        }
        else {
          setTimestamp(breakLength-1 + ":00")
        }

      }
      else if(isPaused == true && event.target.id == "break-increment" && breakLength < 60) {
        setBreakLength(prevBreakLength => {
          return (prevBreakLength + 1)
        })

        if(minutesLeft < 9) {
          //setMinutesLeft("0" + (sessionLength+1))
          setTimestamp("0" + (breakLength+1) + ":00")
        }
        else {
          //setMinutesLeft(sessionLength+1);
          setTimestamp(breakLength+1 + ":00")
        }
      }


      else if (isPaused == true && event.target.id === "session-decrement" && sessionLength > 1) {
        setSessionLength(prevSessionLength => {
          return (prevSessionLength - 1)
        })

        setMinutesLeft(sessionLength-1);

        if(minutesLeft < 11) {
          console.log("BREAK DECREMENT TEST")
          setTimestamp("0" + (sessionLength-1) + ":00")
        }
        else {
          setTimestamp(sessionLength-1 + ":00")
        }
    
  
        
      }
      else if (isPaused == true && event.target.id === "session-increment" && sessionLength < 60) {
        setSessionLength(prevSessionLength => {
          return (prevSessionLength + 1)
        })

        setMinutesLeft(sessionLength+1);

        if(minutesLeft < 9) {
          //setMinutesLeft("0" + (sessionLength+1))
          setTimestamp("0" + (sessionLength+1) + ":00")
        }
        else {
          //setMinutesLeft(sessionLength+1);
          setTimestamp(sessionLength+1 + ":00")
        }
       
    }
      
    }

  }

  function reset(event) {
    timesPlayIsPressed = 0;
    isReset = true;
    timesPlayIsPressed = 0; 
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft("25:00");
    setIsReset(true);
  }

  function handlePlay() {

    setStartTimer(true);
    setIsPaused(false);
  }

  function handlePause() {
    setIsPaused(true);
    setStartTimer(false);
  }

  let [minutes, seconds] = timestamp.split(":");

  let styles = {
    color: (minutes == "00" && seconds <="59") ? "#A50D0E" : "white"
  }

  
  return (
    <div className="App">
      <h1 id="title">25 + 5 Clock</h1>
        <div id="pomodoroApp">
          <div id="length">

            <div id = "breakLength">
              <p id="break-label">Break Length</p>

              <div id="breakButtons">
                <i id="break-decrement" className="downArrow fa-solid fa-arrow-down" onClick = {handleOperator}></i>
                <p id="break-length">{breakLength}</p>
                <i id="break-increment" className="upArrow fa-solid fa-arrow-up" onClick={handleOperator}></i>
              </div>
            </div>

            <div id = "sessionLength">
              <p id="session-label">Session Length</p>
              <div id="sessionButtons">
                <i id="session-decrement" className="downArrow fa-solid fa-arrow-down" onClick={handleOperator}></i>
                <p id="session-length">{sessionLength}</p>
                <i id="session-increment" className="upArrow fa-solid fa-arrow-up" onClick={handleOperator}></i>
              </div>
            </div>
          
            <div id = "timer">
              <p id="timer-label" style={styles}>{currentLabel == "Session" ? "Session" : "Break"}</p>
              <p id="time-left" style={styles}>{timestamp}</p>
            </div>

            <div id= "timerButtonContainer">
              <i id="playButton" class="playButton fa-solid fa-play" onClick = {handlePlay}></i>
              <i id="pauseButton" class="pauseButton fa-solid fa-pause" onClick = {handlePause}></i>
              <i id="reset" class="rewindButton fa-solid fa-arrows-rotate" onClick = {reset}></i>

            </div>
          </div>
      
      </div>
      <div id="credits">
        <p><span id="designedBy">Designed and Coded by</span> <br/> Michael Galan</p>
      </div>
      
    </div>
  );
}



export default App;

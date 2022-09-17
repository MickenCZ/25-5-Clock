import React, { useState, useEffect, useRef} from "https://cdn.skypack.dev/react@17.0.1"
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
document.getElementById("root")
)

function App() {
  const audioRef = useRef()
  const [timerRunning, setTimerRunning] = useState(false);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [display, setDisplay] = useState(sessionLength.toString() + ":00");
  const [savedTime, setSavedTime] = useState({mins:null, secs:null})
  const [label, setLabel] = useState("Session");
  const update = (amount, value, type) => {
    if (!timerRunning) {
      const result = value + amount
      if (result > 0 && result <= 60) {
        if (type === "ss") {setDisplay(result + ":00")}
        return result
      }
      else {return value}
      }
    else {return value}
  }

  const calculateDisplay = (mins, secs) => {
    let minsString = mins.toString()
    let secsString = secs.toString()
    if (minsString.length === 1) {minsString = "0" + mins}
    if (secsString.length === 1) {secsString = "0" + secs}
    return minsString + ":" + secsString
  }

  const startStop = () => {
    setTimerRunning(prev => !prev)
  }

  useEffect(() => {
    let mins = sessionLength
    let secs = 0
    setSavedTime(prev => {
      if (prev.mins !== null && prev.secs !== null) {
        mins = prev.mins
        secs = prev.secs
        return {mins:prev.mins, secs:prev.secs}
      }
      else {return {mins:null, secs:null}}
    })

    const interval = setInterval(() => {
      if (timerRunning) {
          if (mins === 0 && secs === 0) {
            audioRef.current.play()
            setLabel(val => {
              if (val === "Session") {mins = breakLength; return "Break"}
              else if (val === "Break") {mins = sessionLength; return "Session"}
            })
            secs = 0
            setDisplay(calculateDisplay(mins, secs))
            setSavedTime({mins:mins, secs:secs})
          }
          else if (secs === 0) {
            mins--
            secs = 59
            setDisplay(calculateDisplay(mins, secs))
            setSavedTime({mins:mins, secs:secs})
          }
          else {
            secs--
            setDisplay(calculateDisplay(mins, secs))
            setSavedTime({mins:mins, secs:secs})
          }
    }
    }, 1000)
    return () => {clearInterval(interval)}
  }, [timerRunning, sessionLength, breakLength, setSavedTime, setLabel])

  return <main id="app">
    <header id="header">25 + 5 Clock</header>
    <section id="lengths">
      <div className='wrapper'>
        <div id="break-label">Break Length</div>
        <div className='length'>
          <button id="break-increment" onClick={() => {setBreakLength(update(1, breakLength, "br"))}}>+</button>
          <div id="break-length">{breakLength}</div>
          <button id="break-decrement" onClick={() => {setBreakLength(update(-1, breakLength, "br"))}}>-</button>
        </div>
      </div>
      <div className='wrapper'>
        <div id="session-label">Session Length</div>
        <div className='length'>
          <button id="session-increment" onClick={() => {setSessionLength(update(1, sessionLength, "ss"))}}>+</button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-decrement" onClick={() => {setSessionLength(update(-1, sessionLength, "ss"))}}>-</button>
        </div>
      </div>
    </section>
    <section id="timer">
      <div id="timer-label">{label}</div>
      <div id="time-left">{display}</div>
    </section>
    <section id="control">
      <button id="start_stop" onClick={() => {startStop()}}>Start/Stop</button>
      <button id="reset" onClick={() => {
        setSessionLength(25)
        setBreakLength(5)
        setTimerRunning(false)
        setDisplay("25:00")
        setSavedTime({mins:null, secs:null})
        setLabel("Session")
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        }}>Reset Timer</button>
    </section>
    <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" ref={audioRef} ></audio>
  </main>
}

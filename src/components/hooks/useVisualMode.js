import { useState } from "react"

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //Transitions from initial state to another
  function transition(mode, replace = false) {
    //Replaces current mode by not updating history
    if(replace) {
      setMode(mode);
    } else {
      setMode(mode);
      setHistory(prev => [...prev, mode]);
    }
  }

  //Transitions from secondary state to initial
  function back() {
    //Can't mutate state, creates a shallow copy
    const historyCopy = [...history];
    if (historyCopy.length > 1) {
      historyCopy.pop();
    }
    
    setHistory(historyCopy)
    setMode(historyCopy[historyCopy.length - 1])
  }

  return { mode, transition, back };
}
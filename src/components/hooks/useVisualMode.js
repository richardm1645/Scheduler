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
      setHistory(prev => [...prev, mode]);
      setMode(mode);
    }
  }

  //Transitions from secondary state to initial
  function back() {
    //Removes the last instance of history from the array
    const historyCopy = [...history];
    if (historyCopy.length > 1) {
      historyCopy.pop();
    }
    
    //Updates history state, then transition to the last visual mode in history array
    setHistory(historyCopy);
    setMode(historyCopy[historyCopy.length - 1]);
  }

  return { mode, transition, back };
}
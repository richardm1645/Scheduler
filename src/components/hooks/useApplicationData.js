import { useState, useEffect } from "react";
import Axios from "axios";

export function useApplicationData() {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  const setDay = day => setState({ ...state, day });
  //Uses promises.all to fetch data via API
  useEffect(() => {
    Promise.all([
      Axios.get('http://localhost:8001/api/days'),
      Axios.get('http://localhost:8001/api/appointments'),
      Axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev, days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    })
  }, [])


  //Updates state whenever an interview is added/removed/edited
  function bookInterview(id, interview) {

    //Targets and copies the selected appointment
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    //Rerenders the state and replaces the appointment with another
    const appointmentsCopy = {
      ...state.appointments,
      [id]: appointment
    };
    setState({ 
      ...state, 
      appointments: appointmentsCopy
    })
  }

  //Same logic as bookInterview
  function cancelInterview(id) {

    //Targets and copies the selected appointment
    const appointment = {
      ...state.appointments[id]
    };

    //Rerenders the state and replaces the appointment with another
    const appointmentsCopy = {
      ...state.appointments,
      [id]: appointment
    };
    
    setState({ 
      ...state, 
      appointments: appointmentsCopy
    })
  }
  return { state, setDay, bookInterview, cancelInterview }
}
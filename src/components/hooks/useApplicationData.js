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
    
    //Counts up the number of spots that aren't occupied
    function getNumOfSlots(day) {
      let slots = 0;
      for (const slot in day.appointments) {
        if (appointmentsCopy[day.appointments[slot]].interview === null) {
          slots += 1;
        }
      }
      return slots;
    }

    //Update the number of spots if the day includes the appointment ID
    const days = state.days.map(day => {
      if (day.appointments.includes(id)) {
        return {
          ...day,
          spots: getNumOfSlots(day)
        }
      } else {
        return day;
      }
    })
    
    setState({ 
      ...state, 
      appointments: appointmentsCopy,
      days
    })
  }

  /*Cancels a selected interview*/
  function cancelInterview(id) {

    //Targets and copies the selected appointment
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    //Rerenders the state and replaces the appointment with another
    const appointmentsCopy = {
      ...state.appointments,
      [id]: appointment
    };
    
    //Counts up the number of spots that aren't occupied
    function getNumOfSlots(day) {
      let slots = 0;
      for (const slot in day.appointments) {
        console.log("current slot: ", appointmentsCopy[day.appointments[slot]].interview)
        if (appointmentsCopy[day.appointments[slot]].interview === null) {
          slots += 1;
        }
      }
      return slots;
    }

    //Update the number of spots if the day includes the appointment ID
    const days = state.days.map(day => {
      if (day.appointments.includes(id)) {
        return {
          ...day,
          spots: getNumOfSlots(day)
        }
      } else {
        return day;
      }
    })

    setState({ 
      ...state, 
      appointments: appointmentsCopy,
      days
    })
  }
  return { state, setDay, bookInterview, cancelInterview }
}
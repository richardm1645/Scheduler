import { useState, useEffect } from "react";
import axios from "axios";

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
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev, days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    })
  }, [])

  //Counts up the number of spots that aren't occupied
  function getNumOfSlots(appointmentsCopy, day) {
    let slots = 0;
    //console.log(day)
    for (const slot in day.appointments) {
      if (appointmentsCopy[day.appointments[slot]].interview === null) {
        slots += 1;
      }
    }
    return slots;
  }

  function bookInterview(id, interview) {
    //Sends a PUT request to the API, and updates the appointment if there's no error
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(
        () => {
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

          //Update the number of spots if the day includes the appointment ID
          const days = state.days.map(day => {
            const spots = getNumOfSlots(appointmentsCopy, day)
            if (day.appointments.includes(id)) {
              return {
                ...day,
                spots
              }
            } else {
              return day;
            }
          });
          
          setState({ 
            ...state, 
            appointments: appointmentsCopy,
            days
          });
        }
      );
  }

  function cancelInterview(id) {
    //Sends a DELETE request to the API, and updates the appointment if there's no error
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
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

        //Update the number of spots if the day includes the appointment ID
        const days = state.days.map(day => {
          if (day.appointments.includes(id)) {
            return {
              ...day,
              spots: getNumOfSlots(appointmentsCopy, day)
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
      });
  }
  return { state, setDay, bookInterview, cancelInterview }
}
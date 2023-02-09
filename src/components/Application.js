import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";


export default function Application() {

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


  //Generates appointment component for each day
  const appointments = getAppointmentsForDay(state, state.day);

  const interviewers = getInterviewersForDay(state, state.day);
  
  

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
  function cancelInterview(id, interview) {

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
  //Fills the schedule for each day with its appointments
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  
  

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
      <DayList
        days={state.days}
        value={state.day}
        onChange={setDay}
      />

      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />

      </section>
      <section className="schedule">
        {schedule}
        {/* This appointment component is hardcoded to signify the end of schedule of each day */}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

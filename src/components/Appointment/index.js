import React from 'react'
import "components/Appointment/styles.scss"
import Axios from "axios";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import { useVisualMode } from 'components/hooks/useVisualMode';

//Modes for displaying appointments
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  function save(name, interviewer) {
    //Updates state in Application.js to use user info from Form component
    const interview = {
      student: name,
      interviewer
    };
    //Initiates PUT request to the API to update the appointments 
    Axios.put(`http://localhost:8001/api/appointments/${props.id}`, { interview })
      .then(transition(SAVING))
      .then(props.bookInterview(props.id, interview))
      .then(() => transition(SHOW));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()}
          onSave={save}
        />
      )}

      {mode === SAVING && (
        <Status 
          message="Saving"
        />
      )}

    </article>
  )
};
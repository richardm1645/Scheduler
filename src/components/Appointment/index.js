import React from 'react'
import "components/Appointment/styles.scss"
import Axios from "axios";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import { useVisualMode } from 'components/hooks/useVisualMode';


//Modes for displaying appointments
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  //Submits and saves an appointment form 
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

  //Deletes an existing appointment
  function deleteAppointment() {
    //Initiates DELETE request to the API to update the appointments 
    Axios.delete(`http://localhost:8001/api/appointments/${props.id}`)
      .then(transition(DELETING))
      .then(props.cancelInterview(props.id))
      .then(() => transition(EMPTY));
  }

  function confirmDelete() {
    transition(CONFIRM)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={confirmDelete}
        />
      )}
      
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()}
          onSave={save}
        />
      )}

      {mode === EDIT && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()}
          onSave={save}
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}

      {mode === SAVING && (
        <Status 
          message="Saving"
        />
      )}

      {mode === DELETING && (
        <Status 
          message="Deleting"
        />
      )}

      {mode === CONFIRM && (
        <Confirm 
          onCancel={() => back()}
          onConfirm={deleteAppointment}
          message="Are you sure you would like to delete?"
        />
      )}

    </article>
  )
};
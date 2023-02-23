import React from 'react'
import "components/Appointment/styles.scss"

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import { useVisualMode } from 'components/hooks/useVisualMode';


//Modes for displaying appointments
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

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

    transition(SAVING);

    //Calls bookInterview, and transitions to SHOW if the PUT request was successful
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }
  
  //Deletes an existing appointment
  function deleteAppointment() {

    transition(DELETING, true);

    //Calls deleteInterview, and transitions to EMPTY if the DELETE request was successful
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
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

      {mode === ERROR_SAVE && (
        <Error 
          message="Could not save appointment."
          onClose={() => back()}
        />
      )}

      {mode === ERROR_DELETE && (
        <Error 
          message="Could not delete appointment."
          onClose={() => back()}
        />
      )}

    </article>
  )
};
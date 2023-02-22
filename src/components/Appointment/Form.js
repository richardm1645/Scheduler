import React, { useState } from 'react';
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";


export default function Form(props) {

  //Checks if props have student and interviewer values for edit mode, otherwise they're empty
  const [student, setStudent] = useState(props.student || ""); 
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");


  //Resets the form and selected interviewer
  const reset = function() {
    setStudent("");
    setInterviewer(null);
    return;
  }

  //Cancels setting up an appointment
  const cancel = function() {
    reset();
    validate();
    props.onCancel();
  }

  //Validates that inputs are not empty
  const validate = function() {
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (interviewer === null) {
      setError("Please select an interviewer");
      return;
    }
    setError("");
    props.onSave(student, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={event => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          name="name"
          type="text"
          placeholder="Enter Student Name"
          value={student}
          onChange={(event) => setStudent(event.target.value)}
          data-testid="student-name-input"
        />
      </form>
      <section className="appointment__validation">{error}</section>
      <InterviewerList 
        interviewers={props.interviewers}
        value={interviewer}
        setInterviewer={setInterviewer}
      />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button danger onClick={cancel}>Cancel</Button>
        <Button confirm onClick={validate}>Save</Button>
      </section>
    </section>
  </main>
  )
}

//Gets the appointments for a given day
export function getAppointmentsForDay(state, day) {
  //Gets the object of a selected day
  const requestedDay = state.days.filter(filteredDay => filteredDay.name === day);
  let interviews = [];
  if (requestedDay.length > 0) {
    interviews = requestedDay[0].appointments;
  } 
  const appointments = interviews.map(id => state.appointments[id]);
  return appointments;
}

//Gets the interviewers available for the requested day
export function getInterviewersForDay(state, day) {
  let requestedDay = state.days.filter(filteredDay => filteredDay.name === day);
  
  //Returns an empty array if the requested day doesn't exist
  if (requestedDay <= 0) {
    return [];
  } 
  
  const interviewers = [];

  for (const interviewer of requestedDay[0].interviewers) {
    interviewers.push(state.interviewers[`${interviewer}`]);
  }

  return interviewers;
}


//Gets the info for a single appointment
export function getInterview(state, interview) {
  
  //returns null if there's no interview
  if (!interview) {
    return null;
  }

  const interviewInfo = {
    student: interview.student,
    interviewer: {
      id: interview.interviewer,
      name: state.interviewers[interview.interviewer].name,
      avatar: state.interviewers[interview.interviewer].avatar
    }
  }
  return interviewInfo
}
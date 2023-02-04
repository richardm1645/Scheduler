export function getAppointmentsForDay(state, day) {
  const requestedDay = state.days.filter(filteredDay => filteredDay.name === day);
  let interviews = [];
  if (requestedDay.length > 0) {
    interviews = requestedDay[0].appointments;
  } 
  const appointments = interviews.map(id => state.appointments[id - 1]);
  return appointments;
}

export function getInterviewersForDay(state, day) {
  let requestedDay = state.days.filter(filteredDay => filteredDay.name === day);
  
  if (requestedDay <= 0) {
    return [];
  } 
  
  const interviewers = [];

  for (const interviewer of requestedDay[0].interviewers) {
    interviewers.push(state.interviewers[`${interviewer}`]);
  }

  return interviewers;
}

export function getInterview(state, interview) {

  //returns null if there's no interview
  if (!interview) {
    return interview;
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
export function getAppointmentsForDay(state, day) {
  const requestedDay = state.days.filter(filteredDay => filteredDay.name === day);
  let interviews = [];
  if (requestedDay.length > 0) {
    interviews = requestedDay[0].appointments;
  } 
  const appointments = interviews.map(id => state.appointments[id]);
  return appointments;
}

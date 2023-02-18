import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, 
  getByText, getAllByTestId, getAllByAltText, getByPlaceholderText, getByAltText, queryByText, getByTestId } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    //1. Render app
    const { container } = render(<Application />);
  
    //2. Wait for "Archie Cohen" to appear
    await waitForElement(() => getByText(container, "Archie Cohen"))

    //3. Click on the first empty appointment
    const appointment = getAllByTestId(container, "appointment")[0]

    fireEvent.click(getByAltText(appointment, "Add"));

    //4. Input a name and interviewer for the new appointment
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //5. Click on the "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    //6. Expects the app is trying to save
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //7. Waits for the error screen to pop up
    await waitForElement(() => getAllByTestId(appointment, "error"))

    //8. Expects the correct error message
    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument()
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    //1. Render app
    const { container } = render(<Application />);
  
    //2. Wait for "Archie Cohen" to appear
    await waitForElement(() => getByText(container, "Archie Cohen"))

    //3. Click the "Delete" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"))

    //4. Check for confirmation message
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    //5. Click "Confirm" on deletion
    fireEvent.click(queryByText(appointment, "Confirm"));

    //6. Checks that the "deleting" status is shown
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    
    //7. Wait until the error state is shown
    await waitForElement(() => getAllByTestId(appointment, "error"));

    //8. Checks that the correct error message is shown
    expect(getByText(appointment, "Could not delete appointment.")).toBeInTheDocument()
  });

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointment = getAllByTestId(container, "appointment")[0]

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    //1. Render app
    const { container } = render(<Application />);

    //2. Wait until "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click the "Delete" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"))

    //4. Check for confirmation message
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    //5. Click "Confirm" on deletion
    fireEvent.click(queryByText(appointment, "Confirm"))

    //6. Checks that the "deleting" status is shown
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    
    //7. Wait until the "add" button is shown
    await waitForElement(() => getByAltText(appointment, "Add"));

    //8. Check that the DayListItem component has "2 spots remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1. Render app
    const { container } = render(<Application />);

    //2. Wait until "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click the "Edit" button
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"))

    //4. Check for the edit input test-id
    expect(getByTestId(appointment, "student-name-input")).toBeInTheDocument()
    
    //5. Change the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Student 2" }
    });

    //6. Change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //7. Click on "save"
    fireEvent.click(getByText(appointment, "Save"));

    //8. Expects the Saving status is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //9. Wait until the new student name is displayed
    await waitForElement(() => getByText(appointment, "Student 2"));

    //10. Expects the new selected interviewer to be in the appointment
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    //11. Expects the spots remaining to remain at 1
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })
});


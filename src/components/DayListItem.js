import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

//Shows data for a single weekday
export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": (props.spots === 0)
  });

  //Formats spots when there are 1 or 0 spots left
  const formatSpots = function(numOfSpots) {
    if (numOfSpots === 1) {
      return `${numOfSpots} spot remaining`;
    } else if (numOfSpots === 0) {
      return "no spots remaining";
    } else {
      return `${numOfSpots} spots remaining`;
    }
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}> 
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}

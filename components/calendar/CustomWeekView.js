import React from 'react'

import * as dates from 'date-arithmetic'
import { Calendar, Views, Navigate } from 'react-big-calendar'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

class CustomWeekView extends React.Component {
  render() {
    let { date } = this.props
    let range = CustomWeekView.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}

CustomWeekView.range = date => {
  let start = date
  let end = dates.add(start, 6, 'day')

  let current = start
  let range = []

  while (dates.lte(current, end, 'day')) {
    range.push(current)
    current = dates.add(current, 1, 'day')
  }

  return range
}

CustomWeekView.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -7, 'day')

    case Navigate.NEXT:
      return dates.add(date, 7, 'day')

    default:
      return date
  }
}

CustomWeekView.title = date => {
  return `Week of: ${date.toLocaleDateString()}`
}

export default CustomWeekView
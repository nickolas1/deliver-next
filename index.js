import {format, addQuarters, addYears} from 'date-fns'

function nextQuarter(fromWhen = new Date()) {
  return format(addQuarters(fromWhen, 1), 'QQQ')
}

function nextYear(fromWhen = new Date()) {
  return format(addYears(fromWhen, 1), 'yyyy')
}

module.exports = {
  nextQuarter,
  nextYear
}

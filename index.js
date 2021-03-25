import {addQuarters, addYears} from 'date-fns'

function nextQuarter(fromWhen = new Date()) {
  const month = addQuarters(fromWhen, 1).getMonth() + 1
  return 'Q' + Math.ceil(month / 3)
}

function nextYear(fromWhen = new Date()) {
  return addYears(fromWhen, 1).getFullYear().toString()
}

module.exports = {
  nextQuarter,
  nextYear
}

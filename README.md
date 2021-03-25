# deliver-next

functions to keep a delivery date in the future

## installation
```bash
npm install deliver-next
# or with yarn
yarn add deliver-next
```

## usage
```js
import { nextQuarter, nextYear } from 'deliver-next'

// pass in a date, or pass no argument for next time period from now
nextQuarter(new Date('12-10-2020'))
//'Q1'
nextYear(new Date('12-10-2020'))
//'2021'

const fetch = require('node-fetch')
const fs = require('fs')


// get collection/events/tools data from gsx
const sheetList = ['tools', 'collections', 'events']


module.exports ={
  updateGsxData: async function(){
    for (let i = 0; i < sheetList.length; i++) {
      const url = `https://docs.google.com/spreadsheets/d/1_Ml7ChDHkjnaPDYUSuFofwVkghZ4dELD_HwpkYiIdGs/gviz/tq?tqx=out:csv&sheet=${sheetList[i]}`
      const response = await fetch(url)
      const text = await response.text()
      fs.writeFileSync(`static/assets/gsx/${sheetList[i]}.csv`, text)
    }
  }
}


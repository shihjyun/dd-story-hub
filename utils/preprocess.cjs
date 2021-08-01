// for author
const yaml = require('js-yaml')
const fs = require('fs')
// for gsx
const fetch = require('node-fetch')
// for bookmark
const jsdom = require("jsdom")
const { JSDOM } = jsdom



// update author list from authors.yaml
function generateAuthorList(){
  try {
    const authorMeta = yaml.load(fs.readFileSync('static/assets/author/authors.yml', 'utf8'))
    fs.writeFileSync('static/assets/author/authors.json', JSON.stringify(authorMeta))
  } catch (e) {
    console.log(e)
  }
}

// get collection/events/tools data from gsx
const sheetList = ['tools', 'collections', 'events']

async function updateGsxData(){
  for (let i = 0; i < sheetList.length; i++) {
    const url = `https://docs.google.com/spreadsheets/d/1_Ml7ChDHkjnaPDYUSuFofwVkghZ4dELD_HwpkYiIdGs/gviz/tq?tqx=out:csv&sheet=${sheetList[i]}`
    const response = await fetch(url)
    const text = await response.text()
    fs.writeFileSync(`static/assets/gsx/${sheetList[i]}.csv`, text)
  }
}

// parse website's metadata from `Bookmark` article component
async function getWebsiteMeta(url){
  const response = await fetch(url)
  const body = await response.text()
  const dom = await new JSDOM(body)
  const doc = await dom.window.document
  // create URL instance
  const inputUrl = new URL(url)

  // get metadata
  const hostName = inputUrl.hostname
  const ogTitle = doc.querySelector('[property="og:title"]')?.getAttribute('content')
  const ogDescription = doc.querySelector('[property="og:description"]')?.getAttribute('content')
  const ogImage = doc.querySelector('[property="og:image"]')?.getAttribute('content')
  
  return {
    host_name: hostName,
    og_title: ogTitle,
    og_image: ogImage,
    og_description: ogDescription,
    url: url
  }
}

async function getBookmarkMetaData(content, file) {
  return new Promise((resolve, reject) => {
    // find bookmark tag in markdown file
    const dom = JSDOM.fragment(content)
    const bookmarkTags = dom.querySelectorAll('Bookmark')
  
    // if bookmark tag is exist, then crawl the website metadata which specified by author
    let metaData = []
    
    if (bookmarkTags.length !== 0) {
      bookmarkTags.forEach(async (elm, i) => {
        const url = elm.getAttribute('url')
        await getWebsiteMeta(url).then(d => metaData.push(d))
        // when async crawler all done, then export the bookmark data
        if (metaData.length === bookmarkTags.length) {
          await fs.writeFileSync(`static/assets/article/${file}/bookmark.json`, JSON.stringify(metaData))
        }
      })
    } else {
      resolve(metaData)
    }
  })
}



function getBookmarkMetaDataAll(){

  fs.readdir('static/assets/article/', (err, files) => {
    files.forEach(file => {
      // check if bookmark.json is exist in each directories of article
      if (!fs.existsSync(`static/assets/article/${file}/bookmark.json`) && (file !== '.DS_Store')) {
        fs.readFile(`src/routes/article/${file}.md`, 'utf8', async (err, content) => {
          if (err) {
            console.error(err)
            return
          }

          await getBookmarkMetaData(content, file)
        })
      }
    })
  })
  
}






// preprocess above function before `npm build`
generateAuthorList()
updateGsxData()
getBookmarkMetaDataAll()
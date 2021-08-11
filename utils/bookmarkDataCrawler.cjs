const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fs = require('fs')
const fetch = require('node-fetch')


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


module.exports={
  getBookmarkMetaDataAll: function(){
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
}

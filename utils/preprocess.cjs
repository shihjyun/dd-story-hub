// for author
const { generateAuthorList } = require('./authorRegister.cjs')
// for gsx
const { updateGsxData } = require('./gsxDataUpdater.cjs')
// for bookmark
const { getBookmarkMetaDataAll } = require('./bookmarkDataCrawler.cjs')





// preprocess above function before `npm build`
generateAuthorList()
updateGsxData()
getBookmarkMetaDataAll()
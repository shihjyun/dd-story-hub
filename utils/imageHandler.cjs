const jimp = require('jimp')
const fg = require('fast-glob')
const fs = require('fs')



function pathSuffix(path, suffix){
  let pathFrags = path.split('.')
  return pathFrags[0] + suffix + '.' + pathFrags[1] 
}


async function resizeArticleImages() {

  // get articles directory
  let articleDirs = await fg(['static/assets/article/**'], { onlyFiles: false, deep: 1 })


  for (let i = 0; i < articleDirs.length; i++) {
    const articleDir = articleDirs[i]
    
    // check if `imagesMeta.json` exist
    if (
      await fg([`${articleDir}/*.json`]).then(d => {
        return !d.includes(`${articleDirs[i]}/imagesMeta.json`)
      })
    ) {
      // get image paths of all type (without gif)
      let imagePaths = await fg([`${articleDir}/!(*-ph).(png|jpg|jpeg|gif)`], { ignore: ['*.json'] })

      let imagesMeta = []

      // resize images within each article directories
      for (let j = 0; j < imagePaths.length; j++) {
        const imgPath = imagePaths[j]
        const image = await jimp.read(imgPath).then((d) => {
          // collect information of images' width & height
          imagesMeta.push({
            img: imgPath,
            width: d.bitmap.width
          })
          return d
        })


        // resize image (except .gif)
        if (!imgPath.includes('.gif')) {
          image.blur(1)
          await image.resize(60, jimp.AUTO)
          await image.writeAsync(pathSuffix(imgPath, '-ph'))      
        }
      }
      await fs.writeFileSync(`${articleDirs[i]}/imagesMeta.json`, JSON.stringify(imagesMeta))
    }
  }
}



module.exports = {
  resizeArticleImages: resizeArticleImages
}
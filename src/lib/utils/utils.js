import { timeFormat } from 'd3-time-format'

const slugFromPath = (path) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

const formatDate = timeFormat('%b %-d, %Y')

const categoryPathName = (category) => {
  switch (category) {
    case '資訊圖表':
      return 'graphic'
      break;
    case '資料分析':
      return 'data-analysis'
      break;
    case '數位敘事':
      return 'digital-storytelling'
      break;
    case '經驗分享':
      return 'experience'
      break;
    default:
      return 'all'
      break;
  }
}

const suffixPath = (path, suffix) => {
  const frags = path.split('.')
  const i = frags.length
  const fileName = frags[i-2]  + '.' + frags[i-1]
  const fileNameSuffix = frags[i-2] + suffix + '.' + frags[i-1]

  return path.replace(fileName, fileNameSuffix)
}


// from https://tinyurl.com/5842jdjx
const isCached = (src) => {
  var img = new Image();
  img.src = src;
  var complete = img.complete;
  img.src = "";
  return complete;
}

// handle lazyload images are intersection
const handleLazyloadImageIsIntersection = (entry, observer) => {
  if (entry.isIntersecting) {
    // create real image element
    let realImage = document.createElement('img')
    realImage.setAttribute('width', '100%')
    realImage.setAttribute('src', entry.target.dataset.src)
    realImage.setAttribute('alt', 'cover')
    realImage.style.position = 'absolute'
    entry.target.insertAdjacentElement('afterend', realImage)
    entry.target.setAttribute('load', 'true')
    observer.unobserve(entry.target)

    realImage.onload = function () {
      entry.target.style.display = 'none'
    }
    if (realImage.complete) {
      entry.target.style.display = 'none'
    }
  }
}


export { slugFromPath, formatDate, categoryPathName, suffixPath, isCached, handleLazyloadImageIsIntersection }
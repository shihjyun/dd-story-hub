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

export { slugFromPath, formatDate, categoryPathName }
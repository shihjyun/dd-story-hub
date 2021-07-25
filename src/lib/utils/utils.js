import { timeFormat } from 'd3-time-format'

const slugFromPath = (path) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

const formatDate = timeFormat('%b %-d, %Y')

const categoryPathName = (category) => {
  switch (category) {
    case '資料故事':
      return 'data-story'
      break;
    case '經驗分享':
      return 'experience-sharing'
      break;
    case '敘事研究':
      return 'research'
      break;
    default:
      return 'all'
      break;
  }
}

export { slugFromPath, formatDate, categoryPathName }
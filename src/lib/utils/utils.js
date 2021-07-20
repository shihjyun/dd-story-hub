const slugFromPath = (path) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;


const formatDate =  (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

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

// return sets of optimal width ratio of side-by-side image  
// @leftImg image object on the left side (svelte binding object) 
// @rightImg image object on the right side (svelte binding object) 
// @maxWidth side-by-side image maximum width

const getSideBySideImgOptimalWidth = (leftImg, rightImg) => {
  
  const x1 = leftImg.width
  const x2 = rightImg.width
  const y1 = leftImg.height
  const y2 = rightImg.height
  const diff = (y1 - y2) * ((x1 * x2) / (x2 * y1 + x1 * y2))
  const leftRatio = Math.round(((x1 - diff) / (x1 + x2)) * 10000) / 100


  return {
    leftRatio: leftRatio,
    rightRatio: 100 - leftRatio,
  }
}


export { getSideBySideImgOptimalWidth }
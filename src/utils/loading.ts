import { ElLoading } from "element-plus"

let loadingRequestCount = 0
let loadingInstance: { close: () => void }

export const showLoading = (target?: object) => {
  if(loadingRequestCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  loadingRequestCount ++
}
export const hideLoading = () => {
  if(loadingRequestCount <= 0) return
  loadingRequestCount --
  if(loadingRequestCount === 0) {
    loadingInstance.close()
  }
}
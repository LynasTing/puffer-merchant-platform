import { createPinia } from "pinia"
import useLogin from './modules/login'


const store = createPinia()
export default function useStore() {
  return {
    login: useLogin()
  }
}
export { store }
import { ToastContainer } from 'react-toastify'
import AppRouters from './routers'
import ThemeProvider from './contexts/ThemeProvider'

const App = () => {
  return (
    <div className="main-app">
      <ThemeProvider>
        <ToastContainer />
        <AppRouters />
      </ThemeProvider>
    </div>
  )
}

export default App

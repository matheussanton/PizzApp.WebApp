import '../../styles/globals.scss'
import { AppProps } from 'next/app';
import { ToastContainer} from 'react-toastify';
import { AuthProvider } from '../contexts/AuthContext'

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
    </AuthProvider>
  )
}

export default MyApp

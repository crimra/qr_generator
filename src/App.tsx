import QRGenerator from './components/QRGenerator'
import EditPage from './components/EditPage'

function App() {
  const match = window.location.pathname.match(/^\/edit\/([A-Za-z0-9_-]+)\/?$/)
  return match ? <EditPage id={match[1]} /> : <QRGenerator />
}

export default App

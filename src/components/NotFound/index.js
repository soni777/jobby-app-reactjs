import Header from '../Header'

import './index.css'

const NotFound = () => (
  <div className="not-found-app-container">
    <div className="container not-found-container">
      <Header />
      <div className="notfound-image-text-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
        />
        <h3>Page Not Found</h3>
        <p>we&lsquo;re sorry, the page you requested could not be found</p>
      </div>
    </div>
  </div>
)

export default NotFound

import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookie from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookie.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <ul>
        <li className="list-container">
          <Link to="/" className="link">
            <img
              className="nav-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
      </ul>
      <div className="d-sm-none">
        <ul className="link-list-container ">
          <li>
            <Link className="link" to="/">
              <AiFillHome />
            </Link>
          </li>
          <li>
            <Link className="link" to="/jobs">
              <BsBriefcaseFill />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="link button"
              onClick={onClickLogout}
            >
              <FiLogOut />
            </button>
          </li>
        </ul>
      </div>
      <div className=" d-lg-none">
        <ul className="link-list-container">
          <li>
            <Link className="link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="link" to="/jobs">
              Jobs
            </Link>
          </li>
        </ul>
      </div>
      <button
        className="logout-btn btn d-lg-none"
        onClick={onClickLogout}
        type="button"
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)

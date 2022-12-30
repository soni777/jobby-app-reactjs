import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookie from 'js-cookie'

import './index.css'

const apiUrl = 'https://apis.ccbp.in/login'
const defaultValues = {
  username: '',
  password: '',
  showSubmitError: false,
  errorMsg: '',
}

class Login extends Component {
  state = defaultValues

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookie.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, option)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <>
        <label className="label" htmlFor="username">
          USERNAME
        </label>
        <input
          className="input"
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label className="label" htmlFor="password">
          PASSWORD
        </label>
        <input
          className="input"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderLoginForm = () => {
    const {showSubmitError, errorMsg} = this.state

    return (
      <div className="login-container">
        <img
          className="logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <form className="form-container" onSubmit={this.onSubmitForm}>
          {this.renderUsername()}
          {this.renderPassword()}
          <button className="btn" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }

  render() {
    const jwtToken = Cookie.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <div className="container login-outside-container">
          {this.renderLoginForm()}
        </div>
      </div>
    )
  }
}
export default Login

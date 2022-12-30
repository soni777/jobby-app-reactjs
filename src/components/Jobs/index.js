import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApi = 'https://apis.ccbp.in/profile'

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noJobsFound: 'NOJOBSFOUND',
}

class Jobs extends Component {
  state = {
    search: '',
    employmentType: [],
    minPackage: 1000000,
    status: apiConstants.initial,
    jobsDetails: [],
    showProfile: false,
    profileDetails: [],
    profileIsLoading: false,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileIsLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApi, options)
    if (response.ok) {
      const fetchData = await response.json()
      const profileDetails = {
        name: fetchData.profile_details.name,
        profileImageUrl: fetchData.profile_details.profile_image_url,
        shortBio: fetchData.profile_details.short_bio,
      }
      this.setState({
        profileDetails,
        showProfile: true,
        profileIsLoading: false,
      })
    } else {
      this.setState({showProfile: false, profileIsLoading: false})
      console.log('fail to get profile')
    }
  }

  getJobDetails = async () => {
    this.setState({status: apiConstants.inProgress})
    const {search, employmentType, minPackage} = this.state
    // console.log(employmentType.join(','))
    const jwtToken = Cookies.get('jwt_token')
    const jobsApi = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${minPackage}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApi, options)
    if (response.ok) {
      const fetchData = await response.json()
      //   console.log(fetchData.jobs)
      if (fetchData.jobs.length === 0) {
        this.setState({status: apiConstants.noJobsFound})
      } else {
        const jobsDetails = fetchData.jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }))
        this.setState({jobsDetails, status: apiConstants.success})
      }
    } else {
      //   console.log(response.json().status)
      //   console.log(response.json().error_msg)
      this.setState({status: apiConstants.failure})
    }
  }

  onClickRetryProfileDetails = () => {
    this.getProfileDetails()
  }

  onChangeSearch = event => {
    this.setState({search: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobDetails()
  }

  onChangeEmploymentType = event => {
    // const employeeTypes = prevState.employmentType.filter
    this.setState(prevState => {
      let updatedData = prevState.employmentType
      if (prevState.employmentType.includes(event.target.value)) {
        updatedData = prevState.employmentType.filter(
          each => each !== event.target.value,
        )
      } else {
        updatedData = [...updatedData, event.target.value]
      }
      return {employmentType: updatedData}
    }, this.getJobDetails)
  }

  onClickSalary = event => {
    // console.log(event.target.value)
    this.setState({minPackage: event.target.value}, this.getJobDetails)
  }

  onClickJobDetails = () => {
    this.getJobDetails()
  }

  renderLoader = () => (
    <div className="loader-container" id="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderOnFailure = () => (
    <div className="failure-container">
      <img
        className="failure-img sm-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h3>Oops! Something Went Wrong</h3>
      <p>we cannot seem to find the page you are looking for.</p>
      <button onClick={this.onClickJobDetails} className="btn" type="button">
        Retry
      </button>
    </div>
  )

  renderNoJobs = () => (
    <div className="failure-container">
      <img
        className="failure-img sm-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h3>No Jobs Found</h3>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderEmploymentFilter = () => {
    const {employmentType} = this.state
    return (
      <ul className="list-container">
        <h3 className="filter-title">Type of Employment</h3>
        {employmentTypesList.map(each => (
          <li className="list-element" key={each.employmentTypeId}>
            <input
              id={each.employmentTypeId}
              type="checkbox"
              checked={employmentType.includes(each.employmentTypeId)}
              value={each.employmentTypeId}
              onChange={this.onChangeEmploymentType}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderSalaryRangesFliter = () => (
    <ul className="list-container">
      <h3 className="filter-title">Salary Range</h3>
      {salaryRangesList.map(each => (
        <li className="list-element" key={each.salaryRangeId}>
          <input
            id={each.salaryRangeId}
            type="radio"
            name="salary"
            value={each.salaryRangeId}
            onClick={this.onClickSalary}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  renderLeftSideContainer = () => {
    const {profileDetails, showProfile, profileIsLoading} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    const profile = () => (
      <div className="profile-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h2 className="name">{name}</h2>
        <p className="designation">{shortBio}</p>
      </div>
    )
    return (
      <div className="left-side-container ">
        {profileIsLoading && this.renderLoader()}
        {showProfile ? (
          profile()
        ) : (
          <div className="retry-container">
            <button
              className="btn"
              type="button"
              onClick={this.onClickRetryProfileDetails}
            >
              Retry
            </button>
          </div>
        )}
        <hr className="horizontal-line" />
        {this.renderEmploymentFilter()}
        <hr className="horizontal-line" />
        {this.renderSalaryRangesFliter()}
      </div>
    )
  }

  renderRightSideContainer = () => {
    const {jobsDetails} = this.state
    return (
      <ul className="list-container">
        {jobsDetails.map(each => (
          <JobItem key={each.id} details={each} />
        ))}
      </ul>
    )
  }

  renderByApiConstant = () => {
    const {status} = this.state
    switch (status) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderRightSideContainer()
      case apiConstants.failure:
        return this.renderOnFailure()
      case apiConstants.noJobsFound:
        return this.renderNoJobs()
      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <div className=" job-app-container">
        <div className="container job-container">
          <Header />
          <div className="job-details">
            <div className="d-sm-none">
              <div className="search-container">
                <input
                  className="search"
                  type="search"
                  value={search}
                  onChange={this.onChangeSearch}
                  placeholder="Search"
                />
                <button
                  className="button"
                  type="button"
                  id="searchButton"
                  onClick={this.onClickSearchBtn}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            {this.renderLeftSideContainer()}
            <div className="right-side-container">
              <div className="d-lg-none">
                <div className="search-container ">
                  <input
                    className="search"
                    type="search"
                    value={search}
                    onChange={this.onChangeSearch}
                    placeholder="Search"
                  />
                  <button
                    className="button"
                    type="button"
                    id="searchButton"
                    onClick={this.onClickSearchBtn}
                  >
                    <BsSearch className="search-icon" />
                  </button>
                </div>
              </div>
              {this.renderByApiConstant()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs

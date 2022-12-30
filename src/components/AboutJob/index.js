import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookie from 'js-cookie'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {RiShareBoxFill} from 'react-icons/ri'

import Header from '../Header'

import './index.css'

const aboutJobConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'INPROCESS',
}

class AboutJob extends Component {
  state = {
    aboutJobDetails: [],
    skills: [],
    lifeAtCompany: [],
    similarJobs: [],
    status: aboutJobConstants.initial,
  }

  componentDidMount() {
    this.getCompleteJobDetails()
  }

  getCompleteJobDetails = async () => {
    this.setState({status: aboutJobConstants.inProcess})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookie.get('jwt_token')
    const jobApi = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobApi, options)
    if (response.ok) {
      const fetchData = await response.json()
      //   console.log(fetchData)
      const aboutJobDetails = {
        companyLogoUrl: fetchData.job_details.company_logo_url,
        companyWebsiteUrl: fetchData.job_details.company_website_url,
        employmentType: fetchData.job_details.employment_type,
        id: fetchData.job_details.id,
        jobDescription: fetchData.job_details.job_description,
        location: fetchData.job_details.location,
        packagePerAnnum: fetchData.job_details.package_per_annum,
        rating: fetchData.job_details.rating,
        title: fetchData.job_details.title,
      }
      const skills = fetchData.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const lifeAtCompany = {
        imageUrl: fetchData.job_details.life_at_company.image_url,
        description: fetchData.job_details.life_at_company.description,
      }
      const similarJobs = fetchData.similar_jobs.map(each =>
        this.snakeCaseToCamelCase(each),
      )

      this.setState({
        aboutJobDetails,
        skills,
        lifeAtCompany,
        similarJobs,
        status: aboutJobConstants.success,
      })
    } else {
      //   console.log('error')
      //   console.log(response.json().status)
      //   console.log(response.json().error_msg)
      this.setState({status: aboutJobConstants.failure})
    }
  }

  snakeCaseToCamelCase = eachItem => ({
    companyLogoUrl: eachItem.company_logo_url,
    employmentType: eachItem.employment_type,
    id: eachItem.id,
    jobDescription: eachItem.job_description,
    location: eachItem.location,
    rating: eachItem.rating,
    title: eachItem.title,
  })

  onClickRetryJobDetails = () => {
    this.getCompleteJobDetails()
  }

  renderAboutJob = () => {
    const {aboutJobDetails} = this.state
    const {
      title,
      rating,
      companyLogoUrl,
      companyWebsiteUrl,
      jobDescription,
      packagePerAnnum,
      location,
      employmentType,
    } = aboutJobDetails
    return (
      <>
        <div className="company-title-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="job details company logo"
          />
          <div>
            <h3 className="job-title">{title}</h3>
            <div className="rating-container">
              <BsFillStarFill className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-job-role-salary-container">
          <div className="location-job-role-container">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="jobrole-container">
              <BsBriefcaseFill className="briefcase-icon" />
              <p> {employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <div>
          <div className="description-link-container">
            <h4>Description</h4>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit
              <RiShareBoxFill className="share-icon" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
        </div>
      </>
    )
  }

  renderSkills = () => {
    const {skills} = this.state
    return (
      <div>
        <h3>Skills</h3>
        <ul className="skills-container">
          {skills.map(each => (
            <li key={each.name} className="skill-image-name">
              <img className="skill-img" src={each.imageUrl} alt={each.name} />
              <p>{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLifeAtCompany = () => {
    const {lifeAtCompany} = this.state
    const {description, imageUrl} = lifeAtCompany
    return (
      <div>
        <h3>Life At Company</h3>
        <div className="life-at-company">
          <p>{description}</p>
          <img src={imageUrl} alt="life at company" />
        </div>
      </div>
    )
  }

  renderSimilarJobELement = details => {
    const {
      title,
      rating,
      companyLogoUrl,
      jobDescription,
      location,
      employmentType,
    } = details

    return (
      <div className="similar-job-container">
        <div className="company-title-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="similar job company logo"
          />
          <div>
            <h3 className="job-title">{title}</h3>
            <div className="rating-container">
              <BsFillStarFill className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div>
          <h4>Description</h4>
          <p className="job-description">{jobDescription}</p>
        </div>
        <div className="location-job-role-container">
          <div className="location-container">
            <MdLocationOn className="location-icon" />
            <p>{location}</p>
          </div>
          <div className="jobrole-container">
            <BsBriefcaseFill className="briefcase-icon" />
            <p> {employmentType}</p>
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <div className="similar-job-main-container">
        <h3>Similar Jobs</h3>
        <ul className="similar-job-flex-container">
          {similarJobs.map(each => (
            <li key={each.id}>{this.renderSimilarJobELement(each)}</li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" id="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => (
    <>
      <li className="job-detail-list-container about-job-detail-list-container">
        {this.renderAboutJob()}
        {this.renderSkills()}
        {this.renderLifeAtCompany()}
      </li>
      {this.renderSimilarJobs()}
    </>
  )

  renderOnFailure = () => (
    <div className="failure-container">
      <img
        className="failure-img sm-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h3>Oops! Something Went Wrong</h3>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.onClickRetryJobDetails}
        className="btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderAboutConstantViews = () => {
    const {status} = this.state
    switch (status) {
      case aboutJobConstants.success:
        return this.renderSuccessView()
      case aboutJobConstants.inProcess:
        return this.renderLoader()
      case aboutJobConstants.failure:
        return this.renderOnFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="about-job-app-container">
        <div className="about-job-container container">
          <Header />
          {this.renderAboutConstantViews()}
        </div>
      </div>
    )
  }
}
export default AboutJob

import {Link} from 'react-router-dom'

import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {details} = props
  //   console.log(details)
  const {
    title,
    rating,
    companyLogoUrl,
    jobDescription,
    packagePerAnnum,
    location,
    employmentType,
    id,
  } = details
  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="job-detail-list-container">
        <div className="company-title-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
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
          <h4>Description</h4>
          <p className="job-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem

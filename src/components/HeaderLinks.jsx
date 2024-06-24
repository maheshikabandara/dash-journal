import React from 'react';
import { Link, useNavigate} from 'react-router-dom';

const HeaderLinks = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/?cat=${category}`);
  };
  return (
    <div>
      <div className="links">
        <Link className="link" to="/?cat=accountancy">
          <h6>Accountancy</h6>
        </Link>
        <Link className="link" to="/?cat=agriculture">
          <h6>Agriculture</h6>
        </Link>
        <Link className="link" to="/?cat=it">
          <h6>IT</h6>
        </Link>
        <Link className="link" to="/?cat=english">
          <h6>English</h6>
        </Link>
        <Link className="link" to="/?cat=management">
          <h6>Management</h6>
        </Link>
        <Link className="link" to="/?cat=thm">
          <h6>THM</h6>
        </Link>
      </div>
    </div>
  );
};

export default HeaderLinks;

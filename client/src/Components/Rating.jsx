import React from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarRateIcon from '@mui/icons-material/StarRate';

const Rating = ({ Rating, numrating }) => {
  return (
    <>
      <div className="rating">
        <span>
          {Rating >= 1 ? (
            <StarRateIcon />
          ) : Rating >= 0.5 ? (
            <StarHalfIcon />
          ) : (
            <StarBorderIcon />
          )}
        </span>
        <span>
          {Rating >= 2 ? (
            <StarRateIcon />
          ) : Rating >= 1.5 ? (
            <StarHalfIcon />
          ) : (
            <StarBorderIcon />
          )}
        </span>
        <span>
          {Rating >= 3 ? (
            <StarRateIcon />
          ) : Rating >= 2.5 ? (
            <StarHalfIcon />
          ) : (
            <StarBorderIcon />
          )}
        </span>
        <span>
          {Rating >= 4 ? (
            <StarRateIcon />
          ) : Rating >= 3.5 ? (
            <StarHalfIcon />
          ) : (
            <StarBorderIcon />
          )}
        </span>
        <span>
          {Rating >= 5 ? (
            <StarRateIcon />
          ) : Rating >= 4.5 ? (
            <StarHalfIcon />
          ) : (
            <StarBorderIcon />
          )}
        </span>
        <span>{numrating} Reviews</span>
      </div>
    </>
  );
};

export default Rating;

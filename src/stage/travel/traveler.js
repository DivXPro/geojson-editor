import React from 'react';
import styled from 'styled-components';

const StyledTraveler = styled.li.attrs({
  className: 'traveler'
})`
  width: 100%;
  padding: 4px 10px;
  .traveler__title {
    font-size: 16px;
    font-weight: 500;
  }
`

function Traveler(props) {
  return (
    <StyledTraveler>
      <div className="traveler__title">{props.traveler.title}</div>
    </StyledTraveler>
  )
}

export default Traveler;
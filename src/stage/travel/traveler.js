import React from 'react';
import styled from 'styled-components';

const StyledTraveler = styled.li.attrs({
  className: 'traveler'
})`
  width: 100%;
  padding: 8px 16px;
  .traveler__title {
    font-size: 14px;
  }
`

function Traveler(props) {
  return (
    <StyledTraveler>
      <div className="traveler__title">{props.traveler.name}</div>
    </StyledTraveler>
  )
}

export default Traveler;
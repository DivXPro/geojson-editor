import React from 'react';
import { StyledSidePanel, StyledSideContainer } from '@/components/side-panel/side-panel';
import styled from 'styled-components';
import Traveler from './traveler';

const StyledTravelList = styled.ul.attrs({
  className: 'traveler-list'
})`
  height: 100%;
  list-style: none;
  overflow: auto;
  padding: 0 0 60px;
  margin: 0;
`

function SideBar(props) {

  return (
    <StyledSideContainer>
      <StyledSidePanel>
        <StyledTravelList>
          {props.travelers.map(t => <Traveler key={t.title} traveler={t}/>)}
        </StyledTravelList>
      </StyledSidePanel>
    </StyledSideContainer>
  )
}

export default SideBar;

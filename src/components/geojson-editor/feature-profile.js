import React from 'react';
import Styled from 'styled-components';

const StyledFeatureProfile = Styled.section`
  background: rgb(36, 39, 48);
  padding: 16px;
  min-height 480px;
  textarea {
    outline: none;
  }
`

function FeatureProfile(props) {
  return (
    <StyledFeatureProfile>
      {props.content()}
    </StyledFeatureProfile>
  )
}

export default FeatureProfile;
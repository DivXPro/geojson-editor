import React from 'react';
import Styled from 'styled-components';

const WrapperPanelContent = Styled.div`
  background: rgb(36, 39, 48);
  padding: 16px;
  min-height 480px;
`
function PanelContent() {
  return <WrapperPanelContent/>;
}

export default PanelContent;
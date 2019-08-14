import styled from 'styled-components';

export const StyledSideContainer = styled.div.attrs({
  className: 'side-panel'
})`
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 20px;
  width: 340px;
  height: 100%;
  padding: 20px;
`;

export const StyledSidePanel = styled.div.attrs({
  className: 'side-panel-container'
})`
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  transition: left 250ms ease 0s, right 250ms ease 0s;
  background-color: rgb(36, 39, 48);
  height: 100%;
`

export default StyledSidePanel;
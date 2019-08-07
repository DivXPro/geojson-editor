import styled from 'styled-components';

const StyledSidePanel = styled.div`
  position: absolute;
  z-index: 1000;
  top: 40px;
  right: 20px;
  width: 300px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  transition: left 250ms ease 0s, right 250ms ease 0s;
  background: white;
`;

export default StyledSidePanel;
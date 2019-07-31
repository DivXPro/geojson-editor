import React from 'react';
import styled from 'styled-components';

const Button = styled.div`
  width: 30px;
  height: 30px;
  line-height: 30px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 2px;
  font-size: 10px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  box-sizing: inherit;
`;

function ToggleButton(props) {
  return <Button onClick={props.data.handle}>{props.data.text}</Button>;
}

export default ToggleButton;
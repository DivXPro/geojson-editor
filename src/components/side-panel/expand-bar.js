import React from 'react';
import Styled from 'styled-components';
import SvgIcon from '@/components/commons/svg-icon';

const StyledExpandBar = Styled.div.attrs({
  className: 'expand-bar'
})`
    background-color: rgb(58, 65, 76);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 6px 12px 0px;
    font-size: 11px;
    position: absolute;
    left: 64px;
    display: flex;
    margin-top: 6px;
    opacity: ${props => props.show ? 1 : 0};
    transform: translateX(calc(-50% + 20px));
    pointer-events: all;
    z-index: 1000;
    padding: 16px 0px;
    transition: all 0.8s ease 0s;
    .expand-bar__inner {
      box-shadow: none;
      background-color: transparent;
      display: flex;
      box-sizing: border-box;
      margin-top: 2px;
      max-height: 500px;
      position: relative;
      z-index: 999;
      border-radius: 2px;
      .expand-bar__item {
        align-items: center;
        color: rgb(160, 167, 180);
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgb(106, 116, 133);
        padding: 0px 22px;
        :hover {
          cursor: pointer;
          color: white;
        }
        &:last-child {
          border-right: 0;
        }
        .expand-bar_title {
          white-space: nowrap;
          margin-top: 4px;
        }
      }
    }
}`;

function ExpandBar(props) {
  return (
    <StyledExpandBar>
      <div className="export-bar__inner">
        <div className="expand-bar__item">
          <SvgIcon name="download"></SvgIcon>
          <div className="expand-bar_title">导出</div>
        </div>
        <div className="expand-bar__item">
          <SvgIcon name="download"></SvgIcon>
          <div className="expand-bar_title">导出</div>
        </div>
      </div>
    </StyledExpandBar>
  );
}

export default ExpandBar;
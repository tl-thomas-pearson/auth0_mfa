import styled from 'styled-components';

export const COLORS = {
    primary: '#44A1A0',
    danger: '#B95F89',
};

export default styled.button`
   background-color: ${props => props.color || COLORS.primary};
   border: none;
   border-radius: 5px;
   color: #fff;
   margin-left: 5px;
   margin-right: 5px;
   padding: 5px 10px;
`;

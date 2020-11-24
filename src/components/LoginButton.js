import React from 'react';
import Button, { COLORS } from './Button';

const LoginButton = ({ isAuthenticated, auth, ...props }) => {
   const { color, label } = isAuthenticated
       ? { color: COLORS['danger'], label: 'Logout' }
       : { color: COLORS['primary'], label: 'Login' };

   function onClick() {
      !isAuthenticated ? auth.show() : auth.logout();
   }

   return (
      <Button color={color} onClick={onClick} {...props}>
         {label}
      </Button>
   );
};

export default LoginButton;
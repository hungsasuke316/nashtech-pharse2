import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  type = "button",
  onClick = () => {},
  children,
  ...props
}) => {

  const { isloading } = props;
  const child = !!isloading ? <LoadingSpinner /> : children;

  return (
    <>
      <button type={type} onClick={onClick} {...props}>
        {child}
      </button>
    </>
  );
};

export default Button;
import type { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'button'>;
export const Button = (props: Props) => {
  return <button {...props}>{props.children}</button>;
};

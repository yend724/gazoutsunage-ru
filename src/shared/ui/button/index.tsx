import type { ComponentPropsWithRef } from 'react';
import styles from './index.module.css';

type Props = ComponentPropsWithRef<'button'>;
export const Button = (props: Props) => {
  return (
    <button className={styles.button} {...props}>
      {props.children}
    </button>
  );
};

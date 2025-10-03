import styles from './index.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1>ガゾウツナゲール</h1>
      <p>
        複数の画像を横に並べて1枚の画像にします。
        <br />
        画像の処理はすべてブラウザ内で行われ、外部サーバーには一切送信されません。
      </p>
    </header>
  );
};

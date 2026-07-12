import type { Metadata } from "next";
import Image from 'next/image';
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "2026体育祭",
  description: "今日、勝ちにきました",
};

export default function Toppage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.themeContainer}>
          <Image
            src="/sports-theme.svg"
            alt="Theme Logo"
            width={600}
            height={100}
            className={styles.theme}
            priority
          />
        </div>
        <span className={styles.headerText}>
          体育祭2026
        </span>
      </header>
      <div className={styles.container}>
        <div className={styles.yobitai}>
          <h1 className={`${styles.title} ${styles.titleLine} ${styles.lineBlue}`}>予備大結果</h1>
          <div className={styles.content}>
            <div className={styles.topics}>
              <h2 className={`${styles.topicsTitle} ${styles.titleLine} ${styles.linePink}`}>後期</h2>
              <p>ここに内容を追加</p>
            </div>
            <div className={styles.topics}>
              <h2 className={`${styles.topicsTitle} ${styles.titleLine} ${styles.linePink}`}>前期</h2>
              <p>ここに内容を追加</p>
            </div>
          </div>

        </div>
      </div>    
    </>
  );
}

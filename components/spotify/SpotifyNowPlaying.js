import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './SpotifyNowPlaying.module.css'

export default function SpotifyNowPlaying({ spotify }) {
  const [isOpen, setIsOpen] = useState(false)

  const isPlaying = spotify?.isPlaying
  const albumArt = spotify?.album?.image?.href || ''
  const rawTitle = spotify?.title || ''
  // Remove parentheses/brackets from the title
  const title = rawTitle.replace(/\s*(\([^)]*\)|\[[^\]]*\])\s*/g, '').trim()
  const artistName = spotify?.artists?.[0]?.name || ''
  const href = spotify?.href

  // Toggle container open/collapsed
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // If playing => album + title + artist
  // Else => "Currently Chasing Toddlers"
  let leftContent = <p className={styles.toddlers}>Currently Chasing Toddlers</p>
  if (isPlaying) {
    leftContent = (
      <div className={styles.albumDetails}>
        {albumArt && (
          <div className={styles.albumArt}>
            <Image src={albumArt} alt="Album art" width={60} height={60} />
          </div>
        )}
        <div className={styles.textInfo}>
          <p className={styles.title}>{title}</p>
          <p className={styles.artist}>{artistName}</p>
        </div>
      </div>
    )
  }

  // If there's a link, wrap the leftContent in <Link>
  if (href) {
    leftContent = (
      <Link href={href} legacyBehavior passHref>
        <a onClick={(e) => e.stopPropagation()} className={styles.linkWrapper}>
          {leftContent}
        </a>
      </Link>
    )
  }

  return (
    <div
      className={`${styles.musicContainer} ${isOpen ? styles.open : styles.collapsed}`}
      onClick={handleToggle}
    >
      {/* Left side: hidden by default, revealed when open */}
      <div className={styles.leftSide}>{leftContent}</div>

      {/* Right side: wave + bangers on/off always visible */}
      <div className={styles.waveSide}>
        <div className={styles.soundwaveContainer}>
          {isPlaying ? (
            <>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </>
          ) : (
            <>
              <div className={styles.deadBar}></div>
              <div className={styles.deadBar}></div>
              <div className={styles.deadBar}></div>
              <div className={styles.deadBar}></div>
            </>
          )}
        </div>
        {isPlaying ? (
          <p className="text-xs text-white">bangers on</p>
        ) : (
          <p className={`text-xs ${styles.deadText} `}>bangers off</p>
        )}
      </div>
    </div>
  )
}

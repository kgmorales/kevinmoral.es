import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SpotifyLogo from '@/data/spotify.svg'
import styles from './SpotifyNowPlaying.module.css'

export default function SpotifyNowPlaying({ spotify }) {
  const [isOpen, setIsOpen] = useState(false)

  const isPlaying = spotify?.isPlaying
  const albumArt = spotify?.album?.image?.href || null

  // Remove parentheses/brackets from the title
  const rawTitle = spotify?.title || ''
  const title = rawTitle.replace(/\s*(\([^)]*\)|\[[^\]]*\])\s*/g, '').trim()
  const artistName = spotify?.artists?.[0]?.name || ''
  const href = spotify?.href

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // If playing, show album + title + artist
  // Else show "Currently Chasing Toddlers"
  let albumInfo = <p className={styles.toddlers}>Currently Chasing Toddlers</p>
  if (isPlaying) {
    albumInfo = (
      <div className={styles.albumDetails}>
        {albumArt && (
          <div className={styles.albumArt}>
            <Image src={albumArt} alt="album art" width={60} height={60} />
          </div>
        )}
        <div className={styles.textInfo}>
          <p className={styles.title}>{title}</p>
          <p className={styles.artist}>{artistName}</p>
        </div>
      </div>
    )
  }

  // If there's a link, wrap album info in <Link>
  const infoContent = href ? (
    <Link href={href} legacyBehavior passHref>
      <a onClick={(e) => e.stopPropagation()} className={styles.linkWrapper}>
        {albumInfo}
      </a>
    </Link>
  ) : (
    albumInfo
  )

  return (
    <div
      className={`${styles.musicContainer} ${isOpen ? styles.open : styles.collapsed}`}
      onClick={handleToggle}
    >
      {/* 
        Left Side: 
          - Shows Spotify logo if collapsed
          - Shows album info if open
      */}
      <div className={styles.leftSide}>
        {/* Spotify Logo (only visible when collapsed) */}
        <div className={`${styles.logoWrap} ${isOpen ? styles.hide : styles.show}`}>
          <SpotifyLogo />
        </div>

        {/* Album info (only visible when open) */}
        <div className={`${styles.infoWrap} ${isOpen ? styles.show : styles.hide}`}>
          {infoContent}
        </div>
      </div>

      {/* Right Side: wave + bangers */}
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
        <p className="text-xs">bangers {isPlaying ? 'on' : 'off'}</p>
      </div>
    </div>
  )
}

'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './SpotifyNowPlaying.module.css'

export default function SpotifyNowPlaying({ isActive, onToggle, spotify }) {
  const isPlaying = spotify?.isPlaying
  const albumArt = spotify?.album?.image?.href || ''
  const rawTitle = spotify?.title || ''
  // Remove parentheses/brackets from the title
  const title = rawTitle.replace(/\s*(\([^)]*\)|\[[^\]]*\])\s*/g, '').trim()
  const artistName = spotify?.artists?.[0]?.name || ''
  const href = spotify?.href

  return (
    <div
      className={`${styles.musicContainer} ${styles.collapsed}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle(e)
      }}
    >
      {/* Currently, only the wave side is visible */}
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
          <p className={`text-xs ${styles.deadText}`}>bangers off</p>
        )}
      </div>
    </div>
  )
}

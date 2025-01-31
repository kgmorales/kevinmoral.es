// components/spotify/SpotifyNowPlaying.js
import React from 'react'
import Image from 'next/image'
import styles from './SpotifyNowPlaying.module.css'
import SpotifyLogo from '@/data/spotify.svg'
import Link from 'next/link'

export default function SpotifyNowPlaying({ spotify }) {
  // If there's no data (e.g., error, rate-limit, or no last played)
  // if (!spotify) return null

  const albumArt = spotify?.album?.image?.href
  const href = spotify?.href
  const isPlaying = spotify?.isPlaying
  //Remove anything in parentheses or [] so the title isn't super long
  const title = spotify?.title.replace(/\s*(\([^)]*\)|\[[^\]]*\])\s*/g, '').trim()
  const artists = spotify?.artists
  // etc.

  return (
    <div className={styles.musicContainer}>
      <div className={styles.song}>
        <SpotifyLogo />
        {href ? (
          <Link passHref legacyBehavior href={href}>
            <div className={styles.musicInfoContainer}>
              <div className={styles.albumArt}>
                {albumArt && (
                  <Image src={albumArt} alt="spotify album art" width={60} height={60} />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <p className={styles.fakeText}>Currently chasing toddlers</p>
        )}

        <div className={styles.musicinfo}>
          <p className={styles.title}>{title}</p>
          <p className={styles.artist}>{artists?.[0]?.name || ''}</p>
        </div>
      </div>

      {isPlaying ? (
        <div className={styles.nowPlayingContainer}>
          <div className={styles.soundwaveContainer}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
          <p className="text-xs">bangers on</p>
        </div>
      ) : (
        <div className={styles.nowPlayingContainer}>
          <div className={styles.soundwaveContainer}>
            <div className={styles.deadBar}></div>
            <div className={styles.deadBar}></div>
            <div className={styles.deadBar}></div>
            <div className={styles.deadBar}></div>
          </div>
          <p className="text-xs">bangers off</p>
        </div>
      )}
    </div>
  )
}

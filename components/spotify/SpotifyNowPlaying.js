import React from 'react'
import Image from 'next/image'
import styles from './SpotifyNowPlaying.module.css'
import SpotifyLogo from '@/data/spotify.svg'
import Link from 'next/link'

const SpotifyNowPlaying = ({ spotify }) => {
  const nowPlaying = spotify
  const albumArt = spotify?.spotify?.album?.image?.href

  return (
    <div className={`${styles.musicContainer}`}>
      <div className={styles.song}>
        <SpotifyLogo />
        <Link passHref legacyBehavior href={spotify.spotify.href}>
          <div className={styles.musicInfoContainer}>
            <div className={styles.albumArt}>
              {albumArt && (
                <Image
                  src={spotify.spotify.album.image.href}
                  alt="spotify album art"
                  width={60}
                  height={60}
                />
              )}
            </div>
          </div>
        </Link>

        {/* If isPlaying = true, show the track info */}
        <div className={`${styles.musicinfo}`}>
          <p className={`${styles.title}`}>{spotify.spotify.title}</p>
          <p className={`${styles.artist}`}>
            {spotify.spotify.artists && spotify.spotify.artists[0]
              ? spotify.spotify.artists[0].name
              : ''}
          </p>
        </div>
      </div>

      {spotify.spotify?.isPlaying ? (
        <div className={styles.nowPlayingContainer}>
          <div className={styles.soundwaveContainer}>
            <div className={`${styles.bar}`}></div>
            <div className={`${styles.bar}`}></div>
            <div className={`${styles.bar}`}></div>
            <div className={`${styles.bar}`}></div>
          </div>
          <p className="text-xs">bangers on</p>
        </div>
      ) : (
        <div className={styles.nowPlayingContainer}>
          <div className={styles.soundwaveContainer}>
            <div className={`${styles.deadBar}`}></div>
            <div className={`${styles.deadBar}`}></div>
            <div className={`${styles.deadBar}`}></div>
            <div className={`${styles.deadBar}`}></div>
          </div>
          <p className="text-xs">bangers off</p>
        </div>
      )}
    </div>
  )
}

export default SpotifyNowPlaying

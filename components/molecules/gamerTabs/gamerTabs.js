'use client'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './gamerTabs.module.css'
import XboxLogo from '@/data/xbox-logo.svg'
import XboxLogoInactive from '@/data/xbox-logo-inactive.svg'
import PsnLogo from '@/data/psn-logo.svg'
import PsnLogoInactive from '@/data/psn-logo-inactive.svg'

// Helper: TabPanel for accessible content rendering.
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className={styles.tabPanel}
    >
      {value === index && <div className={styles.tabPanelContent}>{children}</div>}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

// Component for displaying profile info with skeleton placeholders.
function ProfileContent({ profile, loading }) {
  return (
    <div className={styles.profileContent}>
      <div className={styles.topRow}>
        {loading ? (
          <div className={styles.skeletonAvatar} />
        ) : (
          <>
            {profile.gamerPic && (
              <div className={styles.avatarBox}>
                <Image
                  src={profile.gamerPic}
                  alt={profile.gamerTag}
                  width={80}
                  height={80}
                  className={styles.avatarImg}
                />
              </div>
            )}
            <div
              className={`${styles.onlineIndicator} ${
                profile.onlineStatus ? styles.online : styles.offline
              }`}
            />
          </>
        )}
        <div className={styles.gamerTagBox}>
          <span className={styles.label}>Tag</span>
          {loading ? (
            <div className={styles.skeletonText} />
          ) : (
            <span className={styles.value}>{profile.gamerTag}</span>
          )}
        </div>
        <div className={styles.gamerScoreBox}>
          <span className={styles.label}>Score</span>
          {loading ? (
            <div className={styles.skeletonTextShort} />
          ) : (
            <div className={styles.value}>
              {profile.gamerScore >= 1000
                ? Math.floor(profile.gamerScore / 1000) + 'k'
                : profile.gamerScore}
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className={styles.skeletonRecentlyPlayed} />
      ) : (
        profile.recentlyPlayed && (
          <div className={styles.recentlyPlayed}>
            <div className={styles.recentlyPlayedImgContainer}>
              <Image
                src={profile.recentlyPlayed.displayImage}
                alt={profile.recentlyPlayed.name}
                width={60}
                height={60}
                className={styles.recentlyPlayedImg}
              />
            </div>
            <div className={styles.recentlyPlayedText}>
              <span className={styles.label}>Last Played</span>
              <span className={styles.value}>{profile.recentlyPlayed.name}</span>
            </div>
          </div>
        )
      )}
    </div>
  )
}

ProfileContent.propTypes = {
  profile: PropTypes.shape({
    gamerTag: PropTypes.string,
    gamerScore: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gamerPic: PropTypes.string,
    onlineStatus: PropTypes.bool,
    recentlyPlayed: PropTypes.shape({
      name: PropTypes.string,
      displayImage: PropTypes.string,
    }),
  }),
  loading: PropTypes.bool,
}

export default function GamerTabs() {
  // Local state for fetched data and loading/error states.
  const [psn, setPsn] = useState(null)
  const [xbox, setXbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Tab control state
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/gamerData')
        if (!res.ok) throw new Error('Failed to fetch gamer data')
        const data = await res.json()
        setPsn(data.psn)
        setXbox(data.xbox)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (error) return <p>Error: {error}</p>

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className={styles.container}>
          <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Xbox & PSN profiles"
            TabIndicatorProps={{ style: { backgroundColor: 'rgb(64, 64, 64)' } }}
          >
            <Tab
              icon={
                <div className={styles.logoWrapper}>
                  {value === 0 ? (
                    <XboxLogo className={styles.logo} />
                  ) : (
                    <XboxLogoInactive className={styles.logo} />
                  )}
                </div>
              }
              {...a11yProps(0)}
            />
            <Tab
              icon={
                <div className={styles.logoWrapper}>
                  {value === 1 ? (
                    <PsnLogo className={styles.logo} />
                  ) : (
                    <PsnLogoInactive className={styles.logo} />
                  )}
                </div>
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <ProfileContent profile={xbox} loading={loading} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ProfileContent profile={psn} loading={loading} />
          </TabPanel>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

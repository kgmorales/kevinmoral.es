import { useState } from 'react'
import styles from './leaders.module.css'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LeaderBio from './leader-bio/leader-bio'

// A11y helper for Tabs:
function a11yProps(index) {
  return {
    id: `leader-tab-${index}`,
    'aria-controls': `leader-tabpanel-${index}`,
  }
}

function LeaderTabsHorizontal({ leaders }) {
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  if (!leaders || leaders.length === 0) {
    return <Typography>No leaders available</Typography>
  }
  return (
    <Box className={styles.leaderTabsContainer}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Leader Tabs"
        className={styles.tabs}
        TabIndicatorProps={{ style: { backgroundColor: 'rgb(64, 64, 64)' } }}
      >
        {leaders.map((leader, index) => (
          <Tab
            key={index}
            icon={
              <Avatar
                alt={leader.athleteName}
                src={leader.athleteImage}
                className={styles.tabAvatar}
              />
            }
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {leaders.map((leader, index) => (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`leader-tabpanel-${index}`}
          aria-labelledby={`leader-tab-${index}`}
          key={index}
          className={styles.leaderTabPanel}
        >
          {value === index && (
            <Box className={styles.bioContainer}>
              <LeaderBio leader={leader} />
            </Box>
          )}
        </div>
      ))}
    </Box>
  )
}

export default function Leaders({ homeLeaderCards, awayLeaderCards }) {
  return (
    <>
      <h3 className={styles.tableHeading}>Game Leaders</h3>
      <div className={styles.leaderSection}>
        <div className={styles.leaderColumn}>
          <LeaderTabsHorizontal leaders={homeLeaderCards} />
        </div>
        <div className={styles.leaderColumn}>
          <LeaderTabsHorizontal leaders={awayLeaderCards} />
        </div>
      </div>
    </>
  )
}

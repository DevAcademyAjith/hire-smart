// Imports
import React from 'react'
import PropTypes from 'prop-types'

// UI Imports
import Typography from '@material-ui/core/Typography/Typography'
import { withStyles } from '@material-ui/core/styles/index'
import styles from './styles'

// App Imports
import Body from '../../common/Body'
import Header from '../../common/Header'
import ActionBack from '../../common/Header/ActionBack'
import Section from '../../common/Section'

// Component
const Dashboard = ({ classes }) => (
  <Body>
    <Header
      title={'Contact'}
      leftIcon={
        <ActionBack />
      }
    />

    <Section>
      <Typography>Classis germanus habena est. Quadra de grandis bromium, imitari rector!</Typography>
    </Section>
  </Body>
)

// Component Properties
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Dashboard)


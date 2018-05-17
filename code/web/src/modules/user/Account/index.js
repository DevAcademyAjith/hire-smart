// Imports
import React from 'react'
import { Helmet } from 'react-helmet'

// UI Imports
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import styles from './styles'

// App Imports

// Component
const Account = (props) => {
  const { classes } = props
  
  return(
    <div>
      {/* Meta tags */}
      <Helmet>
        <title>Account - Hire Smart</title>
      </Helmet>

      <Grid container>
        <Grid item xs={12}>
          <Typography variant="display1">
            Account
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Account)

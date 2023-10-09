import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SpeakerRoundedIcon from '@mui/icons-material/SpeakerRounded';

export default function SearchAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static"
      >
        <Toolbar>
        <SpeakerRoundedIcon />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1,
                  //display: { xs: 'none', sm: 'block' },
                  marginLeft: "5px",
                  fontFamily: [
                    'Major Mono Display',
                  ].join(','),
                  fontSize: "25px",
                }}
          >
            WP Music
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
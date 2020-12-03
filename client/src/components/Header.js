import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

// navbar style
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

// header component 
function Header({
  debounce,
  getLabelPosts,
  getPosts,
  setAnalytics,
  analytics,
}) {
  const classes = useStyles();
  const [sideBar, setSideBar] = React.useState({ left: false });
  const [notification, setNotification] = React.useState([
    { date: Date.now() },
  ]);
  const [iconColor, setIconColor] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // check scraper notification
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await axios.get("/api/notifications/last");
      console.log("data", data);
      console.log("notification", notification);
      if (data[0].date > notification[notification.length - 1].date) {
        setNotification([...notification, data[0]]);
        setIconColor("error");
        alert("new notification");
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [notification]);

  // open side bar
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setSideBar({ left: open });
  };

  // show notification
  const handleClick = () => {
    if(iconColor === '')return;
    setOpen(true);
  };

  // close notification
  const handleClose = (event, reason) => {
    setIconColor('')
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // side bar
  const list = () => (
    <div
      className={clsx(classes.list, {})}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => setAnalytics(false)}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <Divider />
        {!analytics &&
          ["weapons", "money", "url", "porn", "internet"].map((label, i) => {
            return (
              <ListItem key={i} button onClick={() => getLabelPosts(label)}>
                <ListItemIcon></ListItemIcon>
                <ListItemText secondary={label} />
              </ListItem>
            );
          })}
        {!analytics && (
          <ListItem button onClick={getPosts}>
            <ListItemIcon></ListItemIcon>
            <ListItemText secondary={"All Posts"} />
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => setAnalytics(true)}>
          <ListItemIcon>
            <ShowChartIcon />
          </ListItemIcon>
          <ListItemText primary={"Analitics"} />
        </ListItem>
      </List>
    </div>
  );

  // my header
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <NotificationsIcon color={iconColor} onClick={handleClick} />
          <Typography className={classes.title} variant="h6" noWrap>
            What Can You Find In The Dark Net
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => debounce(e.target.value)}
            />
          </div>
        </Toolbar>
      </AppBar>
      {sideBar.left && (
        <Drawer open={sideBar} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={notification[notification.length - 1].message}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default Header;

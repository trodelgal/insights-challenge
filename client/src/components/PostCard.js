import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "70%",
    border: 'solid 1px black',
    margin:5,
    opacity: 0.9
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const PostCard = React.memo(({ post }) => {
    const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {post.title}
        </Typography>
        <Typography variant="body2" component="div">
          {post.content.trim()}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {`${post.author} | ${new Date(post.date).toDateString()}`}
        </Typography>
        
        <Typography className={classes.pos} style={{display:"flex"}}>
          {
            post.labels.map((label,i)=>{
              if(label !== post.labels[i-1]){
                return <div key={i} className="label">{label}</div>
              }
            })
          }
        </Typography>

      </CardContent>
    </Card>
  );
});

export default PostCard;

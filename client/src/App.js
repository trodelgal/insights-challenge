import "./App.css";
import { useEffect, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import PostCard from "./components/PostCard";
import pic from './pictures/darknet.jpeg';

function App() {
  const [posts, setPosts] = useState();
  const [search, setSearch] = useState("");

  const getPosts = useCallback(async () => {
    try{
      const { data } = await axios.get(`/api/posts/${search}`);
      // const firebase = await axios.get('https://insight-challenge.firebaseio.com/posts.json');
      console.log(data);
      setPosts(data);
    }catch(err) {
      console.error(err)
    }
  }, [search]);

  useEffect(() => {
    getPosts();
  }, [search]);

  return (
    <div className="App" style={{background:pic}}>
      <TextField
        id="standard-basic"
        label="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ margin: 10 }}
        onClick={() => getPosts()}
      >
        find more posts
      </Button>
      <div style={{ margin: 10 , display: 'flex', flexDirection: 'column' , alignItems: 'center' }}>
        {posts &&
          posts.map((post, i) => {
              return <PostCard key={i} post={post} />
          })}
      </div>
    </div>
  );
}

export default App;

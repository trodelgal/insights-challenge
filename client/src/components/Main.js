import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import _ from "lodash";
import Header from "./Header";
import CircularProgress from "@material-ui/core/CircularProgress";

function Main() {
  const [posts, setPosts] = useState();
  const [search, setSearch] = useState("");

  // get all the posts and search in them
  const getPosts = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/posts/${search}`);
      // const firebase = await axios.get('https://insight-challenge.firebaseio.com/posts.json');
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }, [search]);

  // debounce the http requests
  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setSearch(_searchVal);
    }, 500),
    []
  );

  const getLabelPosts = useCallback(async(label) => {
    try{
      const { data } = await axios.get(`/api/labels/${label}`);
      setPosts(data);
    }catch(err){
      console.error(err)
    }
  },[])

  useEffect(() => {
    getPosts();
  }, [search]);

  return (
    <div>
      <Header debounce={debounce} getLabelPosts={getLabelPosts} getPosts={getPosts} />
      <div
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {posts ? (
          posts.map((post, i) => {
            return <PostCard key={i} post={post} />;
          })
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

export default Main;

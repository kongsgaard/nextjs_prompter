"use client";
import { useState, useEffect } from "react"
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = (val) => {
    const regex = new RegExp(val, "i");
    return posts.filter((item) => (
      regex.test(item.prompt)
    ));
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 100)
    );

  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);
  
  

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />

      </form>
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={() => {}}
        />
        ) : (
        <PromptCardList
          data={posts}
          handleTagClick={() => {}}
        />
        )}
      
    </section>
  )
}

export default Feed
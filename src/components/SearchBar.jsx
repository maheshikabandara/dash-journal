import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const searchBlog = (e) => {
    e.preventDefault();
    searchFirestore();
    setSearch('');
  };

  const searchFirestore = async () => {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('Title', '==', search)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const searchResults = new Set();
  
      postsSnapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        searchResults.add(JSON.stringify(postData));
      });
  
      const uniqueSearchResults = Array.from(searchResults).map((result) =>
        JSON.parse(result)
      );
  
      navigate(`/?search=${encodeURIComponent(search)}`, { state: { searchResults: uniqueSearchResults } });
    } catch (error) {
      console.error('Error searching blog:', error);
    }
  };
  
  

  return (
    <div>
      <form onSubmit={searchBlog}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchBar;

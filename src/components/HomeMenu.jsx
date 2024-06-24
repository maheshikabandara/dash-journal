import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';


const HomeMenu = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');
  const categoryQuery = queryParams.get('cat');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        if (searchQuery) {
          const filteredPosts = fetchedPosts.filter((post) =>
            post.Title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setPosts(filteredPosts);
        } else {
          const sortedPosts = fetchedPosts.sort((a, b) => {
            if (a.time && b.time) {
              return b.time.localeCompare(a.time);
            } else {
              return 0; 
            }
          });
          setPosts(sortedPosts);
        }
    
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };  
    fetchPosts();
  }, [searchQuery, categoryQuery]);
  

  return (
    <div className='homemenu'>
        <div className="posts">
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="content">
                <div className="text-content">
                  <Link className="link" to={`/post/${post.id}`}>
                    <h2>{post.Title}</h2>
                  </Link>
                  <Link className="link" to={`/post/${post.id}`}>
                  <div
                    className="desc"
                    dangerouslySetInnerHTML={{ __html: post.Body }}
                  />
                  </Link>
                </div>
              </div>
               <hr /> 
            </div>
          ))}
        </div>
    </div>
  );
};

export default HomeMenu;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Management = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Management');
        const postsQuery = query(postsRef, orderBy('timestamp', 'desc'));

        const querySnapshot = await getDocs(postsQuery);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);
  const convertToPlainText = (html) => {
    const element = document.createElement('div');
    element.innerHTML = html;
    return element.textContent || element.innerText || '';
  };


  return (
    <div className='cat-tabs'>
      <div className="posts">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <div className="content">
            <div className="img">
              <img src={post.Image} alt="Post Image" />
            </div>
            <div className="text-content">
            <Link className="link" to={`/post/${post.id}`}>
              <h2>{post.Title}</h2>
            </Link>
            <Link className="link" to={`/post/${post.id}`}>
              <div className="desc">{convertToPlainText(post.Body)} </div>
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

export default Management;

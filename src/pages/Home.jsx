import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Accountancy from '../Categories/Accountancy';
import Agriculture from '../Categories/Agriculture';
import English from '../Categories/English';
import IT from '../Categories/IT';
import Management from '../Categories/Management';
import Thm from '../Categories/Thm';
import HomeMenu from '../components/HomeMenu';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');
  const categoryQuery = queryParams.get('cat');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [clickedPosts, setClickedPosts] = useState([]);


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
          setPosts(fetchedPosts);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [searchQuery, categoryQuery]);

  const convertToPlainText = (html) => {
    const element = document.createElement('div');
    element.innerHTML = html;
    return element.textContent || element.innerText || '';
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePostClick = (postId) => {
    if (!clickedPosts.includes(postId)) {
      setClickedPosts((prevClickedPosts) => [...prevClickedPosts, postId]);
  
      const incrementUniqueViews = async () => {
        try {
          const response = await fetch(`/api/posts/${postId}/views`, {
            method: 'POST',
          });
          if (response.ok) {
            console.log('Unique views incremented successfully!');
          } else {
            console.error('Failed to increment unique views');
          }
        } catch (error) {
          console.error('Error incrementing unique views:', error);
        }
      };
  
      incrementUniqueViews();
    }
  };
  

  return (
    <div className="home">
      {categoryQuery === 'accountancy' ? (
        <Accountancy />
      ) : categoryQuery === 'agriculture' ? (
        <Agriculture />
      ) : categoryQuery === 'it' ? (
        <IT />
      ) : categoryQuery === 'english' ? (
        <English />
      ) : categoryQuery === 'management' ? (
        <Management />
      ) : categoryQuery === 'thm' ? (
        <Thm />
      ) : (
        <div className="posts">
          {currentPosts.map((post) => (
            <div className="post" key={post.id}>
              <div className="content">
                <div className="img">
                  <img src={post.Image} alt="Post Image" />
                </div>
                <div className="text-content">
                  <Link className="link" to={`/post/${post.id}`} onClick={() => handlePostClick(post.id)}>
                    <h2>{post.Title}</h2>
                  </Link>
                  <Link className="link" to={`/post/${post.id}`} onClick={() => handlePostClick(post.id)}>
                    <div className="desc">{convertToPlainText(post.Body)}</div>
                  </Link>
                </div>
              </div>
              <hr />
            </div>
          ))}
          <div className="pagination" >
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="homeMenu">
       
      </div>
    </div>
  );
};

export default Home;

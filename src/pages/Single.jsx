import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Edit from '../images/Edit.png';
import Delete from '../images/Delete.png';
import Whatsapp from '../images/whatsapp.png';
import Facebook from '../images/facebook.png';
import Twitter from '../images/twitter.png';
import CommentSec from '../components/CommentSec';
import { db } from '../firebase';
import { getDoc, doc, deleteDoc, updateDoc, serverTimestamp, runTransaction, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const Single = ({ user }) => {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      const category = post.Category;
      const categoryDoc = doc(db, category, id);
      await deleteDoc(categoryDoc);

      alert('Document successfully deleted!');
      navigate('/');
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  const handleEdit = () => {
    if (post) {
      navigate(`/edit/${post.id}`);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', id));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const incrementUniqueViews = async () => {
    try {
      const postRef = doc(db, 'posts', id);
      await runTransaction(db, async (transaction) => {
        const postSnapshot = await transaction.get(postRef);
        const views = postSnapshot.get('uniqueViews') || 0;

        const viewedBy = postSnapshot.get('viewedBy') || [];
        const userId = user?.uid; 
        if (userId && !viewedBy.includes(userId)) {
          transaction.update(postRef, {
            uniqueViews: views + 1,
            viewedBy: [...viewedBy, userId],
          });
        }
      });
    } catch (error) {
      console.error('Error incrementing unique views:', error);
    }
  };

  useEffect(() => {
    if (post) {
      incrementUniqueViews();
    }
  }, [post]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const body = post.Body;

  const shareFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareTwitter = () => {
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
  };

  const shareWhatsApp = () => {
    const url = window.location.href;
    const message = encodeURIComponent(`Check out this post: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="single">
      <div className="content">
        <img src={post.Image} alt="Post Image" />
        <div className="user">
          <div className="info">
            <span>{post.userName}</span>
            <p>Posted {formatDateTime(post.timestamp.toDate())}</p>
          </div>

          <div className="edit">
            {user?.uid === post.userId && ( 
              <>
                <Link to={`/edit/${post.id}`}>
                  <img onClick={handleEdit} src={Edit} alt="" />
                </Link>
                <img onClick={() => deleteBlog(post.id)} src={Delete} alt="" />
              </>
            )}
          </div>
          <div className="clicks">{post.uniqueViews} Unique Views</div>
        </div>

        <div className="post">
          <h1 name="title">{post.Title}</h1>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </div>
      <div className="menu">
        <div className="share">
          <img src={Facebook} onClick={shareFacebook} alt="Share on Facebook" />
          <img src={Twitter} onClick={shareTwitter} alt="Share on Twitter" />
          <img src={Whatsapp} onClick={shareWhatsApp} alt="Share on WhatsApp" />
        </div>
      </div>
    </div>
  );
};

export default Single;

import React, { useState, useEffect } from 'react';
import { collection, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';

const CommentSection = ({ id }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentlyLoggedinUser] = useAuthState(auth);

  useEffect(() => {
    const docRef = doc(db, 'comments', id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setComments(snapshot.data().comments);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const handleDelete = (commentId) => {
    const commentRef = doc(db, 'comments', id);
    updateDoc(commentRef, {
      comments: comments.filter((comment) => comment.commentId !== commentId),
    }).catch((error) => {
      console.error('Error deleting comment:', error);
    });
  };

  const handleChange = (e) => {
    if (e.key === 'Enter') {
      const commentRef = doc(db, 'comments', id);
      const newComment = {
        user: currentlyLoggedinUser.uid,
        userName: currentlyLoggedinUser.displayName,
        comment: comment,
        createdAt: new Date(),
        commentId: uuidv4(),
      };

      updateDoc(commentRef, {
        comments: arrayUnion(newComment),
      })
        .then(() => {
          setComment('');
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
    }
  };

  return (
    <div className="commentsec">
      <div className="container">
        {comments !== null &&
          comments.map(({ commentId, user, comment, userName }) => (
            <div key={commentId}>
              <div>
                <span
                  className={`badge ${
                    user === currentlyLoggedinUser.uid
                      ? 'bg-success'
                      : 'bg-primary'
                  }`}
                >
                  {userName}
                </span>
                {comment}
              </div>
              <div className="delete">
                {user === currentlyLoggedinUser.uid && (
                  <i onClick={() => handleDelete(commentId)}>Delete</i>
                )}
              </div>
            </div>
          ))}
        {currentlyLoggedinUser && (
          <input
            type="text"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Add a Comment"
            onKeyUp={(e) => {
              handleChange(e);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;

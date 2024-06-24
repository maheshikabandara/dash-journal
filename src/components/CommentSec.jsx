import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';

const CommentSec = ({ user }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const onChangeHandler = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newComment = {
        userName: user.displayName,
        comment: comment,
        timestamp: serverTimestamp(),
        userId: user.uid,
        postId: id,
      };

      await addDoc(collection(db, 'comments'), newComment);

      setComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, []);

  const startCommentEdit = (commentId) => {
    if (comments) {
      const commentToEdit = comments.find((comment) => comment.id === commentId);
      if (commentToEdit) {
        setEditingComment(commentId);
        setNewCommentContent(commentToEdit.comment);
      }
    }
  };

  const handleCommentUpdate = async (commentId) => {
    if (comments) {
      try {
        const commentRef = doc(db, 'comments', commentId);
        await updateDoc(commentRef, { comment: newCommentContent });
        setEditingComment(null);
        setNewCommentContent('');
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    }
  };

  const cancelCommentEdit = () => {
    setEditingComment(null);
    setNewCommentContent('');
  };

  const deleteComment = async (commentId) => {
    if (comments) {
      try {
        await deleteDoc(doc(db, 'comments', commentId));
        alert('Comment successfully deleted!');
      } catch (error) {
        console.error('Error removing comment: ', error);
      }
    }
  };

  const formatDateTime = (date) => {
    if (date) {
      return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }
    return 'Unknown';
  };

  return (
    <div className="commentsec">
      {comments && comments.map((comment) => (
        <div key={comment.id} className="container">
          <span>{comment.userName}</span>
          <p>{formatDateTime(comment.timestamp ? comment.timestamp.toDate() : null)}</p>
          {editingComment === comment.id ? (
            <input
              type="text"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
            />
                 ) : (
          <p>{comment.comment}</p>
        )}
        <div className="edit">
          {comment.userId === user.uid && (
            <>
              {editingComment === comment.id ? (
                <>
                  <button onClick={() => handleCommentUpdate(comment.id)}>Save</button>
                  <button onClick={() => cancelCommentEdit()}>Cancel</button>
                </>
              ) : (
                <button onClick={() => startCommentEdit(comment.id)}>Edit</button>
              )}
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    ))}
    <div className="textcom">Comments</div>
    <div className="addcomment">
      <textarea value={comment} onChange={onChangeHandler} />
      <button className="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  </div>
);
};

export default CommentSec;

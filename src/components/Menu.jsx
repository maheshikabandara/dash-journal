import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';
import { doc, updateDoc, serverTimestamp, fieldValue } from 'firebase/firestore';

const Menu = ({id, user }) => {
  const [comment, setComment] = useState('');

  const handleComment = (e) => {
    if (e.key === 'Enter') {
      const blogRef = doc(db, 'blogs', id);
      updateDoc(blogRef, {
          comments: serverTimestamp.FieldValue.arrayUnion({
          userid: user.uid,
          username: user.displayName,
          comment: comment,
          createdAt: serverTimestamp(),
          commentId: uuidv4(),
        }),
      })
        .then(() => {
          setComment('');
        })
        .catch((error) => {
          console.error('Error updating comments:', error);
        });
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <input
            type="text"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Type a comment..."
            onKeyUp={handleComment}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Menu;

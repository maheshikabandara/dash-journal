import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, doc,setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categoryOptions = [
  'Accountancy',
  'Agriculture',
  'English',
  'IT',
  'Management',
  'THM',
];

const AddEditBlog = ({user}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [img, setImg] = useState(null);
  const [category, setCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const { id } = useParams();

  const submit = async (e) => {
    e.preventDefault();
  
    if (title.trim() === '') {
      alert('Please enter a title');
      return;
    }
  
    try {
      setShowPopup(true);
      const imageRef = ref(storage, 'images/' + img.name);
      await uploadBytes(imageRef, img);
  
      const imageUrl = await getDownloadURL(imageRef);
  
      const postId = uuidv4();
  
      const post = {
        Title: title,
        Body: value, 
        Image: imageUrl,
        Category: category,
        timestamp: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
      };
  
      const postsRef = doc(db, "posts", postId);
      await setDoc(postsRef, post);
  
      const categoryRef = doc(db, category, postId);
      await setDoc(categoryRef, post);
 
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setShowPopup(false);
    }
  };  

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  return (
    <div className='add'>
      <form onSubmit={submit}>
        <input className='title'
          type="text"
          placeholder="Title"
          name='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
       <div className="editor">
          <ReactQuill theme="snow" name='decription' value={value} onChange={setValue} />
       </div>
      
        <input className='img' type="file" name="img" accept="image/*" onChange={handleImageChange} />

        <div className="category">
          <select
            value={category}
            name='category'
            onChange={(e) => setCategory(e.target.value)}
            className="catg-dropdown"
          >
            <option value="">Please select category</option>
            {categoryOptions.map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="submit">
          <button type="submit-button" name='submit'>Submit</button>
        </div>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span>Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditBlog;

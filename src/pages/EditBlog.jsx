import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

const EditBlog = () => {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [img, setImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await getDoc(doc(db, 'posts', id));
        if (blogDoc.exists()) {
          const data = blogDoc.data();
          setTitle(data.Title);
          setBody(data.Body);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setShowPopup(true);

    try {
      let imageUrl = null;

      if (img) {
        const imageRef = ref(storage, 'images/' + img.name);
        await uploadBytes(imageRef, img);
        imageUrl = await getDownloadURL(imageRef);
      }

      const blogRef = doc(db, 'posts', id);
      await updateDoc(blogRef, {
        Title: title,
        Body: body,
        Image: imageUrl,
        timestamp: serverTimestamp(),
      });

      navigate(`/post/${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  return (
    <div className="add">
      <form onSubmit={submit}>
        <input
          className="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="editor">
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
          />
        </div>
        <input
          className="img"
          type="file"
          name="img"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="category">
          <select
            value={category}
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

        <button type="submit">Submit</button>
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

export default EditBlog;

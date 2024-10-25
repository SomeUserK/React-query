import axios from 'axios';

const { VITE_API_URL: apiUrl } = import.meta.env;

export const getPosts = async () => {
  const { data } = await axios.get(`${apiUrl}`);

  return data;
};

export const createPost = async newPost => {
  const { data } = await axios.post(`${apiUrl}`, newPost);

  return data;
};

export const updatePost = async ({ id, updatedData }) => {
  const { data } = await axios.put(`${apiUrl}/${id}`, updatedData);

  return data;
};
export const deletePost = async id => {
  const { data } = await axios.delete(`${apiUrl}/${id}`);

  return data;
};

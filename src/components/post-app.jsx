import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  createPost,
  getPosts,
  updatePost,
  deletePost
} from '../services/posts';
import { toast } from 'sonner';

export default function PostApp() {
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  const mutationCreatePost = useMutation({
    mutationKey: ['post', 'create'],
    mutationFn: createPost,
    onSuccess: data => {
      toast.success(`Post creado ${JSON.stringify(data)}!`);
      queryClient.invalidateQueries('posts');
    },
    onError: error => {
      toast.error(`Error creando post: ${error.message}`);
    }
  });

  const mutationUpdatePost = useMutation({
    mutationKey: ['post', 'update'],
    mutationFn: updatePost,
    onSuccess: data => {
      toast.success(`Post actualizado ${JSON.stringify(data)}!`);
      queryClient.invalidateQueries('posts');
    },
    onError: error => {
      toast.error(`Error actualizando post: ${error.message}`);
    }
  });

  const mutationDeletePost = useMutation({
    mutationKey: ['post', 'delete'],
    mutationFn: deletePost,
    onSuccess: data => {
      toast.success(`Post eliminado ${JSON.stringify(data)}!`);
      queryClient.invalidateQueries('posts');
    },
    onError: error => {
      toast.error(`Error eliminando post: ${error.message}`);
    }
  });

  const handleChanges = ({ target }) => {
    const { name, value } = target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!newPost.title || !newPost.body) return;

    mutationCreatePost.mutate(newPost);
    setNewPost({ title: '', body: '' });
  };

  const handleUpdatePost = (
    id,
    updatedData = { title: 'sas', body: 'sus' }
  ) => {
    mutationUpdatePost.mutate({ id, updatedData });
  };

  const handleDeletePost = id => mutationDeletePost.mutate(id);

  if (query.isLoading) return <p>Loading...</p>;
  if (query.error) return <p>Error fetching posts: {query.error.message}</p>;

  return (
    <div>
      <h1>PostApp - Español</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Titulo"
          value={newPost.title}
          onChange={handleChanges}
        />
        <textarea
          name="body"
          placeholder="Contenido"
          value={newPost.body}
          onChange={handleChanges}
        ></textarea>
        <button type="submit">Crear</button>
      </form>

      <h2>Posts List</h2>
      <ul>
        {query.data.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleUpdatePost(post.id)}>Editar</button>
            <button onClick={() => handleDeletePost(post.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

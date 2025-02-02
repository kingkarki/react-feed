import axios from "axios";
import { create } from "zustand";

interface Post {
  id: number,
  title: string,
  body: string,
  userId: number,
  comments: string[], 
  showComments: boolean,
  reactions:{
    dislikes: number,
    likes: number,
  }
  tags: String[],
  showFullDescription: boolean,
  views: number,
}

interface StoreState {
  posts: Post[];
  fetchPosts: () => Promise<void>;
  addComment: (postId: number, comment: string) => void;
  toggleCommentsVisibility: (postId: number) => void;
  toggleDescriptionVisibility: (postId: number) => void;
}

const useStore = create<StoreState>((set) => ({
  posts: [],
  fetchPosts: async () => {
    try {
      const response = await axios.get<{ posts: Post[] }>(
        "https://dummyjson.com/posts"
      );
      const postsWithComments = response.data.posts.map((post) => ({
        ...post,
        comments: [], // Initialize empty comment list for each post
      }));
      set({ posts: postsWithComments });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  },
  addComment: (postId, comment) => {
    set((state) => {
      const updatedPosts = state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      );
      return { posts: updatedPosts };
    });
  },
  toggleCommentsVisibility: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.map((post) => {
        return post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post;
      });
      return { posts: updatedPosts };
    });
  },
  toggleDescriptionVisibility: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.map((post) =>
        post.id === postId ? { ...post, showFullDescription: !post.showFullDescription } : post
      );
      return { posts: updatedPosts };
    });
  },
}));

export default useStore;

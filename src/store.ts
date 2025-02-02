import axios from "axios";
import { create } from "zustand";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  comments: string[];
  showComments: boolean;
  reactions: {
    dislikes: number;
    likes: number;
  };
  tags: string[];
  showFullDescription: boolean;
  views: number;
  liked: boolean;
}

interface StoreState {
  posts: Post[];
  fetchPosts: () => Promise<void>;
  addComment: (postId: number, comment: string) => void;
  toggleCommentsVisibility: (postId: number) => void;
  toggleDescriptionVisibility: (postId: number) => void;
  toggleLike: (postId: number) => void;
}

const useStore = create<StoreState>((set) => ({
  posts: [],
  fetchPosts: async () => {
    try {
      const response = await axios.get<{ posts: Post[] }>(
        "https://dummyjson.com/posts"
      );
      const postsWithState = response.data.posts.map((post) => ({
        ...post,
        comments: [], // Initialize empty comment list for each post
        showComments: false,
        showFullDescription: false,
        liked: false,
        // If reactions aren't available, you can set a default value:
        reactions: {
          dislikes: post.reactions?.dislikes || 0,
          likes: post.reactions?.likes || 0,
        },
      }));
      set({ posts: postsWithState });
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
      const updatedPosts = state.posts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      );
      return { posts: updatedPosts };
    });
  },
  toggleDescriptionVisibility: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.map((post) =>
        post.id === postId
          ? { ...post, showFullDescription: !post.showFullDescription }
          : post
      );
      return { posts: updatedPosts };
    });
  },
  toggleLike: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === postId) {
          if (post.liked) {
            // If already liked, remove like
            return {
              ...post,
              liked: false,
              reactions: {
                ...post.reactions,
                likes: post.reactions.likes - 1,
              },
            };
          } else {
            // Otherwise, add a like
            return {
              ...post,
              liked: true,
              reactions: {
                ...post.reactions,
                likes: post.reactions.likes + 1,
              },
            };
          }
        }
        return post;
      });
      return { posts: updatedPosts };
    });
  },
}));

export default useStore;

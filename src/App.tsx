import React, { useEffect, useState } from "react";
import useStore from "./store";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Heart,
  Share,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "./lib/utils";

const App: React.FC = () => {
  const {
    posts,
    fetchPosts,
    addComment,
    toggleCommentsVisibility,
    toggleDescriptionVisibility,
    toggleLike,
  } = useStore();
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddComment = (postId: number) => {
    if (newComment.trim()) {
      addComment(postId, newComment);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been successfully posted.",
      });
    }
  };

  const handleToggleComments = (postId: number) => {
    toggleCommentsVisibility(postId);
  };

  return (
    <div className="min-w-screen overflow-hidden min-h-screen bg-gradient-to-br from-[#0A0F24] to-[#1B2430] p-6">
      <div className="container max-w-[650px] mx-auto py-10 px-4">
        <motion.div
          key={"title"}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-center text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400  to-[#006eff] bg-clip-text text-transparent">
            Social Feed
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-y-10">
          {posts.map((post) => {
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group relative overflow-hidden backdrop-blur-sm bg-[#1E293B] text-white border border-[#2C3E50] shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={`https://i.pravatar.cc/150?u=${post.userId}`}
                          />
                          <AvatarFallback>U{post.userId}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg leading-none">
                            User {post.userId}
                          </h3>
                          <p className="text-sm text-[#AAB4C2]">Just now</p>
                        </div>
                      </div>

                      <Share className="size-12 p-3 cursor-pointer hover:bg-[#1B2430] rounded-lg" />
                    </div>

                    <div className="overflow-hidden my-1 mb-3 rounded-lg">
                      <img
                        src={`https://i.pravatar.cc/1080?u=${post.userId}`}
                        alt="Post cover"
                        className="w-full h-full max-h-[450px] object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <p className="text-[#AAB4C2] mb-2">
                      {post.reactions.likes} Likes {post.views} Views
                    </p>
                    <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                    <p className=" text-[#AAB4C2] mb-2">
                      {post.showFullDescription
                        ? post.body
                        : `${post.body.substring(0, 100)}`}
                      {post.tags.map((t) => (
                        <span className="text-blue-400  cursor-pointer">
                          {" "}
                          #{t}
                        </span>
                      ))}
                      {!post.showFullDescription && "..."}{" "}
                      <span
                        className=" underline cursor-pointer"
                        onClick={() => toggleDescriptionVisibility(post.id)}
                      >
                        {post.showFullDescription ? "View Less" : "View More"}
                      </span>
                    </p>

                    <div className="flex  mb-3">
                      <Heart
                        onClick={() => toggleLike(post.id)}
                        className={cn(
                          "size-12 p-3 cursor-pointer hover:bg-[#1B2430] rounded-lg",
                          post.liked && "fill-[#ff0000] stroke-[#ff0000]" // Instagram like color
                        )}
                      />

                      {
                        <MessageCircle
                          onClick={() => handleToggleComments(post.id)}
                          className={cn(
                            "size-12 p-3 cursor-pointer  hover:bg-[#1B2430] rounded-lg",
                            post.showComments && " stroke-[#006eff]"
                          )}
                        />
                      }

                      <Send className="size-12 p-3 cursor-pointer hover:bg-[#1B2430] rounded-lg" />
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComments(post.id);
                      }}
                      className="w-full group relative z-50 h-12 text-white bg-[#006eff] hover:bg-[#006effb3] hover:scale-[1.01] flex justify-center items-center rounded-xl cursor-pointer transition-all"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.showComments ? "Hide comments" : "Show comments"}
                      {post.showComments ? (
                        <ChevronUp className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-2" />
                      )}
                    </div>

                    <AnimatePresence>
                      {post.showComments && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 space-y-4 relative z-50">
                            <div className="flex gap-3">
                              <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddComment(post.id);
                                  }
                                }}
                                className="flex-1 rounded-lg h-12 px-4 bg-[#1B2430] text-white border border-[#006eff] focus:ring-2 focus:ring-[#006eff]"
                              />
                              <div
                                onClick={() => handleAddComment(post.id)}
                                className="rounded-lg flex items-center justify-center bg-[#006eff] hover:bg-[#006effb3] text-white size-12 group cursor-pointer"
                              >
                                <Send className="w-4 h-4 group-hover:scale-[1.15] " />
                              </div>
                            </div>

                            <ScrollArea className="h-[200px] rounded-md border border-[#34495e64] bg-[#1B2430] p-4">
                              {post.comments.length > 0 ? (
                                <div className="gap-y-2">
                                  {post.comments.map((comment, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#3B4D61]"
                                    >
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage
                                          src={`https://i.pravatar.cc/150?u=${index}`}
                                        />
                                        <AvatarFallback>
                                          U{index}
                                        </AvatarFallback>
                                      </Avatar>
                                      <p className="text-sm text-white">
                                        {comment}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-center h-full flex justify-center items-center text-[#AAB4C2]">
                                  No comments yet
                                </p>
                              )}
                            </ScrollArea>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;

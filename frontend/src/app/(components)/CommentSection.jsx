import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CommentSection = ({ blogId, blogSlug }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/get-comments/${blogSlug}`
        );
        if (res.ok) {
          const data = await res.json();

          setComments(data);
          console.log("Comments data:", data);
        } else {
          console.error("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blog data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blogSlug]);

  // Submit new comment
  const validationSchema = Yup.object({
    commentText: Yup.string().required("Comment is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleCommentSubmit = async (values) => {
    const { commentText, name, email } = values;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/web/add-comment/${blogId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText, name, email }),
      }
    );

    if (response.ok) {
      const newComment = await response.json();
      setComments([newComment, ...comments]);
      formik.resetForm();
      toast.success("Comment posted successfully");
    } else {
      console.log("Failed to post comment");
    }
  };

  const formik = useFormik({
    initialValues: {
      commentText: "",
      name: "",
      email: "",
    },
    validationSchema,
    onSubmit: handleCommentSubmit,
  });
  if (loading) return <div>Loading...</div>;

  return (
    <div className=" w-full xl:w-[95%] xl:float-end comment-section my-7 ">
      {/* Comment Form */}
      <div className="comment-form mt-5 p-4 sm:p-6 bg-white border-2 shadow-lg rounded-lg font-RedditSans">
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">
          Leave a Comment
        </h4>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <textarea
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-lightBlue"
            placeholder="Your Comment"
            name="commentText"
            value={formik.values.commentText}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.commentText && formik.errors.commentText && (
            <div className="text-red-500 text-xs mt-0">
              {formik.errors.commentText}
            </div>
          )}

          <div className="flex space-x-4 my-3">
            <div className="w-1/2">
              <input
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-lightBlue"
                type="text"
                placeholder="Your Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>
            <div className="w-1/2">
              <input
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-lightBlue"
                type="email"
                placeholder="Your Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-darkGray hover:bg-gray-200 text-quaternary font-semibold py-2 rounded"
          >
            Post Comment
          </button>
        </form>
      </div>

      {comments.length > 0 && (
        <div className="sm:p-5">
          <div className="flex align-bottom justify-between mx-auto px-1">
            <p className="text-lg sm:text-2xl my-7 font-bold font-RedditSans">
              All comments on this post
            </p>
            <div className="text-xs sm:text-sm my-2 ml-5 flex items-center gap-1 font-Montserrat font-medium">
              <p className="font-semibold">Comments :</p>
              <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p>{comments.length}</p>
              </div>
            </div>
          </div>

          <div className="comments-list space-y-6 font-RedditSans">
            {comments.map((comment) => (
              <div
                key={comment.blogCommentId}
                className="comment-item p-4 bg-white border border-spaceblack border-b-4 shadow-lg rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-spaceblack">
                    {comment.commentAddedByName}
                  </p>
                  <p className="text-xs  text-spaceblack ">
                    {new Date(comment.commentAddedDate * 1000).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )}
                  </p>
                </div>
                <p className="text-xs xl:w-96 font-medium text-gray-500 border-b-2 border-spaceblack pb-2">                  
                  {comment.commentAddedByEmail}
                </p>
                <p className="mt-2 font-medium text-spaceblack">{comment.commentText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;

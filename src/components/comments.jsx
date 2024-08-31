import style from "../styles/comments.module.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import Comment from "./comment";
import CommentForm from './commentForm';
import { addComment as addCommentAPI, getComments as getCommentsAPI, editComment as editCommentAPI, deleteComment as deleteCommentAPI } from "../feature/comment/commentSlice";
import { sortTime } from "../api/sortTime";

export default function Comments({ postComments, postId }){
    const [comments, setComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);
    const rootComments = comments.filter(comment => comment.parentId == null);
    const dispatch = useDispatch();
    const getReplies = commentId => {
        return sortTime(comments
            .filter(comment => comment.parentId === commentId));
    }
    const { user } = useSelector(
        (state) => state.auth
    )
    const getCommentsData = {
        user: user,
        postId: postId
    }

    const addComment = (text, parentId) => {
        
        const addCommentsData = {
            user: user,
            postId: postId,
            body: text,
            parentId: parentId
        }
        dispatch(addCommentAPI(addCommentsData)).then(res => {
            dispatch(getCommentsAPI(getCommentsData)).then(elem => {
                setComments(sortTime(elem.payload));
            });
            setActiveComment(null);
        })

    }

    const editComment = (text, parentId) => {
        const editCommentsData = {
            comment: {
                body: text,
                commentId: parentId
            },
            user: user
        }

        dispatch(editCommentAPI(editCommentsData)).then(res => {
            dispatch(getCommentsAPI(getCommentsData)).then(elem => {
                setComments(sortTime(elem.payload));
            });
            setActiveComment(null);
        })
    }

    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure that you want to delete comment")) {
            const deleteCommentsData = {
                comment: {
                    commentId: commentId
                },
                user: user
            }
    
            dispatch(deleteCommentAPI(deleteCommentsData)).then(res => {
                dispatch(getCommentsAPI(getCommentsData)).then(elem => {
                    setComments(sortTime(elem.payload));
                });
            })
        }
    }

    useEffect(()=>{
        setComments(postComments);
    },[postComments]);

    return(    
    
        <div className={style.contentWrapper}>
            <div className={style.comments}>
                <h3 className={style.commentsTitle}>Comments</h3>
                <div className={style.commentForm}>
                    <div className={style.commentFormTitle}>Write a Comment</div>
                    <CommentForm submitLabel="Write" handleSubmit={addComment} />
                </div>
            </div>
            <div className={style.commentsContainer}>
                { rootComments.map((comment, index) => {
                    return (
                        <div key={index}>
                            {/* think about lazy loading when lot of replies */}
                            <Comment 
                                comment={comment} 
                                replies={getReplies(comment._id)} 
                                deleteComment={deleteComment}  
                                addComment={addComment}  
                                editComment={editComment}
                                activeComment={activeComment}
                                setActiveComment={setActiveComment} 
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    
    )

}
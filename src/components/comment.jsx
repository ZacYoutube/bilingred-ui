import { useSelector } from "react-redux";
import CommentForm from "./commentForm";
import style from "../styles/comment.module.css";

export default function Comment({ 
    comment, 
    replies, 
    deleteComment, 
    addComment, 
    editComment,
    activeComment, 
    setActiveComment,
    parentId = null 
}){
    const { user } = useSelector((state) => state.auth);
    const currentUserId = user._id;
    const canReply = Boolean(currentUserId);
    const canEdit = currentUserId === comment.userId;
    const canDelete = currentUserId === comment.userId;
    const createdAt = new Date(comment.createdAt).toLocaleDateString() + " @ " + new Date(comment.createdAt).toLocaleTimeString();
    const isReplying = activeComment && activeComment.type === "replying" && activeComment.id === comment._id;
    const isEditing = activeComment && activeComment.type === "editing" && activeComment.id === comment._id;
    const replyId = parentId ? parentId : comment._id;

    return (
        <div className={style.comment}>
            <div className={style.commentImageContainer}>
                <img src={comment.userProfileImage} />
            </div>
            <div className={style.commentRightPart}>
                <div className={style.commentContent}>
                    <div className={style.commentAuthor}>{comment.username}</div>
                    <div>{createdAt}</div>
                </div>
                {!isEditing && <div className={style.commentText}>{comment.body}</div>}
                {isEditing && (
                    <CommentForm 
                        submitLabel="Update" 
                        hasCancelButton="true" 
                        initialText={comment.body} 
                        handleSubmit={(text) => editComment(text, comment._id)} 
                        handleCancel={()=>setActiveComment(null)} 
                    />
                )}
                <div className={style.commentActions}>
                    {canReply && <div className={style.commentAction} onClick={() => setActiveComment({ id: comment._id, type: "replying" })}>Reply</div>}
                    {canEdit && <div className={style.commentAction} onClick={() => setActiveComment({ id: comment._id, type: "editing" })}>edit</div>}
                    {canDelete && <div className={style.commentAction} onClick={()=>deleteComment(comment._id)}>delete</div>}
                </div>
                {
                    isReplying && (
                        <CommentForm 
                            submitLabel="Reply" 
                            handleSubmit={(text) => addComment(text, replyId)} 
                        />
                    )
                }
                {
                    replies?.length > 0 && 
                        <div className={style.commentReplies}>
                            {
                                replies?.map(reply => {
                                    return <Comment 
                                                comment={reply} 
                                                key={reply.id} 
                                                replies={[]}
                                                deleteComment={deleteComment}
                                                addComment={addComment}
                                                editComment={editComment}
                                                activeComment={activeComment}
                                                setActiveComment={setActiveComment}
                                                parentId={comment._id}
                                             />
                                })
                            }
                        </div>
                }
            </div>
        </div>
    )
}
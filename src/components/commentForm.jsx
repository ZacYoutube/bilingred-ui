import { useState } from "react"
import style from "../styles/commentForm.module.css";

export default function CommentForm({ 
    handleSubmit,
    submitLabel,
    hasCancelButton = false,
    initialText = "",
    handleCancel 
}){
    const [text, setText] = useState(initialText);
    const isSubmitDisabled = text.length === 0;
    const onSubmit = event => {
        event.preventDefault();
        handleSubmit(text);
        setText("");
    }

    return (
        <div className={style.commentFormContainer}>
           <form onSubmit={onSubmit}>
                <textarea className={style.commentFormTextarea} value={text} onChange={(e)=>setText(e.target.value)} />
                <button disabled={isSubmitDisabled} className={style.commentFormButton}>{submitLabel}</button>
                {hasCancelButton && (
                    <button type="button" onClick={handleCancel}>Cancel</button>
                )}
           </form>
        </div>
    )
}
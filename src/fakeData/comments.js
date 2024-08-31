export const getComments = async() => {
    return [
        {
            id: "1",
            body: "first comment",
            username: "Jack",
            userId: "1",
            parentId: null,
            createdAt: "2021-08-16T23:00:33.010+02:00",
            postId: ""
        },
        {
            id: "2",
            body: "sec comment",
            username: "John",
            userId: "2",
            parentId: null,
            createdAt: "2021-08-17T23:00:33.010+02:00",
            postId: ""
        },
        {
            id: "3",
            body: "third comment",
            username: "Zac",
            userId: "3",
            parentId: "1",
            createdAt: "2021-08-18T23:00:33.010+02:00",
            postId: ""
        },
    ]
}

export const createComment = async (text, parentId = null, userId, username) => {
    return {
        id: Math.random().toString(36).substring(2, 9),
        body: text,
        parentId,
        userId,
        username,
        createdAt: new Date().toISOString()
    }
}


export const deleteComment = async (id) => {
    console.log(`deleting comment with id: ${id}`);
}
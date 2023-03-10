import connectionDB from "../database/db.js";

const PostsRepository = {
    insertNewPost: async (description, userId, link) => {
        await connectionDB.query(
            `INSERT INTO posts (description, user_id, link)
            VALUES ($1, $2, $3);`,
            [description, userId, link]
        );
    },
    selectPostByDescription: async (description) => {
        const post = await connectionDB.query(
            `SELECT *
            FROM posts
            WHERE description = $1;`,
            [description]
        );
        return post.rows;
    },
    selectPosts: async ({ limit }) => {
        const posts = await connectionDB.query(
            `SELECT *
            FROM posts
            ORDER BY id
            DESC
            LIMIT $1;`,
            [limit]
        );
        return posts.rows;
    },
    selectPostById: async (id) => {
        const post = await connectionDB.query(
            `SELECT *
            FROM posts
            WHERE id = $1;`,
            [id]
        );
        return post.rows[0];
    },
    updatePostDescription: async (id, description) => {
        await connectionDB.query(
            `UPDATE posts
            SET description = $1
            WHERE id = $2;`,
            [description, id]
        );
    },
    deletePostFromDb: async (id) => {
        await connectionDB.query(
            `DELETE FROM posts
            WHERE id = $1;`,
            [id]
        );
    },
    selectPostsByFollowing: async ({ followerId, limit }) => {
        const posts = await connectionDB.query(
            `SELECT *
            FROM posts
            WHERE user_id IN (
                SELECT followed_id
                FROM follows
                WHERE follower_id = $1)
            LIMIT $2;`,
            [followerId, limit]
        );
        return posts.rows;
    },
};

export default PostsRepository;

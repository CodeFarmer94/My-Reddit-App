import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'

export default function Post({selectedSub}) {


    // declare local State
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState(null)
    const [avatars, setAvatars] = useState({})

    // retreive id from url bar
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const id = parts[2];

    function isImageUrl(url) {
        return /\.(jpeg|jpg|gif|png)$/i.test(url);
      }



      
    useEffect(() => {
        async function getPostData () {
            const response = await fetch(`https://www.reddit.com/r/${selectedSub}/comments/${id}.json`)
            const data = await response.json()
            setPost(data[0].data.children[0].data)
            setComments(data[1].data.children)
        }
        getPostData()
    }, [id,selectedSub])


    useEffect(() => {

        async function getUserAvatar(user) {
            const response = await fetch(`https://www.reddit.com/user/${user}/about.json`)
            const data = await response.json()
            const avatarUrl = data.data.snoovatar_img;
            setAvatars(avatars => ({
                ...avatars,
                [user]: avatarUrl
            }))
        }

        if (comments) {
            comments.forEach(comment => {
                const user = comment.data.author
                if (!avatars[user]) {
                    getUserAvatar(user)
                }
            })
        }
    }, [avatars,comments])
    
    return (
        <div>
            {post && (
                <div>
                    <h2>{post.title}</h2>
                    {post.url_overridden_by_dest && (
  isImageUrl(post.url_overridden_by_dest) ? (
    <img src={post.url_overridden_by_dest} alt={post.title} />
  ) : (
    <a href={post.url_overridden_by_dest} target="_blank" rel="noopener noreferrer">{post.title}</a>
  )
)}
                    <p><ReactMarkdown>{post.selftext}</ReactMarkdown></p>
                    <p>Upvotes: {post.ups}</p>
                    <p>Subreddit: {post.subreddit}</p>
                    <hr />
                </div>
            )}
            {comments && (
                <div>
                    <h3>Comments:</h3>
                    {comments.map(function(comment){

                        const user = comment.data.author
                        const avatarUrl = avatars[user]
                       


                        console.log(typeof comment.data.body)
                        return (
                            <div key={comment.data.id}>
                                
                                <ReactMarkdown>{comment.data.body}</ReactMarkdown>
                                <p>Upvotes: {comment.data.ups}</p>
                                {avatarUrl && (
                                <img src={avatarUrl} alt={user} width="50px" style={{float:"left"}} />
                                )}
                                <p>Author: {user}</p>
                                <hr />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

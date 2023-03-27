import { ReactMarkdown } from "react-markdown/lib/react-markdown"


export default function SearchResults({postSearchResults,searchTerm}) {


return (

 
        <div>
          <h2>Results for "{searchTerm}"</h2>
          <ul>
            {postSearchResults.map((post) => (
              <li key={post.id}>
                 <ReactMarkdown>{post.title}</ReactMarkdown> 
                by {post.author}
                <br />
                <strong>Score:</strong> {post.score} |{" "}
                <strong>Upvotes:</strong> {post.ups} |{" "}
                <strong>Downvotes:</strong> {post.downs} |{" "}
                <strong>Comments:</strong> {post.num_comments}
                <br />
                <strong>Subreddit:</strong> {post.subreddit} |{" "}
                <strong>Posted:</strong>{" "}
                {new Date(post.created_utc * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
    
)

}
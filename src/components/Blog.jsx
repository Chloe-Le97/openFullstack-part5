import { useState } from "react"

const Blog = ({ blog, handleLikeBlog, deleteBlog, currentUsername }) => {
	const [hide, setHide] = useState(true)

	const hideBlogDetails = { display: hide ? 'none' : '' }
	const showBlogDetails = {display: hide ? '' : 'none'}

	const toggleVisibility = () => {
		setHide(!hide)
	  }

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	return(
	<div style={blogStyle}>
		<div> 
			{blog.title}
			<button onClick={toggleVisibility} style={hideBlogDetails}>Hide</button>
			<button onClick={toggleVisibility} style={showBlogDetails}>View</button>
		</div>
		<div style={hideBlogDetails}>
			<div>Url : {blog.url}</div>
			<div>
				Likes: {blog.likes}
				<button onClick={() => handleLikeBlog(blog)}>like</button>
			</div>
			<div>Author : {blog.author}</div>
			<div>Added by {blog.user?.username}</div>
			{blog.user?.username === currentUsername ? (<button onClick={() => deleteBlog(blog)}>remove</button>):(<div></div>) }
		</div>
	</div>  
	)
}
export default Blog
import { useState } from 'react'

const CreateBlogForm = ({createBlog}) =>{
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const addBlog = (event) =>{
		event.preventDefault()
		createBlog({
			title: title,
			author: author,
			url: url,
			likes: 0
		})
		
		setTitle('')
		setAuthor('')
		setUrl('')
	}

	return (
		<form onSubmit={addBlog}>
			<h2>Create new</h2>
			<div>
			title:
				<input
				type="text"
				value={title}
				name="title"
				onChange={({ target }) => setTitle(target.value)}
			/>
			</div>
			<div>
			author:
				<input
				type="text"
				value={author}
				name="author"
				onChange={({ target }) => setAuthor(target.value)}
			/>
			</div>
			<div>
			url:
				<input
				type="text"
				value={url}
				name="url"
				onChange={({ target }) => setUrl(target.value)}
			/>
			</div>
			<button type="submit">Create</button>
		</form>
	)
}

export default CreateBlogForm
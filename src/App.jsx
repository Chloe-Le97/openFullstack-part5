import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
 
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')


  useEffect(()=>{

	const fetchBlogs = async () => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
	
		if(loggedUserJSON){
		  const user = JSON.parse(loggedUserJSON)
		  setUser(user)
		  blogService.setToken(user.token)
		  
		  const blogsList = await blogService.getAll();
	
		  setBlogs(blogsList)
		}
	  }
	
	  fetchBlogs();
	
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()

	try{
		const user = await loginService.login({
			username,password
		})
		console.log(user)
		window.localStorage.setItem(
			'loggedBlogappUser', JSON.stringify(user)
		) 
		
		setUser(user)
		setUsername('')
		setPassword('')
		blogService.setToken(user.token)

		const blogsList = await blogService.getAll();
		setBlogs(blogsList)

		setMessage('Welcome')
		setTimeout(()=>{
			setMessage(null)
		},5000)
	} catch(exception){
		console.error(exception) // log the error
		setMessage('Wrong credentials')
		setTimeout(()=>{
			setMessage(null)
		},5000)
	}
  }

  const createBlog = async(blogObject) =>{
	console.log(blogObject)
	try{
		const newBlog = await blogService.create(blogObject)
		setBlogs(blogs.concat(newBlog))
		blogFormRef.current.toggleVisibility()
		setBlogAuthor('')
		setBlogTitle('')
		setBlogUrl('')
		setMessage(`A new blog '${newBlog.title}' by ${newBlog.author} is added`)
		setTimeout(()=>{
			setMessage(null)
		},5000)
	}catch(exception){
		console.error(exception) // log the error
		setMessage("There's error in creating new blog")
		setTimeout(()=>{
			setMessage(null)
		},5000)
	}
  }
  
  const deleteBlog = async(blog) =>{
	const blogId = blog.id;
	const blogName = blog.title;
	const blogAuthor = blog.author;
	if(window.confirm(`Remove blog '${blogName}' by ${blogAuthor} ?`)){
		try{
			await blogService.remove(blogId)
			setMessage(`Blog '${blogName}' is deleted`)

			const newBlogList = blogs.filter(item => item.id !== blog.id )
			setBlogs(newBlogList)

			setTimeout(()=>{
				setMessage(null)
			},5000)
			
		}catch(exception){
			console.error(exception)
			setMessage("You do not have permission to delete this blog")
			setTimeout(()=>{
				setMessage(null)
			},5000)
		}
	}
	
  }

  const handleLogout = () =>{
	window.localStorage.removeItem('loggedBlogappUser')
	setUser(null)
	setBlogs([])
  }

  const handleLike = async (blog) =>{
	try{

	const updatedBlog = await blogService.update(blog.id,{
		...blog,likes: blog.likes + 1 
	})

	const newBloglist = blogs.map(item => item.id !== blog.id ? item : updatedBlog )

	setBlogs(newBloglist)

	}catch(exception){
		console.error(exception)
		setMessage("There's error in creating new blog")
		setTimeout(()=>{
			setMessage(null)
		},5000)
	}

  }

  const loginForm = () =>(
	<form onSubmit={handleLogin}>
		<h2>Log in to application</h2>
		<div>
		username
			<input
			type="text"
			value={username}
			name="Username"
			onChange={({ target }) => setUsername(target.value)}
		/>
		</div>
		<div>
		password
			<input
			type="password"
			value={password}
			name="Password"
			onChange={({ target }) => setPassword(target.value)}
		/>
		</div>
		<button type="submit">login</button>
	</form>
	)

	const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

	const blogFormRef = useRef()

	const blogsList = () =>(
		<div>
			<h2>blogs</h2>
			<h3>{user.name} logged in <button onClick={handleLogout}>logout</button></h3>
			<Togglable buttonLabel="new note" ref={blogFormRef}>
				<CreateBlogForm createBlog={createBlog}/>
			</Togglable>
			{sortedBlogs.map(blog =>
				<Blog key={blog.id} blog={blog} currentUsername={user.username} handleLikeBlog={handleLike} deleteBlog={deleteBlog} />
			)}
		</div>
	)

  return (
    <div>
		<Notification message={message} />
		{user === null ? 
			loginForm():
			blogsList()
		}
    </div>
  )
}

export default App
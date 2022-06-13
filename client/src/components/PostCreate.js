import React, { useState } from 'react'
import axios from 'axios'


const PostCreate = () => {

    const [title, setTitle] = useState('')
    
    const onSubmit = async(e)=>{
        e.preventDefault()

        await axios.post('http://localhost:6002/posts',{
            title
        })
        //remove from input
        setTitle('')
    }




    return (
        <div>
            <form  onSubmit={onSubmit}>

                <div className='from-group' >
                    <label>Title</label>
                    <input value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='form-control' />
                </div>
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    )

}

export default PostCreate

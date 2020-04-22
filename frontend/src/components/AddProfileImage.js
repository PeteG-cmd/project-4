
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'


class ProfileImage extends React.Component {

  constructor() {
    super()

    this.state = {
      image: null
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.put('/api/updateProfile', this.state.image, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.history.push('/')
      })
      .catch(err => console.log(err))
  }



  handleImageChange(image) {
    console.log(image.target.files[0])
    const formData = new FormData()
    formData.append('image', image.target.files[0], image.target.files[0].name)
    this.setState({ image: formData })

  }


  render() {
    return <form

      className="form"
      onSubmit={(event) => this.handleSubmit(event)}
      encType='mutipart/form-data'
    >

      <input type="file"
        id="image"
        name='image'
        accept="image/png, image/jpeg" onChange={(image) => this.handleImageChange(image)} />

      <button className="button is-success">
        Upload Image
      </button>

    </form>
  }
}

export default ProfileImage
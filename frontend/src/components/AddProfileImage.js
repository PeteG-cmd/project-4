
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'


class ProfileImage extends React.Component {

  constructor() {
    super()

    this.state = {
      image: null,
      imagePreview: null
    }
  }

  

  handleSubmit(event) {
    event.preventDefault()
    axios.put('/api/updateProfile/', this.state.image, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.history.push('/')
      })
      .catch(err => console.log(err))
  }



  handleImageChange(image) {

    console.log(this.compress(image))
    const formData = new FormData()
    formData.append('image', image.target.files[0], image.target.files[0].name)

    this.setState({
      image: formData, imagePreview: URL.createObjectURL(event.target.files[0])
    })


  }

  compress(e) {
    const width = 500
    const height = 300
    const fileName = e.target.files[0].name
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = event => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const elem = document.createElement('canvas')
        elem.width = width
        elem.height = height
        const ctx = elem.getContext('2d')
        // img.width and img.height will contain the original dimensions
        ctx.drawImage(img, 0, 0, width, height)
        ctx.canvas.toBlob((blob) => {
          const image = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now()
            
          })
          console.log(image)
            console.log(image.target.files[0])
          
        }, 'image/jpeg', 1)
        console.log(img)
      },
      reader.onerror = error => console.log(error)
    }

  }


  render() {
    return <div className="columns">
      <div className="column is-one-quarter is-offset-one-third">
        <div className="box has-text-centered topBorder">

          <div className='circleBox'>
            {!this.state.imagePreview && <p className="image is-100x100">
              <img className='is-rounded' src={'media/assets/user-placeholder.jpg'}></img>
            </p>}
            {this.state.imagePreview && <p className="image is-100x100">
              <img className='is-rounded' src={this.state.imagePreview}></img>
            </p>}
          </div>

          <form

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

        </div>
      </div>
    </div>

  }
}

export default ProfileImage
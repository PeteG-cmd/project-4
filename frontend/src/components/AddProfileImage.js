
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

class ProfileImage extends React.Component {

  constructor() {
    super()

    this.state = {
      image: null,
      imagePreview: null,
      cropImagePreview: null,
      imageloaded: null,
      crop: {
        aspect: 1 / 1
      }
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

    console.log(image)

    const formData = new FormData()
    formData.append('image', image.target.files[0], image.target.files[0].name)

    this.setState({
      image: formData, imagePreview: URL.createObjectURL(event.target.files[0])
    })

    this.setState({ imageFile: image.target.files[0] })
  }

  handleImageLoaded(image) {
    console.log(image)
    this.setState({ imageloaded: image })

  }

  handleOnCropChange(crop) {
    console.log(crop)
    this.setState({ crop })
    // console.log(this.getCroppedImg(image, crop, 'hello'))
  }

  handleOnCropComplete(crop, pixelCrop) {
    console.log(crop)
    console.log(pixelCrop)

    this.getCroppedImg(this.state.imageloaded, crop, this.state.imageFile.name)
      .then(result => {
        console.log(result)
        this.setState({ cropImagePreview: URL.createObjectURL(result) })
        const formData = new FormData()
        formData.append('image', result, this.state.imageFile.name)
        return formData
      })
      .then(file => {
        this.setState({ image: file })
        return
      })
      .then(res => {
        console.log(this.state)
      })
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')
    console.log(image)

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = fileName
        resolve(blob)
      }, 'image/jpeg', 1)
    })
  }


  render() {
    return <div className="columns">
      <div className="column is-half">
        <div className="box has-text-centered growHeight">

          <ReactCrop src={this.state.imagePreview}
            crop={this.state.crop}
            onChange={(crop) => this.handleOnCropChange(crop)}
            onImageLoaded={(image) => this.handleImageLoaded(image)}
            onComplete={(crop) => this.handleOnCropComplete(crop)}
          />

          <form
            className="form"
            onSubmit={(event) => this.handleSubmit(event)}
            encType='mutipart/form-data'
          >
            <input type="file"
              id="image"
              name='image'
              accept="image/png, image/jpeg" onChange={(image) => this.handleImageChange(image)} />
          </form>

        </div>
      </div>
      <div className="column is-half">
        <div className="box has-test-centered growHeight">
          <div className='circleBox'>

            {this.state.cropImagePreview && <p className="image is-100x100">
              <img className='is-rounded' src={this.state.cropImagePreview}></img>
            </p>}
          </div>
          <div>
            <button className="button is-success is-fullwidth" onClick={(event) => this.handleSubmit(event)} >

              Upload Image
          </button>
          </div>
        </div>
      </div>
    </div>

  }
}

export default ProfileImage
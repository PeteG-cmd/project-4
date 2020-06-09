import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'
import { Link } from 'react-router-dom'


class BillImage extends React.Component {

  constructor() {
    super()

    this.state = {
      image: null,
      imagePreview: null
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    const expenseId = this.props.match.params.expense_id
    axios.put(`/api/expense/${expenseId}/`, this.state.image, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.history.push(`/viewexpense/${this.props.match.params.expense_id}`)
      })
      .catch(err => console.log(err))
  }



  handleImageChange(image) {
    console.log(image.target.files[0])
    const formData = new FormData()
    formData.append('image', image.target.files[0], image.target.files[0].name)
    this.setState({
      image: formData, imagePreview: URL.createObjectURL(event.target.files[0])
    })

  }


  render() {
    return <div className="columns">
      <div className="column is-one-quarter is-offset-one-third">
        <div className="box has-text-centered topBorder">

          <div >
            {!this.state.imagePreview && <p className="image is-100x100">
              <img src={'/media/assets/expense-placeholder.jpg'}></img>
            </p>}
            {this.state.imagePreview && <p className="image is-100x100">
              <img src={this.state.imagePreview}></img>
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
          <Link to={`/viewexpense/${this.props.match.params.expense_id}`}><button className='button is-warning'>I will do this later</button></Link>

        </div>
      </div>
    </div>

  }
}

export default BillImage
import React from 'react'

const RegistrationForm = ({ handleSubmit, handleChange, handleImageChange, errors, data }) => {
  const { email, first_name, second_name, password, password_confirmation, username } = data
  return <form
    className="form"
    onSubmit={(event) => handleSubmit(event)}
  >

    <div className="field">
      <label className="label">
        First Name:
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="text"
          name="first_name"
          className="input"
          value={first_name}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-user"></i>
        </span>
      </div>
      {errors.first_name && <small className="help is-danger">
        {errors.first_name[0]}
      </small>}
    </div>

    <div className="field">
      <label className="label">
        Second name:
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="text"
          name="second_name"
          className="input"
          value={second_name}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-user"></i>
        </span>
      </div>
      {errors.second_name && <small className="help is-danger">
        {errors.second_name[0]}
      </small>}
    </div>

    <div className="field">
      <label className="label">
        User Name:
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="text"
          name="username"
          className="input"
          value={username}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-user"></i>
        </span>
      </div>
      {errors.username && <small className="help is-danger">
        {errors.username[0]}
      </small>}
    </div>

    <div className="field">
      <label className="label">
        Email:
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="text"
          name="email"
          className="input"
          value={email}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-envelope"></i>
        </span>
      </div>
      {errors.email && <small className="help is-danger">
        {errors.email[0]}
      </small>}
    </div>

    <div className="field">
      <label className="label">
        Password:
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="password"
          name="password"
          className="input"
          value={password}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-lock"></i>
        </span>
      </div>
      {errors.password && <small className="help is-danger">
        {errors.password[0]}
      </small>}
    </div>

    <div className="field">
      <label className="label">
        Confirm Password:
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="password"
          name="password_confirmation"
          className="input"
          value={password_confirmation}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-lock"></i>
        </span>
      </div>
      {errors.passwordConfirmation && <small className="help is-danger">
        {errors.passwordConfirmation[0]}
      </small>}
    </div>

    {/* <input type="file"
      id="image"
      accept="image/png, image/jpeg" onChange={(image) => handleImageChange(image)} /> */}

    <button
      className="button is-success"
      formEncType='multipart/form-data'
    >
      Register
    </button>
  </form>
}

export default RegistrationForm
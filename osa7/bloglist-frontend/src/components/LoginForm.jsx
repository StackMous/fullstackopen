import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange }) => {
  return (
    <div>
      <h2>log in to application</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            data-testid='username'
            type='text'
            name='username'
            onChange={handleUsernameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control data-testid='password' type='password' onChange={handlePasswordChange} />
        </Form.Group>
        <Button variant='primary' type='submit'>
          login
        </Button>{' '}
        <Button variant='primary' type='reset'>
          cancel
        </Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
}

export default LoginForm

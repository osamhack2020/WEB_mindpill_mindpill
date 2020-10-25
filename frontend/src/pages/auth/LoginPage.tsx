import React, {
  ChangeEvent,
  FormEvent,
  Dispatch,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useTracked } from '../../state'
import { AsyncReducer, AsyncAction, useAsyncReducer } from '../../hooks/async'
import Axios from 'axios'
import { CreateTokenResponse } from '../../types/api/create_token'
import Token from '../../types/token'

async function createToken(
  email: string,
  password: string,
  dispatch: Dispatch<AsyncAction<Token>>
) {
  dispatch({ type: 'LOADING' })

  const response = await Axios.post<CreateTokenResponse>('/api/create_token', {
    email,
    password
  })
  if (response.status !== 200) {
    dispatch({ type: 'ERROR', error: response.data })
  }

  const { data } = response
  const token: Token = {
    access: data.access_token,
    refresh: data.refresh_token
  }

  dispatch({ type: 'SUCCESS', data: token })
}

// TODO: Get user profile and describe token

export default function LoginPage() {
  const [state, dispatch] = useTracked()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const credRef = useRef({ email: '', password: '' })

  const [tokenState, tokenDispatch] = useAsyncReducer<Token>()

  useEffect(() => {
    credRef.current = { email, password }
  }, [email, password])

  useEffect(() => {
    if (tokenState.executed && !tokenState.loading && tokenState.data != null) {
      dispatch({
        type: 'SET_TOKEN',
        token: tokenState.data
      })
    }
  }, [tokenState])

  // Check login state
  if (state.token != null) {
    return <Redirect to="/" />
  }

  const emailHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }, [])

  const passwordHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }, [])

  const formHandler = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { email, password } = credRef.current
    createToken(email, password, tokenDispatch)
  }, [])

  return (
    <Layout>
      <div className="section login-page">
        <div className="container">
          <form onSubmit={tokenState.loading ? undefined : formHandler}>
            <div className="field">
              <label className="label">이메일</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={emailHandler}
              />
            </div>
            <div className="field">
              <label className="label">비밀번호</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={passwordHandler}
              />
            </div>
            <div className="field">
              <div className="control">
                <input
                  type="submit"
                  className={`button${
                    !tokenState.loading ? ' is-disabled' : ''
                  }`}
                  value="로그인"
                />
              </div>
            </div>
          </form>
          <Link to="/user/register">아직 회원이 아니신가요?</Link>
        </div>
      </div>
    </Layout>
  )
}

import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { Link, useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
import Layout from '../../components/Layout'
import { useTracked } from '../../state'
import { AsyncDispatch, useAsyncReducer } from '../../hooks/async'
import { CreateTokenResponse } from '../../types/api/create_token'
import Token from '../../types/token'
import { post } from '../../utils/http'

async function createToken(
  email: string,
  password: string,
  dispatch: AsyncDispatch<Token>
) {
  dispatch({ type: 'LOADING' })

  const response = await post<CreateTokenResponse>(
    '/api/create_token?request_type=password',
    {
      email,
      password
    }
  )

  if (response.status !== 200) {
    dispatch({ type: 'ERROR', error: response.data })
    return
  }

  const { data } = response
  dispatch({
    type: 'SUCCESS',
    data: {
      access: data.access_token,
      refresh: data.refresh_token
    }
  })
}

export default function LoginPage() {
  const history = useHistory()
  const [state, dispatch] = useTracked()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const credRef = useRef({ email: '', password: '' })

  const [tokenState, tokenDispatch] = useAsyncReducer<Token>()

  useEffect(() => {
    credRef.current = { email, password }
  }, [email, password])

  useEffect(() => {
    if (tokenState.data != null) {
      dispatch({
        type: 'SET_TOKEN',
        token: tokenState.data
      })
      Cookies.set('MINDPILL_TOKEN', tokenState.data.access)
      Cookies.set('MINDPILL_REFRESH_TOKEN', tokenState.data.refresh)
      history.push('/')
    }
  }, [tokenState])

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
      <div className="section is-loginpage">
        <div className="container">
          <div>
            <p>
              {tokenState.error != null ? JSON.stringify(tokenState.error) : ''}
            </p>
          </div>
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
          <p>
            <Link to="/user/register">아직 회원이 아니신가요?</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

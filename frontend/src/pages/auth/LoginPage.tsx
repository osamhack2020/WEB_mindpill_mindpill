import React, {
  ChangeEvent,
  FormEvent,
  Dispatch,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { Link, useHistory } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useTracked } from '../../state'
import { AsyncAction, useAsyncReducer } from '../../hooks/async'
import { CreateTokenResponse } from '../../types/api/create_token'
import { DescribeTokenResponse } from '../../types/api/describe_token'
import Token from '../../types/token'
import User from '../../types/user'
import TokenGroup from '../../types/group'
import { get, post } from '../../utils/http'

async function createToken(
  email: string,
  password: string,
  dispatch: Dispatch<AsyncAction<Token>>
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

async function describeToken(
  token: string,
  dispatch: Dispatch<AsyncAction<User>>
) {
  const response = await get<DescribeTokenResponse>('/api/describe_token', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status !== 200) {
    dispatch({ type: 'ERROR', error: response.data })
    return
  }

  const { data } = response
  const groups = data.groups.map<TokenGroup>(group => ({
    id: group.id,
    isManager: group.manager,
    isCounselor: group.counselor
  }))
  const user: User = {
    id: data.uid,
    isAdmin: data.admin,
    groups: groups,
    email: data.email,
    name: data.name
  }

  dispatch({ type: 'SUCCESS', data: user })
}

// TODO: Get user profile and describe token

export default function LoginPage() {
  const history = useHistory()
  const [state, dispatch] = useTracked()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const credRef = useRef({ email: '', password: '' })

  const [tokenState, tokenDispatch] = useAsyncReducer<Token>()
  const [userState, userDispatch] = useAsyncReducer<User>()

  useEffect(() => {
    credRef.current = { email, password }
  }, [email, password])

  useEffect(() => {
    if (tokenState.data != null) {
      dispatch({
        type: 'SET_TOKEN',
        token: tokenState.data
      })
      describeToken(tokenState.data.access, userDispatch)
    }
  }, [tokenState])

  useEffect(() => {
    if (userState.data != null) {
      alert(JSON.stringify(userState.data))
      dispatch({
        type: 'SET_USER',
        user: userState.data
      })
      history.push('/')
    }
  }, [userState])

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
          <div>
            <p>
              {tokenState.error != null ? JSON.stringify(tokenState.error) : ''}
            </p>
            <p>
              {userState.error != null ? JSON.stringify(userState.error) : ''}
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

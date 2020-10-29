import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { useHistory } from 'react-router-dom'
import {
  searchGroup,
  SearchGroupResponse
} from '../../api/search_group'
import {
  listRank,
  ListRankResponse
} from '../../api/list_rank'
import {
  CreateUserRequest,
  CreateUserResponse,
  createUser
} from '../../api/create_user'
import Layout from '../../components/Layout'
import {
  SearchResult,
  SearchSelect
} from '../../components/SearchSelect'
import { useAPI } from '../../hooks/api'
import { useInput } from '../../hooks/input'

export default function RegisterPage() {
  const history = useHistory()
  const [email, emailHandler] = useInput('')
  const [password, passwordHandler] = useInput('')
  const [pwRepeat, pwRepeatHandler] = useInput('')
  const [name, nameHandler] = useInput('')
  const [svNumber, svNumberHandler] = useInput('')
  const [phone, phoneHandler] = useInput('')
  const [gender, setGender] = useState<'m' | 'f'>('m')

  const maleHandler = useCallback(() => {
    setGender('m')
  }, [])

  const femaleHandler = useCallback(() => {
    setGender('f')
  }, [])

  // Group
  const [groupID, setGroupID] = useState<number | null>(
    null
  )
  const [
    groupSearchResults,
    setGroupSearchResults
  ] = useState<SearchResult[]>([])
  const [groupSearchResponse, groupSearchDispatch] = useAPI<
    SearchGroupResponse
  >()
  const groupSearchTimer = useRef<any>(null)
  const groupSearchHandler = useCallback(
    (keyword: string) => {
      clearTimeout(groupSearchTimer.current)
      groupSearchTimer.current = setTimeout(function () {
        searchGroup({ keyword }, groupSearchDispatch)
      }, 100)
    },
    []
  )
  const groupSelectHandler = useCallback(
    (id: number | null) => {
      setGroupID(id)
    },
    []
  )

  useEffect(() => {
    if (groupSearchResponse != null) {
      setGroupSearchResults(groupSearchResponse.groups)
    }
  }, [groupSearchResponse])

  // Rank
  const [rankID, setRankID] = useState<number | null>(null)
  const [ranksResponse, ranksDispatch] = useAPI<
    ListRankResponse
  >()
  const [
    rankSearchResults,
    setRankSearchResults
  ] = useState<ListRankResponse['ranks']>([])

  const rankSearchHandler = useCallback(
    (keyword: string) => {
      const result =
        ranksResponse == null
          ? []
          : ranksResponse.ranks.filter(rank =>
              rank.name.includes(keyword)
            )
      setRankSearchResults(result)
    },
    [ranksResponse]
  )

  const rankSelectHandler = useCallback(
    (id: number | null) => {
      setRankID(id)
    },
    []
  )

  useEffect(() => {
    listRank(ranksDispatch)
  }, [])

  // Form
  const [formError, setFormError] = useState<string | null>(
    null
  )
  const [createUserResponse, createUserDispatch] = useAPI<
    CreateUserResponse
  >()
  const submitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (password.length < 9) {
        setFormError('비밀번호가 너무 짧습니다.')
        return
      }

      if (password !== pwRepeat) {
        setFormError('비밀번호가 일치하지 않습니다.')
        return
      }

      if (rankID == null) {
        setFormError('계급은 반드시 설정되어야 합니다.')
        return
      }

      if (groupID == null) {
        setFormError('부대는 반드시 설정되어야 합니다.')
        return
      }

      createUser(
        {
          email,
          password,
          name,
          sv_number: svNumber,
          gender,
          phone_number: phone,
          group_id: groupID,
          rank_id: rankID
        },
        createUserDispatch
      )
    },
    [
      email,
      password,
      pwRepeat,
      name,
      svNumber,
      gender,
      phone,
      groupID,
      rankID
    ]
  )
  useEffect(() => {
    if (createUserResponse != null) {
      history.push('/user/login')
    }
  }, [createUserResponse])

  return (
    <Layout>
      <div className="section">
        <div className="container">
          <h1 className="title">회원가입</h1>
          <form onSubmit={submitHandler}>
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
              <label className="label">비밀번호 확인</label>
              <input
                className="input"
                type="password"
                value={pwRepeat}
                onChange={pwRepeatHandler}
              />
            </div>
            <div className="field">
              <label className="label">이름</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={nameHandler}
              />
            </div>
            <div className="field">
              <label className="label">군번</label>
              <input
                className="input"
                type="text"
                value={svNumber}
                onChange={svNumberHandler}
              />
            </div>
            <div className="field">
              <label className="label">계급</label>
              <SearchSelect
                search={rankSearchHandler}
                searchResults={rankSearchResults}
                onSelect={rankSelectHandler}
              />
            </div>
            <div className="field">
              <label className="label">성별</label>
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="gender"
                    onChange={maleHandler}
                    checked={gender === 'm'}
                  />
                  남성
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="gender"
                    onChange={femaleHandler}
                    checked={gender === 'f'}
                  />
                  여성
                </label>
              </div>
            </div>
            <div className="field">
              <label className="label">전화번호</label>
              <input
                className="input"
                type="text"
                value={phone}
                onChange={phoneHandler}
              />
            </div>
            <div className="field">
              <label className="label">부대</label>
              <SearchSelect
                search={groupSearchHandler}
                searchResults={groupSearchResults}
                onSelect={groupSelectHandler}
              />
            </div>
            <div className="field">
              <div className="control">
                <input
                  type="submit"
                  className="button is-link"
                  value="가입하기"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

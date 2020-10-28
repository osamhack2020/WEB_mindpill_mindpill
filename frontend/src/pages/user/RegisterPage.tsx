import React, { useCallback, useEffect, useRef, useState } from 'react'
import { searchGroup, SearchGroupResponse } from '../../api/search_group'
import Layout from '../../components/Layout'
import { SearchResult, SearchSelect } from '../../components/SearchSelect'
import { useAPI } from '../../hooks/api'

export default function RegisterPage() {
  const groupSearchTimer = useRef<any>(null)
  const [groupSearchResponse, groupSearchDispatch] = useAPI<
    SearchGroupResponse
  >()
  const [groupSearchResults, setGroupSearchResults] = useState<SearchResult[]>(
    []
  )
  useEffect(() => {
    if (groupSearchResponse != null) {
      setGroupSearchResults(groupSearchResponse.groups)
    }
  }, [groupSearchResponse])

  const groupSearchHandler = useCallback((keyword: string) => {
    clearTimeout(groupSearchTimer.current)
    groupSearchTimer.current = setTimeout(function () {
      searchGroup({ keyword }, groupSearchDispatch)
    }, 100)
  }, [])

  const groupSelectHandler = useCallback((id: number) => {
    alert(id)
  }, [])

  return (
    <Layout>
      <SearchSelect
        search={groupSearchHandler}
        searchResults={groupSearchResults}
        onSelect={groupSelectHandler}
      />
    </Layout>
  )
}

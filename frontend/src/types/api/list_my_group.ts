export interface ListMyGroupResponseGroup {
  id: number
  name: string
}

export interface ListMyGroupResponse {
  groups: ListMyGroupResponseGroup[]
  counselor_groups: ListMyGroupResponseGroup[]
  manager_groups: ListMyGroupResponseGroup[]
}

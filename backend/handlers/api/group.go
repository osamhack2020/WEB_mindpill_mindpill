package api

import (
	"mindpill/backend/internal/database"
	"mindpill/ent"
	"mindpill/ent/counselor"
	"mindpill/ent/group"
	"mindpill/ent/manager"
	"mindpill/ent/user"
	"strconv"
	"time"

	"github.com/valyala/fasthttp"
)

type CreateGroupRequest struct {
	Name string `json:"name"`
}

type CreateGroupResponse struct {
	GroupID int `json:"group_id"`
}

func CreateGroup(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	if !token.IsAdmin {
		Unauthorized(ctx, err, "admin permission is required")
		return
	}

	var req CreateGroupRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	group, err := database.Ent().
		Group.Create().
		SetName(req.Name).
		Save(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to write record on database")
	}

	SendResponse(ctx, &CreateGroupResponse{
		GroupID: group.ID,
	})
}

type ListMyGroupResponseGroup struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func listMyGroupResponseGroupsFromRecords(records []*ent.Group) []ListMyGroupResponseGroup {
	groups := make([]ListMyGroupResponseGroup, len(records))
	for i, record := range records {
		groups[i] = ListMyGroupResponseGroup{
			ID:   record.ID,
			Name: record.Name,
		}
	}
	return groups
}

type ListMyGroupResponse struct {
	Groups          []ListMyGroupResponseGroup `json:"groups"`
	CounselorGroups []ListMyGroupResponseGroup `json:"counselor_groups"`
	ManagerGroups   []ListMyGroupResponseGroup `json:"manager_groups"`
}

func ListMyGroup(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	userGroupRecords, err := database.Ent().
		Group.Query().
		Where(
			group.HasUsersWith(user.IDEQ(token.UserID)),
		).
		All(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
		return
	}
	userGroups := listMyGroupResponseGroupsFromRecords(userGroupRecords)

	counselorGroupRecords, err := database.Ent().
		Group.Query().
		Where(
			group.HasCounselorsWith(
				counselor.HasUserWith(user.IDEQ(token.UserID)),
			),
		).
		All(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
		return
	}
	counselorGroups := listMyGroupResponseGroupsFromRecords(counselorGroupRecords)

	managerGroupRecords, err := database.Ent().
		Group.Query().
		Where(
			group.HasManagersWith(
				manager.HasUserWith(user.IDEQ(token.UserID)),
			),
		).
		All(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
		return
	}
	managerGroups := listMyGroupResponseGroupsFromRecords(managerGroupRecords)

	SendResponse(ctx, &ListMyGroupResponse{
		Groups:          userGroups,
		CounselorGroups: counselorGroups,
		ManagerGroups:   managerGroups,
	})
}

type DescribeGroupResponse struct {
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func DescribeGroup(ctx *fasthttp.RequestCtx) {
	var queries = ctx.QueryArgs()
	groupID, err := strconv.ParseInt(string(queries.Peek("group_id")), 10, 64)
	if err != nil {
		BadRequest(ctx, err, "invalid group id")
		return
	}

	groupRecord, err := database.Ent().
		Group.Query().
		Where(group.IDEQ(int(groupID))).
		Only(ctx)
	if err != nil {
		NotFound(ctx, err, "group not found")
		return
	}

	SendResponse(ctx, &DescribeGroupResponse{
		Name:      groupRecord.Name,
		CreatedAt: groupRecord.CreatedAt,
		UpdatedAt: groupRecord.UpdatedAt,
	})
}

type CreateManagerRequest struct {
	UserID  int `json:"user_id"`
	GroupID int `json:"group_id"`
}

func CreateManager(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	if !token.IsAdmin {
		Forbidden(ctx, nil, "this action requires admin privilege")
		return
	}

	var req CreateManagerRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	_, err = database.Ent().
		Manager.Create().
		SetUserID(req.UserID).
		SetGroupID(req.GroupID).
		Save(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to create manager record")
		return
	}

	SendResponse(ctx, respOK)
}

type DeleteManagerRequest struct {
	UserID  int `json:"user_id"`
	GroupID int `json:"group_id"`
}

func DeleteManager(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	if !token.IsAdmin {
		Forbidden(ctx, nil, "this action requires admin privilege")
		return
	}

	var req DeleteManagerRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	n, err := database.Ent().
		Manager.Delete().
		Where(manager.And(
			manager.HasGroupWith(group.IDEQ(req.GroupID)),
			manager.HasUserWith(user.IDEQ(req.UserID)),
		)).
		Exec(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to create manager record")
		return
	}
	if n == 0 {
		BadRequest(ctx, nil, "User does not exist or not the manager of the group")
		return
	}

	SendResponse(ctx, respOK)
}

type CreateCounselorRequest struct {
	UserID  int `json:"user_id"`
	GroupID int `json:"group_id"`
}

func CreateCounselor(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	if !token.IsAdmin {
		Forbidden(ctx, nil, "this action requires admin privilege")
		return
	}

	var req CreateCounselorRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	_, err = database.Ent().
		Counselor.Create().
		SetUserID(req.UserID).
		SetGroupID(req.GroupID).
		Save(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to create counselor record")
		return
	}

	SendResponse(ctx, respOK)
}

type DeleteCounselorRequest struct {
	UserID  int `json:"user_id"`
	GroupID int `json:"group_id"`
}

func DeleteCounselor(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	if !token.IsAdmin {
		Forbidden(ctx, nil, "this action requires admin privilege")
		return
	}

	var req DeleteCounselorRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	n, err := database.Ent().
		Counselor.Delete().
		Where(counselor.And(
			counselor.HasGroupWith(group.IDEQ(req.GroupID)),
			counselor.HasUserWith(user.IDEQ(req.UserID)),
		)).
		Exec(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to create counselor record")
		return
	}
	if n == 0 {
		BadRequest(ctx, nil, "User does not exist or not the counselor of the group")
		return
	}

	SendResponse(ctx, respOK)
}

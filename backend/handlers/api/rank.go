package api

import (
	"mindpill/backend/internal/database"

	"github.com/valyala/fasthttp"
)

type ListRankResponseRank struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type ListRankResponse struct {
	Ranks []ListRankResponseRank `json:"ranks"`
}

func ListRank(ctx *fasthttp.RequestCtx) {
	rankRecords, err := database.Ent().
		Rank.Query().
		All(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
	}

	ranks := make([]ListRankResponseRank, len(rankRecords))
	for i, record := range rankRecords {
		ranks[i] = ListRankResponseRank{
			ID:   record.ID,
			Name: record.Name,
		}
	}

	SendResponse(ctx, &ListRankResponse{
		Ranks: ranks,
	})
}

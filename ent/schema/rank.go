package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
)

// Rank holds the schema definition for the Rank entity.
type Rank struct {
	ent.Schema
}

// Fields of the Rank.
func (Rank) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Unique(),
	}
}

// Edges of the Rank.
func (Rank) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("users", User.Type).
			Ref("rank"),
	}
}

package schema

import (
	"time"

	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebook/ent/schema/index"
)

// Token holds the schema definition for the Token entity.
type Token struct {
	ent.Schema
}

// Fields of the Token.
func (Token) Fields() []ent.Field {
	return []ent.Field{
		field.Uint64("token_id"),
		field.Bool("revoked").
			Default(false),
		field.Time("created_at").
			Immutable().
			Default(time.Now),
	}
}

// Edges of the Token.
func (Token) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("tokens").
			Unique(),
	}
}

// Indexes of the Token.
func (Token) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("revoked"),
		index.Edges("user"),
	}
}

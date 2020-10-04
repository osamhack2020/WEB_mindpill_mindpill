package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
)

// Counselor holds the schema definition for the Counselor entity.
type Counselor struct {
	ent.Schema
}

// Fields of the Counselor.
func (Counselor) Fields() []ent.Field {
	return nil
}

// Edges of the Counselor.
func (Counselor) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).
			Required().
			Unique(),
		edge.To("notes", Note.Type),
		edge.From("group", Group.Type).
			Ref("counselors").
			Unique(),
	}
}

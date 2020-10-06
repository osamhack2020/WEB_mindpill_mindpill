package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
)

// Manager holds the schema definition for the Manager entity.
type Manager struct {
	ent.Schema
}

// Fields of the Manager.
func (Manager) Fields() []ent.Field {
	return nil
}

// Edges of the Manager.
func (Manager) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).
			Required().
			Unique(),
		edge.From("group", Group.Type).
			Ref("managers").
			Unique(),
	}
}

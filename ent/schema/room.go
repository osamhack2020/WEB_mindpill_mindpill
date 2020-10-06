package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
)

// Room holds the schema definition for the Room entity.
type Room struct {
	ent.Schema
}

// Fields of the Room.
func (Room) Fields() []ent.Field {
	return nil
}

// Edges of the Room.
func (Room) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("uploads", File.Type),
		edge.To("users", User.Type),
		edge.To("messages", Message.Type),
		edge.To("notes", Note.Type),
		edge.From("group", Group.Type).
			Ref("rooms").
			Unique().
			Required(),
	}
}

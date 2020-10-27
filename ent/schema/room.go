package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
)

// Room holds the schema definition for the Room entity.
type Room struct {
	ent.Schema
}

// Fields of the Room.
func (Room) Fields() []ent.Field {
	return []ent.Field{
		field.Bool("is_closed").
			Default(false),
	}
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

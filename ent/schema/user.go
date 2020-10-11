package schema

import (
	"time"

	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("sv_number"),
		field.String("email").
			Unique().
			NotEmpty(),
		field.Bytes("password_hash"),
		field.String("name").
			NotEmpty(),
		field.Enum("gender").
			Values("m", "f"),
		field.String("phone_number").
			MinLen(7).
			MaxLen(13).
			Nillable().
			Optional(),
		field.Time("created_at").
			Immutable().
			Default(time.Now),
		field.Time("updated_at").
			Default(time.Now),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("rank", Rank.Type).
			Unique().
			Required(),
		edge.To("tokens", Token.Type),
		edge.To("uploads", File.Type),
		edge.From("admin", Admin.Type).
			Ref("user").
			Unique(),
		edge.From("counselor", Counselor.Type).
			Ref("user").
			Unique(),
		edge.From("manager", Manager.Type).
			Ref("user").
			Unique(),
		edge.From("group", Group.Type).
			Ref("users").
			Unique(),
		edge.From("rooms", Room.Type).
			Ref("users"),
	}
}

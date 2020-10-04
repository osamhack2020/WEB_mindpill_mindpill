package schema

import (
	"time"

	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
)

// File holds the schema definition for the File entity.
type File struct {
	ent.Schema
}

// Fields of the File.
func (File) Fields() []ent.Field {
	return []ent.Field{
		field.Uint64("file_id").
			Unique(),
		field.Time("created_at").
			Immutable().
			Default(time.Now),
	}
}

// Edges of the File.
func (File) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("uploader", User.Type).
			Ref("uploads").
			Required().
			Unique(),
		edge.From("room", Room.Type).
			Ref("uploads").
			Required().
			Unique(),
	}
}

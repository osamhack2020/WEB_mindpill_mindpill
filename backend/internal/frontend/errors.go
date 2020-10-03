package frontend

import "fmt"

type ErrRead struct {
	File  string
	Cause error
}

func (e *ErrRead) Unwrap() error {
	return e.Cause
}

func (e *ErrRead) Error() string {
	return fmt.Sprintf("Failed to read file %s: %s", e.File, e.Cause.Error())
}

package tokens

import (
	"testing"
	"time"
)

func TestParse(t *testing.T) {
	tests := []struct {
		name    string
		src     []byte
		want    *Token
		wantErr bool
	}{
		{
			"name",
			[]byte("eyJ0aWQiOjY3MjAyMDAzMTA4MzAxMzczNDQsInVpZCI6MSwicmVmcmVzaCI6ZmFsc2UsImNhdCI6IjIwMjAtMTAtMDlUMDU6MTY6NDkuMzg2MzgwMDlaIn0.9kUJncuSVQ2lbZ_ZenZY0sgpX9QTOfBU9Q1vgyLZuG0"),
			&Token{
				ID:        6720200310830137344,
				UserID:    1,
				IsRefresh: false,
				CreatedAt: time.Date(2020, 10, 9, 5, 16, 49, 0, time.UTC),
			},
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Parse(tt.src)
			if (err != nil) != tt.wantErr {
				t.Errorf("Parse() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got.ID != tt.want.ID ||
				got.UserID != tt.want.UserID ||
				got.IsRefresh != tt.want.IsRefresh ||
				got.CreatedAt.Sub(tt.want.CreatedAt) > time.Second {
				t.Errorf("Parse() = %v, want %v", got, tt.want)
			}
		})
	}
}

package ids

import (
	"encoding/base64"
	"encoding/binary"
	"sync"
	"time"
)

const (
	timeMask = 0x01FFFFFFFFFF // 41 bits
	seqMask  = 0x0FFF         // 12 bits
	nidMask  = 0x03FF         // 10 bits
)

type Node struct {
	m        sync.Mutex
	nodeID   uint64
	lastTime uint64
	seq      uint64
}

func NewNode(id uint64) *Node {
	return &Node{
		nodeID: id,
	}
}

func (n *Node) Generate() (id uint64) {
	n.m.Lock()
	defer n.m.Unlock()

	t := milli(time.Now())
	if t > n.lastTime {
		n.lastTime = t
		n.seq = 0
	}

	id = (timeMask&n.lastTime)<<22 |
		(seqMask&n.seq)<<10 | (n.nodeID & nidMask)

	n.seq++
	if n.seq&seqMask == 0 {
		n.lastTime++
	}

	return
}

func (n *Node) GenerateBytes() (id []byte) {
	v := n.Generate()
	id = make([]byte, 8)
	binary.BigEndian.PutUint64(id, v)
	return
}

func (n *Node) GenerateString() string {
	return base64.RawURLEncoding.EncodeToString(n.GenerateBytes())
}

func milli(t time.Time) uint64 {
	return uint64(1000*t.Unix() + (t.UnixNano()%1000000000)/1000000)
}

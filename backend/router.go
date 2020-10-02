package mindpill

import (
	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

var r = router.New()

func Handler() fasthttp.RequestHandler {
	return r.Handler
}

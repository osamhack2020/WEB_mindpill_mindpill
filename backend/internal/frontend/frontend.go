package frontend

import (
	"bytes"
	"encoding/json"
	"html/template"
	"io/ioutil"
	"os/exec"

	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

type Frontend struct {
	fs        *fasthttp.FS
	fsHandler fasthttp.RequestHandler
	template  *template.Template
}

func New(root string) (*Frontend, error) {
	layout, err := ioutil.ReadFile("./frontend/index.html")
	if err != nil {
		return nil, err
	}
	tpl, err := template.New("layout").Parse(string(layout))
	if err != nil {
		return nil, err
	}
	f := &Frontend{
		fs: &fasthttp.FS{
			Root:               root,
			GenerateIndexPages: false,
			Compress:           true,
		},
		template: tpl,
	}
	f.fs.PathNotFound = f.renderPage
	f.fsHandler = f.fs.NewRequestHandler()
	return f, nil
}

func (f *Frontend) Handler(ctx *fasthttp.RequestCtx) {
	path := string(ctx.Path())
	switch path {
	case "/", "/index.html":
		f.renderPageWithPath(ctx, path)
	default:
		f.fsHandler(ctx)
	}
}

type logPrinter struct {
	buf *bytes.Buffer
}

type SSRResult struct {
	Status int    `json:"status"`
	Markup string `json:"markup"`
}

func (f *Frontend) renderPageWithPath(ctx *fasthttp.RequestCtx, p string) {
	node := exec.Command("node", "./ssr.js", p)
	stdout, err := node.StdoutPipe()
	if err != nil {
		logger.Error("failed to create stdout pipe", zap.Error(err))
		return
	}
	stderr := bytes.NewBuffer([]byte{})
	node.Stderr = stderr
	if err := node.Start(); err != nil {
		logger.Error(
			"failed to start ssr process",
			zap.Error(err),
			zap.String("message", stderr.String()),
		)
		return
	}
	var result SSRResult
	if err := json.NewDecoder(stdout).Decode(&result); err != nil {
		logger.Error(
			"failed to decode ssr result",
			zap.Error(err),
			zap.String("message", stderr.String()),
		)
		return
	}
	if err := node.Wait(); err != nil {
		logger.Error(
			"ssr process throws an error",
			zap.Error(err),
			zap.String("message", stderr.String()),
		)
		return
	}
	if stderr.Len() > 0 {
		logger.Info("ssr process: ", zap.String("message", stderr.String()))
	}
	ctx.Response.Header.Set("Content-Type", "text/html;charset=utf-8")
	ctx.Response.SetStatusCode(result.Status)
	f.template.Execute(ctx, result)
}

func (f *Frontend) renderPage(ctx *fasthttp.RequestCtx) {
	f.renderPageWithPath(ctx, string(ctx.Path()))
}

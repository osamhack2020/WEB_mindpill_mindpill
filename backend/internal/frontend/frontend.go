package frontend

import (
	"archive/tar"
	"io"
	"io/ioutil"
	"mime"
	"mindpill/dist"
	"path"

	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

type Frontend map[string][]byte

func New() (Frontend, error) {
	m, err := parseFrontendArchive()
	if err != nil {
		return nil, err
	}
	return Frontend(m), nil
}

func (f Frontend) Handler(ctx *fasthttp.RequestCtx) {
	// TODO: Implement SSR!
	key := string(ctx.Path())
	data, ok := f[key]
	if !ok {
		key = "/index.html"
		data = f[key]
	}
	mimeType := mime.TypeByExtension(path.Ext(key))
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.Response.Header.Set("Content-Type", mimeType)
	ctx.Write(data)
}

func parseFrontendArchive() (map[string][]byte, error) {
	fr, err := dist.NewFrontendTarReader()
	if err != nil {
		return nil, err
	}

	fileMap := make(map[string][]byte)

	r := tar.NewReader(fr)
	for {
		header, err := r.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, &ErrRead{File: header.Name, Cause: err}
		}
		if header.Typeflag != tar.TypeReg { // Is Regular File
			continue
		}
		buf, err := ioutil.ReadAll(r)
		if err != nil {
			return nil, &ErrRead{File: header.Name, Cause: err}
		}
		fileName := path.Join("/", header.Name)
		logger.Debug(
			"a frontend asset has been loaded",
			zap.String("name", fileName),
		)
		fileMap[fileName] = buf
	}

	return fileMap, nil
}

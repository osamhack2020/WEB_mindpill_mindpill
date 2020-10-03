package main

import (
	"bytes"
	"compress/gzip"
	"flag"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"
)

type TemplateContext struct {
	PackageName string
	VarName     string
	Content     string
}

const defaultTplSrc = `package {{.PackageName}}

import (
	"strings"
	"io"
)

const {{.VarName}} = {{.Content}}

func New{{.VarName}}Reader() (io.Reader, error) {
	return strings.NewReader({{.VarName}}), nil
}
`

const compressTplSrc = `package {{.PackageName}}

import (
	"bytes"
	"compress/gzip"
	"io"
)

const {{.VarName}} = {{.Content}}

func New{{.VarName}}Reader() (io.Reader, error) {
	return gzip.NewReader(bytes.NewReader([]byte({{.VarName}})))
}
`

var (
	inputFile      = flag.String("input", "", "input file")
	outputFile     = flag.String("output", "", "output file")
	packageName    = flag.String("package", "", "variable name")
	varName        = flag.String("var", "", "variable name")
	shouldCompress = flag.Bool("compress", false, "use gzip compress")
)

func run() error {
	if *packageName == "" || *varName == "" {
		fmt.Println("-package and -var is required")
		fmt.Println("for help message, try file2go -h")
		os.Exit(1)
	}
	var w io.Writer
	if *outputFile == "" {
		w = os.Stdout
	} else {
		f, err := os.Create(*outputFile)
		if err != nil {
			return err
		}
		defer f.Close()
		w = f
	}
	var r io.Reader
	if *inputFile == "" {
		r = os.Stdin
	} else {
		f, err := os.Open(*inputFile)
		if err != nil {
			return err
		}
		defer f.Close()
		r = f
	}
	var (
		tplSrc string
		data   []byte
	)
	if *shouldCompress {
		compressed, err := compressData(r)
		if err != nil {
			return err
		}
		data = compressed
		tplSrc = compressTplSrc
	} else {
		buf, err := ioutil.ReadAll(r)
		if err != nil {
			return err
		}
		data = buf
		tplSrc = defaultTplSrc
	}
	tpl, err := template.New("tpl").Parse(tplSrc)
	if err != nil {
		return err
	}
	ctx := &TemplateContext{
		PackageName: *packageName,
		VarName:     *varName,
		Content:     strconv.Quote(string(data)),
	}
	return tpl.Execute(w, ctx)
}

func compressData(r io.Reader) ([]byte, error) {
	buf := &bytes.Buffer{}
	w, err := gzip.NewWriterLevel(buf, gzip.BestCompression)
	if err != nil {
		return nil, err
	}
	if _, err := io.Copy(w, r); err != nil {
		return nil, err
	}
	w.Close()
	return buf.Bytes(), nil
}

func main() {
	flag.Parse()
	if err := run(); err != nil {
		log.Fatalln(err)
	}
}

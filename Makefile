FRONTEND_SRC := $(shell find ./frontend -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.js')
FRONTEND_OUT := dist/frontend/bundle.js

STYLE_ENTRY := frontend/assets/scss/styles.scss
STYLE_SRC := $(shell find ./frontend -name '*.scss')
STYLE_OUT := dist/frontend/style.css

PUBLIC_SRC := $(wildcard frontend/public/*)
PUBLIC_DIR := frontend/public
PUBLIC_DIST := dist/frontend
PUBLIC_OUT := $(addprefix ${PUBLIC_DIST}/,$(PUBLIC_SRC:${PUBLIC_DIR}/%=%))

BACKEND_SRC := $(shell find ./backend -name '*.go')
BACKEND_PKG := mindpill/backend

run: ${BACKEND_SRC}
	go run ${BACKEND_PKG}/cmd/mindpill

.PHONY := frontend
frontend: ${FRONTEND_OUT}

${FRONTEND_OUT}: ${FRONTEND_SRC}
	npx webpack

.PHONY := style
style: ${STYLE_OUT}

${STYLE_OUT}: ${STYLE_SRC}
	mkdir -p $(dir $@)
	npx node-sass --output-style compressed ${STYLE_ENTRY} > $@

.PHONY := public
public: ${PUBLIC_OUT}

${PUBLIC_DIST}/%: ${PUBLIC_DIR}/%
	mkdir -p ${PUBLIC_DIST}
	cp $< $@

clean:
	rm -rf dist/

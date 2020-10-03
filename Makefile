DIST_DIR := dist

FRONTEND_DIR := ${DIST_DIR}/frontend
FRONTEND_COMMON_SRC := $(shell find ./frontend/src -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.js')

UI_SRC := frontend/browser.tsx ${FRONTEND_COMMON_SRC}
UI_OUT := ${FRONTEND_DIR}/bundle.js

STYLE_ENTRY := frontend/assets/scss/styles.scss
STYLE_SRC := $(shell find ./frontend -name '*.scss')
STYLE_OUT := ${FRONTEND_DIR}/style.css

PUBLIC_SRC := $(wildcard frontend/public/*)
PUBLIC_DIR := frontend/public
PUBLIC_DIST := ${FRONTEND_DIR}
PUBLIC_OUT := $(addprefix ${PUBLIC_DIST}/,$(PUBLIC_SRC:${PUBLIC_DIR}/%=%))

FRONTEND_OUT := ${UI_OUT} ${STYLE_OUT} ${PUBLIC_OUT}

SSR_SRC := frontend/server.tsx ${FRONTEND_COMMON_SRC}
SSR_OUT := ${DIST_DIR}/ssr.js

BACKEND_SRC := $(shell find ./backend -name '*.go')
BACKEND_OUT := ${DIST_DIR}/mindpill
BACKEND_PKG := mindpill/backend

.PHONY := run
run: ${SSR_OUT} ${FRONTEND_OUT} ${BACKEND_SRC}
	cd ${DIST_DIR} && go run ${BACKEND_PKG}/cmd/mindpill

.PHONY := build
build: ${SSR_OUT} ${FRONTEND_OUT} ${BACKEND_OUT}

${BACKEND_OUT}: ${BACKEND_SRC}
	go build -o $@ ${BACKEND_PKG}

.PHONY := frontend
frontend: ${FRONTEND_OUT}

.PHONY := ui
ui: ${UI_OUT}

${UI_OUT}: ${UI_SRC}
	npx webpack --config webpack.client.js

ssr: ${SSR_OUT}

${SSR_OUT}: ${SSR_SRC}
	npx webpack --config webpack.server.js

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

.PHONY := clean
clean:
	rm -rf dist/
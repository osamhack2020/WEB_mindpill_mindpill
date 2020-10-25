DIST_DIR := dist

FRONTEND_DIR := ${DIST_DIR}/frontend
FRONTEND_COMMON_SRC := $(shell find ./frontend/src -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.js')

UI_SRC := frontend/browser.tsx ${FRONTEND_COMMON_SRC}
UI_OUT := ${FRONTEND_DIR}/bundle.js

STYLE_ENTRY := frontend/assets/scss/mobile-styles.scss
STYLE_SRC := $(shell find ./frontend -name '*.scss')
STYLE_OUT := ${FRONTEND_DIR}/style.css

PUBLIC_SRC := $(wildcard frontend/public/*)
PUBLIC_DIR := frontend/public
PUBLIC_DIST := ${FRONTEND_DIR}
PUBLIC_OUT := $(addprefix ${PUBLIC_DIST}/,$(PUBLIC_SRC:${PUBLIC_DIR}/%=%))

FRONTEND_OUT := ${UI_OUT} ${STYLE_OUT} ${PUBLIC_OUT}

SSR_SRC := frontend/server.tsx ${FRONTEND_COMMON_SRC}
SSR_OUT := ${DIST_DIR}/ssr.js

ENT_SRC := $(shell find ./ent/schema -name '*.go')
ENT_OUT := ./ent/ent.go
ENT_PKG := mindpill/ent

BACKEND_SRC := $(shell find ./backend -name '*.go') ${ENT_OUT}
BACKEND_OUT := ${DIST_DIR}/mindpill
BACKEND_PKG := mindpill/backend

.PHONY := run
run: ${SSR_OUT} ${FRONTEND_OUT} ${BACKEND_SRC}
	mkdir -p ${DIST_DIR}
	cd ${DIST_DIR} && NODE_ID=0 go run ${BACKEND_PKG}/cmd/mindpill

.PHONY := setup-database
setup-database: ${SSR_OUT} ${FRONTEND_OUT} ${BACKEND_SRC}
	mkdir -p ${DIST_DIR}
	cd ${DIST_DIR} && go run ${BACKEND_PKG}/cmd/mindpill setup-database

.PHONY := build
build: ${SSR_OUT} ${FRONTEND_OUT} ${BACKEND_OUT}

${BACKEND_OUT}: ${BACKEND_SRC}
	go build -o $@ ${BACKEND_PKG}

.PHONY := frontend
frontend: ${FRONTEND_OUT}

.PHONY := ui
ui: ${UI_OUT}

.PHONY := ssr
ssr: ${SSR_OUT}

${UI_OUT} ${SSR_OUT}: ${UI_SRC} ${SSR_SRC}
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

.PHONY := ent
ent: ${ENT_OUT}

${ENT_OUT}: ${ENT_SRC}
	go generate ${ENT_PKG}

.PHONY := clean
clean:
	rm -rf dist/
	rm -rf $(filter-out ent/schema ent/generate.go,$(wildcard ent/*))

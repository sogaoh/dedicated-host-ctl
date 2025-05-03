# Makefile for build & deploy Lambda with lambroll
.PHONY: build package deploy clean

ROOT_DIR := ..
DIST_DIR := $(ROOT_DIR)/dist
ZIP_FILE := $(ROOT_DIR)/function.zip

build:
	cd $(ROOT_DIR) && bun install
	cd $(ROOT_DIR) && bun run build

package: build
	cd $(DIST_DIR) && bun run package

deploy: package
	cd $(CURDIR) && lambroll deploy --src $(ZIP_FILE)

clean:
	rm -rf $(DIST_DIR)
	rm -f $(ZIP_FILE)
	rm -rf $(ROOT_DIR)/node_modules
	rm -f $(ROOT_DIR)/bun.lock
	rm -f $(ROOT_DIR)/package-lock.json

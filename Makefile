# Traffique: live visitor statistics on App Engine
# Copyright (C) 2011 Jean Joskin <jeanjoskin.com>
#
# Traffique is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Traffique is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Traffique. If not, see <http://www.gnu.org/licenses/>.

all: view css jsdep

###########################################################
## View
###########################################################

VIEW_DIR_SRC = view
VIEW_DIR_DST = src/view
VIEW_SRC_TO_DST = $(addprefix $(VIEW_DIR_DST)/,$(patsubst %.pyhp,%.py, $(notdir $(1))))
VIEW_PYHP = $(wildcard $(VIEW_DIR_SRC)/*.pyhp)
VIEW_PY = $(call VIEW_SRC_TO_DST, $(VIEW_PYHP))

view: $(VIEW_PY)

$(VIEW_DIR_DST)/%.py : $(VIEW_DIR_SRC)/%.pyhp
	python pyhp.py $< > $@

###########################################################
## Css
###########################################################

CSS_DIR = sass
CSS_FILES = $(wildcard $(CSS_DIR)/*.scss)

css: $(CSS_FILES)
	compass compile --output-style compressed
	
###########################################################
## Javascript
###########################################################

CLOSURE_LIBRARY = closure-library

jsdep:
	${CLOSURE_LIBRARY}/closure/bin/build/depswriter.py --root_with_prefix="src/static/js/traffique ../../../traffique" > src/static/js/traffique-deps.js

###########################################################
## Distribution
###########################################################

dist: all
	rm -rf dist
	cp -r src dist
	cp LICENSE dist
	rm -rf dist/*.pyc
	rm -rf dist/static/js/*
	src/static/js/closure-library/closure/bin/build/closurebuilder.py --root=src/static/js/traffique/ --root=src/static/js/closure-library/ --namespace="traffique.start" --output_mode=compiled --compiler_jar=compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--externs=src/static/js/maps-externs.js" --compiler_flags="--externs=src/static/js/gae-externs.js" > dist/static/js/traffique.js

###########################################################
## Clean
###########################################################

clean:
	rm -f $(VIEW_PY)

.PHONY : dist clean all
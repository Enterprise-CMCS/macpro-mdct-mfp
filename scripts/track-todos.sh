LD_LOG_FILE=logs/todos.log
GREP_FLAGS="-r -i -n -o -w -E -I"
EXCLUSIONS="--exclude-dir=.build --exclude-dir=.git --exclude-dir=coverage --exclude-dir=node_modules --exclude=track-todos.sh --exclude=*.log --exclude-dir=services/ui-src/build"

echo "# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n" > $LD_LOG_FILE

(grep $GREP_FLAGS $EXCLUSIONS "TODO:.*|TODO .*| TODO.*" . || echo "# All clear!") | sort >> $LD_LOG_FILE

LOG_START='\n\e[1;36m' # new line + bold + color
LOG_END='\n\e[0m' # new line + reset color

set -e -x

TIMESTAMP=`date "+%s"`
printf "${LOG_START}Removing components from node_modules folder...${LOG_END}"
rm -rf node_modules/components
printf "${LOG_START}Building components...${LOG_END}"
yarn --cwd ../components/ build
printf "${LOG_START}Packing components...${LOG_END}"
yarn --cwd ../components/ pack --filename components-$TIMESTAMP.tgz
printf "${LOG_START}Installing the lib${LOG_END}"
yarn add file:components-$TIMESTAMP.tgz
printf "${LOG_START}Removing packed file...${LOG_END}"
rm components-$TIMESTAMP.tgz

printf "${LOG_START}Done!.${LOG_END}"

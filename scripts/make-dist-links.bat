mkdir "../libs"

mkdir "../libs/zea-engine"
mklink /J "../libs/zea-engine/dist" "../node_modules/@zeainc/zea-engine/dist"
mklink /J "../libs/zea-engine/public-resources" "../node_modules/@zeainc/zea-engine/public-resources"

mkdir "../libs/zea-cad"
mklink /J "../libs/zea-cad/dist" "../node_modules/@zeainc/zea-cad/dist"

mkdir "../libs/zea-kinematics"
mklink /J "../libs/zea-kinematics/dist" "../node_modules/@zeainc/zea-kinematics/dist"

mkdir "../libs/zea-ux"
mklink /J "../libs/zea-ux/dist" "../node_modules/@zeainc/zea-ux/dist"

mkdir "../libs/zea-pointclouds"
mklink /J "../libs/zea-pointclouds/dist" "../node_modules/@zeainc/zea-pointclouds/dist"

mkdir "../libs/zea-web-components"
mklink /J "../libs/zea-web-components/dist" "../node_modules/@zeainc/zea-web-components/dist"

pause
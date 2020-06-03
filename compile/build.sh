
rm -R target/
mkdir -p target/
cp -R ../extension/ target/

sed -i '28i "applications": {"gecko": {"id": "anbarasanmbbs@gmail.com","strict_min_version": "53.0"}},' target/extension/manifest.json
cd ./target/extension/
jar -cfM ../extension.zip *
cd ..
rm -R extension/
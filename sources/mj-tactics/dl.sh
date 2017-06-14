#!bin/bash

for i in {1..9}
do
  curl http://yabejp.web.fc2.com/mahjong/img/tile_m/m${i}.png -o m${i}.png
  curl http://yabejp.web.fc2.com/mahjong/img/tile_m/p${i}.png -o p${i}.png
  curl http://yabejp.web.fc2.com/mahjong/img/tile_m/s${i}.png -o s${i}.png
  curl http://yabejp.web.fc2.com/mahjong/img/tile_m/j${i}.png -o j${i}.png
done
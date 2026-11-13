import sys
from PIL import Image
paths=sys.argv[2:]; ims=[Image.open(p) for p in paths]
w,h=ims[0].size; o=Image.new('RGB',(w*len(ims),h))
for i,im in enumerate(ims): o.paste(im,(i*w,0))
o.save(sys.argv[1])

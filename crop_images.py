from PIL import Image
import os

downloads_dir = r"C:\Users\anany\Downloads"
out_dir = r"c:\Users\anany\Metaverse\src\assets\images\modules"
os.makedirs(out_dir, exist_ok=True)

# Image 2 (2x2 grid)
img2_path = os.path.join(downloads_dir, "image2.png")
if os.path.exists(img2_path):
    img2 = Image.open(img2_path)
    w, h = img2.size
    # Top Left -> img1
    img2.crop((0, 0, w//2, h//2)).save(os.path.join(out_dir, "Rectangle 2758.png"))
    # Top Right -> img3
    img2.crop((w//2, 0, w, h//2)).save(os.path.join(out_dir, "Rectangle 2758 (2).png"))
    # Bottom Left -> img4
    img2.crop((0, h//2, w//2, h)).save(os.path.join(out_dir, "Rectangle 2758 (3).png"))
    # Bottom Right -> img6
    img2.crop((w//2, h//2, w, h)).save(os.path.join(out_dir, "Rectangle 2758 (5).png"))

# Image (Top/Bottom)
img1_path = os.path.join(downloads_dir, "image.png")
if os.path.exists(img1_path):
    img1 = Image.open(img1_path)
    w, h = img1.size
    # Top -> img2
    img1.crop((0, 0, w, h//2)).save(os.path.join(out_dir, "Rectangle 2758 (1).png"))
    # Bottom -> img5
    img1.crop((0, h//2, w, h)).save(os.path.join(out_dir, "Rectangle 2758 (4).png"))

print("Cropping complete.")

import sys
from collections import Counter
from PIL import Image

def get_colors(image_path, num_colors=10):
    img = Image.open(image_path)
    img = img.convert('RGB')
    
    pixels = list(img.getdata())
    
    # Filter out near white and near black
    def is_color_interesting(rgb):
        r, g, b = rgb
        if r > 240 and g > 240 and b > 240: return False
        if r < 15 and g < 15 and b < 15: return False
        return True
        
    interesting_pixels = [p for p in pixels if is_color_interesting(p)]
    
    counts = Counter(interesting_pixels)
    most_common = counts.most_common(num_colors)
    
    for color, count in most_common:
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        print(f"{hex_color} - rgb{color} - count: {count}")

get_colors('/Users/josh/Documents/GitHub/app/public/images/logo/waminna_logo.png')

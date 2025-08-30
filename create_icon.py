#!/usr/bin/env python3
"""
BuyRight App Icon Generator
Creates a 512x512 PNG icon with house + checkmark design
"""

from PIL import Image, ImageDraw, ImageFont
import math

def create_buyright_icon():
    # Create 512x512 canvas with BuyRight green background
    size = 512
    img = Image.new('RGBA', (size, size), (88, 204, 2, 255))  # #58CC02 - BuyRight green
    draw = ImageDraw.Draw(img)
    
    # Add subtle gradient effect (darker at edges)
    for i in range(size//8):
        alpha = int(20 * (i / (size//8)))
        draw.rectangle([i, i, size-i-1, size-i-1], 
                      outline=(70, 160, 0, alpha), width=1)
    
    # House outline - white
    house_color = (255, 255, 255, 255)
    house_width = 8
    
    # House base coordinates (centered, larger)
    house_left = size // 4
    house_right = 3 * size // 4
    house_bottom = 3 * size // 4 + 20
    house_top = size // 2 - 20
    
    # Draw house base rectangle
    draw.rectangle([house_left, house_top, house_right, house_bottom], 
                  outline=house_color, width=house_width)
    
    # Draw house roof (triangle)
    roof_peak_x = size // 2
    roof_peak_y = size // 4 - 10
    roof_points = [
        (house_left - 15, house_top),
        (roof_peak_x, roof_peak_y),
        (house_right + 15, house_top)
    ]
    draw.polygon(roof_points, outline=house_color, width=house_width)
    
    # Draw door
    door_width = 40
    door_height = 80
    door_left = roof_peak_x - door_width // 2
    door_right = roof_peak_x + door_width // 2
    door_top = house_bottom - door_height
    door_bottom = house_bottom
    
    draw.rectangle([door_left, door_top, door_right, door_bottom],
                  outline=house_color, width=4)
    
    # Draw door handle (small circle)
    handle_x = door_right - 12
    handle_y = door_top + door_height // 2
    draw.ellipse([handle_x-3, handle_y-3, handle_x+3, handle_y+3], 
                fill=house_color)
    
    # Draw two windows
    window_size = 35
    window_y = house_top + 40
    
    # Left window
    left_window_x = house_left + 35
    draw.rectangle([left_window_x, window_y, 
                   left_window_x + window_size, window_y + window_size],
                  outline=house_color, width=4)
    # Window cross
    draw.line([left_window_x + window_size//2, window_y,
               left_window_x + window_size//2, window_y + window_size],
              fill=house_color, width=2)
    draw.line([left_window_x, window_y + window_size//2,
               left_window_x + window_size, window_y + window_size//2],
              fill=house_color, width=2)
    
    # Right window
    right_window_x = house_right - 35 - window_size
    draw.rectangle([right_window_x, window_y,
                   right_window_x + window_size, window_y + window_size],
                  outline=house_color, width=4)
    # Window cross
    draw.line([right_window_x + window_size//2, window_y,
               right_window_x + window_size//2, window_y + window_size],
              fill=house_color, width=2)
    draw.line([right_window_x, window_y + window_size//2,
               right_window_x + window_size, window_y + window_size//2],
              fill=house_color, width=2)
    
    # Add chimney
    chimney_width = 25
    chimney_height = 60
    chimney_x = house_right - 50
    chimney_y = roof_peak_y + 30
    draw.rectangle([chimney_x, chimney_y, 
                   chimney_x + chimney_width, chimney_y + chimney_height],
                  outline=house_color, width=4, fill=(88, 204, 2, 255))
    
    # Big checkmark in bottom right (representing "right" choice)
    check_color = (255, 255, 255, 255)
    check_size = 80
    check_x = 3 * size // 4 + 30
    check_y = 3 * size // 4 + 30
    check_thickness = 12
    
    # Draw checkmark - two lines forming a check
    # First line (short, angled up-left to down-right)
    draw.line([check_x - 25, check_y - 5, 
               check_x - 5, check_y + 15], 
              fill=check_color, width=check_thickness)
    # Second line (long, angled down-left to up-right)  
    draw.line([check_x - 5, check_y + 15,
               check_x + 40, check_y - 30],
              fill=check_color, width=check_thickness)
    
    # Add subtle shadow/depth to checkmark
    shadow_offset = 3
    shadow_color = (60, 140, 0, 120)
    draw.line([check_x - 25 + shadow_offset, check_y - 5 + shadow_offset, 
               check_x - 5 + shadow_offset, check_y + 15 + shadow_offset], 
              fill=shadow_color, width=check_thickness)
    draw.line([check_x - 5 + shadow_offset, check_y + 15 + shadow_offset,
               check_x + 40 + shadow_offset, check_y - 30 + shadow_offset],
              fill=shadow_color, width=check_thickness)
    
    return img

def main():
    print("Creating BuyRight app icon...")
    icon = create_buyright_icon()
    
    # Save as PNG
    icon_path = "app-icon-512.png"
    icon.save(icon_path, "PNG", optimize=True)
    
    # Get file size
    import os
    file_size = os.path.getsize(icon_path)
    print(f"Icon saved as {icon_path}")
    print(f"Size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
    print(f"Dimensions: 512x512 pixels")
    print(f"Format: PNG")
    
    if file_size <= 1024 * 1024:  # 1MB limit
        print("✅ File size within 1MB limit")
    else:
        print("❌ File size exceeds 1MB limit")

if __name__ == "__main__":
    main()
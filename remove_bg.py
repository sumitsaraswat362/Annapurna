"""
Remove dark/black backgrounds from device mockup images,
making those pixels fully transparent.
"""
from PIL import Image
import numpy as np
import sys

def remove_dark_background(input_path, output_path, threshold=45):
    """
    Convert all pixels where R, G, and B are ALL below `threshold`
    to fully transparent. This removes dark/black backgrounds
    while preserving the device and its screen content.
    """
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Find pixels where R, G, B are all below threshold (dark/black areas)
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    dark_mask = (r < threshold) & (g < threshold) & (b < threshold)
    
    # Make those pixels transparent
    data[dark_mask, 3] = 0
    
    # For pixels near the threshold boundary, apply gradual transparency
    # to create a smooth edge (anti-aliasing)
    edge_low = threshold
    edge_high = threshold + 20
    edge_mask = (
        (r >= edge_low) & (r < edge_high) &
        (g >= edge_low) & (g < edge_high) &
        (b >= edge_low) & (b < edge_high)
    )
    # Calculate brightness for edge pixels
    brightness = np.maximum(np.maximum(r, g), b)
    edge_alpha = ((brightness.astype(float) - edge_low) / (edge_high - edge_low) * 255).clip(0, 255).astype(np.uint8)
    data[edge_mask, 3] = edge_alpha[edge_mask]
    
    result = Image.fromarray(data)
    result.save(output_path, "PNG")
    print(f"Done: {input_path} -> {output_path}")

if __name__ == "__main__":
    images = [
        ("public/images/macbook_hardware.png", "public/images/macbook_hardware.png"),
        ("public/images/ipad_hardware.png", "public/images/ipad_hardware.png"),
        ("public/images/iphone_hardware.png", "public/images/iphone_hardware.png"),
    ]
    for inp, out in images:
        remove_dark_background(inp, out)
    print("All images processed successfully!")

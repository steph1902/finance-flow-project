
from PIL import Image, ImageDraw, ImageFont
import os

# Create a white image
img = Image.new('RGB', (400, 600), color = 'white')
d = ImageDraw.Draw(img)

# Add text (simulating a receipt)
text = """
WALMART
Supercenter #1234
San Jose, CA 95123

Date: 2025-10-12
Time: 14:30

Items:
MILK 1GAL      $3.50
WHOLE WHEAT    $2.50
EGGS 12CT      $4.20
--------------------
TOTAL          $10.20
--------------------

Thank you for shopping!
"""

# Use default font
d.text((10,10), text, fill=(0,0,0))

# Save
img.save('/Users/step/Documents/finance-flow-project/receipt_test.png')
print("Created receipt_test.png")

import requests
import json

url = "https://thupnkdpkndpnvwsynav.supabase.co/rest/v1/shops"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBua2Rwa25kcG52d3N5bmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjkxMzUsImV4cCI6MjA4NDg0NTEzNX0.qrGtn9yL-KGyyxrzyNxntUCIIqV42Ax-ZaOZFnzwD0g",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBua2Rwa25kcG52d3N5bmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjkxMzUsImV4cCI6MjA4NDg0NTEzNX0.qrGtn9yL-KGyyxrzyNxntUCIIqV42Ax-ZaOZFnzwD0g",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# 1. Fetch shops
response = requests.get(url, headers=headers)
shops = response.json()

target_shop = None
for s in shops:
    if s.get('banner_url') and s['banner_url'].endswith('.mp4'):
        target_shop = s
        break

if not target_shop:
    # Try any shop if no mp4 found
    for s in shops:
        if s.get('banner_url'):
            target_shop = s
            break

if target_shop:
    shop_id = target_shop['id']
    banner_url = target_shop['banner_url']
    print(f"Updating shop {shop_id} with banner: {banner_url}")

    # Update gallery
    gallery_images = target_shop.get('gallery_images', [])
    if gallery_images:
        new_gallery = [banner_url] * len(gallery_images)
    else:
        new_gallery = [banner_url] * 3 # add some if empty

    # Update products
    products = target_shop.get('products', [])
    new_products = []
    for p in products:
        p['imageUrl'] = banner_url
        new_products.append(p)

    update_payload = {
        "gallery_images": new_gallery,
        "products": new_products
    }

    patch_response = requests.patch(f"{url}?id=eq.{shop_id}", headers=headers, data=json.dumps(update_payload))
    if patch_response.status_code in [200, 204]:
        print("Successfully updated shop data.")
    else:
        print(f"Failed to update: {patch_response.status_code}")
        print(patch_response.text)
else:
    print("No shop found with a banner URL.")

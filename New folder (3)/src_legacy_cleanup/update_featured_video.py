import requests
import json

url = "https://thupnkdpkndpnvwsynav.supabase.co/rest/v1/shops"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBua2Rwa25kcG52d3N5bmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjkxMzUsImV4cCI6MjA4NDg0NTEzNX0.qrGtn9yL-KGyyxrzyNxntUCIIqV42Ax-ZaOZFnzwD0g",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBua2Rwa25kcG52d3N5bmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjkxMzUsImV4cCI6MjA4NDg0NTEzNX0.qrGtn9yL-KGyyxrzyNxntUCIIqV42Ax-ZaOZFnzwD0g",
    "Content-Type": "application/json"
}

# 1. Fetch
response = requests.get(url, headers=headers)
shops = response.json()

target_shop = shops[0] # Single tenant assumption
shop_id = target_shop['id']
social_links = target_shop.get('social_links', {})

# 2. Update
social_links['featured_video'] = "https://www.youtube.com/watch?v=kYF9un26R7I"

patch_response = requests.patch(f"{url}?id=eq.{shop_id}", headers=headers, data=json.dumps({"social_links": social_links}))
if patch_response.status_code in [200, 204]:
    print("Successfully updated featured video.")
else:
    print(f"Failed to update: {patch_response.status_code}")
    print(patch_response.text)

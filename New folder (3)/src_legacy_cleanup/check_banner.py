import requests
import json

url = "https://thupnkdpkndpnvwsynav.supabase.co/rest/v1/shops?select=banner_url,shop_name"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBua2Rwa25kcG52d3N5bmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjkxMzUsImV4cCI6MjA4NDg0NTEzNX0.qrGtn9yL-KGyyxrzyNxntUCIIqV42Ax-ZaOZFnzwD0g",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBua2Rwa25kcG52d3N5bmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjkxMzUsImV4cCI6MjA4NDg0NTEzNX0.qrGtn9yL-KGyyxrzyNxntUCIIqV42Ax-ZaOZFnzwD0g"
}

response = requests.get(url, headers=headers)
if response.status_code == 200:
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.status_code}")
    print(response.text)

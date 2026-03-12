import json
import base64
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Определяет растение по фото через GPT-4 Vision и возвращает подробное описание на русском языке."""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": cors_headers, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    image_data = body.get("image")

    if not image_data:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Нет изображения"})}

    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    openai_key = os.environ["OPENAI_API_KEY"]

    prompt = """Ты — эксперт-ботаник по флоре Дальнего Востока России. Определи растение на фото.

Ответь СТРОГО в формате JSON без лишнего текста:
{
  "name": "Русское название растения",
  "latinName": "Латинское название",
  "confidence": число от 0 до 100,
  "family": "Семейство (на русском)",
  "description": "Подробное описание растения 2-3 предложения",
  "characteristics": [
    {"icon": "Ruler", "label": "Высота", "value": "значение"},
    {"icon": "Calendar", "label": "Цветение", "value": "период"},
    {"icon": "Droplets", "label": "Среда", "value": "описание среды обитания"},
    {"icon": "ShieldAlert", "label": "Статус", "value": "охранный статус или обычный вид"}
  ],
  "habitat": "Описание мест произрастания на Дальнем Востоке России",
  "tags": ["тег1", "тег2", "тег3"],
  "found": true
}

Если растение не определяется или фото не содержит растение — верни found: false и name: "Растение не определено"."""

    request_body = json.dumps({
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_data}",
                            "detail": "high"
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.3
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=request_body,
        headers={
            "Authorization": f"Bearer {openai_key}",
            "Content-Type": "application/json",
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    content = result["choices"][0]["message"]["content"].strip()

    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    content = content.strip()

    plant_data = json.loads(content)

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps(plant_data, ensure_ascii=False)
    }

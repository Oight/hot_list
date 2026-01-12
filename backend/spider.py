from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

headers = {
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0"
        }

url = "https://api.bilibili.com/x/web-interface/wbi/search/square?limit=10"

@app.route('/bilibili', methods=['GET'])
def get_bilibili():
    res = requests.get(url, headers=headers)
    data = res.json()
    
    hot_list = data['data']['trending']['list']
    
    hot_data = [
            {
                "id": idx + 1,
                "keyword": item['keyword']
                }
            for idx, item in enumerate(hot_list)
            ]

    return jsonify({
        "code": 200,
        "msg": "success",
        "data": hot_data
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 5000)

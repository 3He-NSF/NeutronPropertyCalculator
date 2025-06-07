from flask import Flask, render_template, jsonify, request
import numpy as np

app = Flask(__name__)

# 物理定数
h = 6.62607015e-34  # プランク定数 (J⋅s)
m_n = 1.67492749804e-27  # 中性子の質量 (kg)
k_B = 1.380649e-23  # ボルツマン定数 (J/K)

def calculate_neutron_properties(value, input_type):
    """中性子の物理量を計算する関数"""
    if input_type == 'wavelength':
        # 波長から他の物理量を計算
        wavelength = value * 1e-10  # Åからmに変換
        velocity = h / (m_n * wavelength)
        energy = 0.5 * m_n * velocity**2
        temperature = energy / k_B
    elif input_type == 'energy':
        # エネルギーから他の物理量を計算
        energy = value * 1.602176634e-19  # eVからJに変換
        velocity = np.sqrt(2 * energy / m_n)
        wavelength = h / (m_n * velocity)
        temperature = energy / k_B
    elif input_type == 'temperature':
        # 温度から他の物理量を計算
        temperature = value
        energy = k_B * temperature
        velocity = np.sqrt(2 * energy / m_n)
        wavelength = h / (m_n * velocity)
    elif input_type == 'velocity':
        # 速度から他の物理量を計算
        velocity = value
        energy = 0.5 * m_n * velocity**2
        wavelength = h / (m_n * velocity)
        temperature = energy / k_B

    return {
        'wavelength': wavelength * 1e10,  # mからÅに変換
        'energy': energy / 1.602176634e-19,  # JからeVに変換
        'temperature': temperature,
        'velocity': velocity
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    value = float(data['value'])
    input_type = data['type']

    result = calculate_neutron_properties(value, input_type)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
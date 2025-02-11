from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
import os

load_dotenv()

app = Flask(__name__)

# Initialize Groq model
model = ChatGroq(model_name="llama3-8b-8192", temperature=0.7)

def generate_response(user_input):
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful hospital receptionist assistant. Provide clear and concise answers to the user's queries."),
        ("human", "{input}")
    ])
    chain = prompt_template | model | StrOutputParser()
    return chain.invoke({"input": user_input})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/doctors')
def doctors():
    return render_template('doctors.html')

@app.route('/service')
def services():
    return render_template('service.html')

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['message']
    response = generate_response(user_input)
    return jsonify({'response': response})

if __name__ == '__main__':
    # This line ensures the app works in production environments like Railway
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)

import time

import requests
import torch
import transformers
from transformers import AutoTokenizer

api_url = "https://pcr.dog/hacksgiving"

model = "tiiuae/falcon-7b-instruct"

tokenizer = AutoTokenizer.from_pretrained(model)
pipeline = transformers.pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    torch_dtype=torch.bfloat16,
    trust_remote_code=True,
    device_map="auto",
)


def generate(input: str):
    sequences = pipeline(
        input,
        max_length=200,
        do_sample=True,
        top_k=10,
        num_return_sequences=1,
        eos_token_id=tokenizer.eos_token_id,
    )
    return sequences


def get_work():
    print("Getting work")
    res = requests.get(api_url + "/getResponseRequests")
    if res.status_code == 418:
        print("No work available")
        return None, None
    if res.status_code != 200:
        print("Error getting work")
        return None, None
    print("Work received")
    json = res.json()
    return json["id"], json["userInput"]


def main():
    while True:
        id, input = get_work()
        if id is None or input is None:
            time.sleep(5)
            continue
        print("Generating response")
        sequences = generate(input)
        output = ""
        for seq in sequences:
            output += seq + "\n"
        body = {"id": id, "generatedResponse": output}
        requests.post(api_url + "/postGeneratedResponse", json=body)


main()

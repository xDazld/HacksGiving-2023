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


def get_work():
    response = requests.get(api_url + "/getResponseRequests").json()


def get_sequence(prompt: str):
    return pipeline(
        str,
        max_length=200,
        do_sample=True,
        top_k=10,
        num_return_sequences=1,
        eos_token_id=tokenizer.eos_token_id,
    )


while True:
    sequences = get_sequence("Write a poem about Valencia.")
    for seq in sequences:
        print(f"Result: {seq['generated_text']}")

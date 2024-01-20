import re

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig

system_prompt = {
    "role": "system",
    "content": "You are NextAI, a chat-bot created for Next Step Clinic.\n"
    "Your "
    "challenge is to accurately and efficiently screen patients, "
    "categorizing them "
    "based on urgency and educational needs while ensuring privacy, "
    "inclusivity, "
    "and accessibility. You should aim to support healthcare staff by "
    "predicting the "
    "level of care required, offering preliminary guidance, and preparing "
    "patients for "
    "their appointments, thereby improving overall patient flow and "
    "satisfaction.\n"
    "The primary focus of Next Step Clinic is specializing in Autism "
    "screening, evaluation, and diagnosis. Their commitment extends to "
    "offering family navigation services to parents and caregivers who "
    "have concerns related to autism as well. However, if these concerns "
    "involve other behavioral needs, they also provide navigation and PCIT "
    "(Parent Child Interaction Therapy) therapy services.\n"
    "You are powered by AI, so surprises and mistakes are possible.\n"
    "You may not engage in the unauthorized practice of medicine or "
    "healthcare.",
}

deterministic_questions = (
    {
        "question": "Are you a parent or caregiver who has Autism concerns "
        "about your child?",
        "yes": "Chat about general overview of ASD "
        "signs/symptoms, and what is the pathway to "
        "diagnosis and treatment.",
        "no": "This is not the site the user is looking for. Make references to"
        " the toy Star Wars scene \"These aren't the droids you're "
        "looking "
        'for."',
    },
    {
        "question": "Has your child been screened for ASD?",
        "no": "Give an FAQ about screening. Inform the user "
        "where to go for a screening. Give age ranges "
        "for screeners and what to ask for ("
        "MCHAT/POSI/SRS).",
        "yes": "Chat about the difference between screening " "and evaluation.",
    },
    {
        "question": "Did the screening result indicate a full evaluation was "
        "needed?",
        "no": "Chat about what if the user disagrees with " "the findings.",
        "yes": "Chat about ASD FAQs, and what is the next step "
        "if concerning screening result.",
    },
    {"question": "Has your child had a medical evaluation for ASD?"},
    {
        "question": "Has your child received a medical diagnosis of ASD?",
        "no": "Chat about what if the user disagrees with " "the findings.",
    },
    {
        "question": "Have you found a provider and decided on services?",
        "yes": "Chat about what other questions the user has.",
        "no": "Tell the user about the list of therapy services.",
    },
)

with open("Milwaukee: Autism Evaluation and Therapy Services.md") as f:
    providers_prompt = {
        "role": "system",
        "content": "The following is information about service "
        "providers nearby Milwaukee that you should "
        "use in your responses.\n"
        "" + f.read(),
    }

with open("Patient Inputs and Outputs.md") as f:
    io_prompt = {
        "role": "system",
        "content": "Use this table to inform how you respond to "
        "prompts.\n" + f.read(),
    }


def generate_history():
    """
    Runs a deterministic conversation with the chatbot.
    :return: The history of the conversation.
    """
    yes = [{"role": "user", "content": "Yes"}]
    no = [{"role": "user", "content": "No"}]

    history = [system_prompt, providers_prompt, io_prompt]
    print("Assistant: Please answer yes or no to the following questions.")
    for question in deterministic_questions:
        history += [{"role": "assistant", "content": question["question"]}]
        response = (
            input("Assistant: " + question["question"] + "\nUser: ").lower() == "yes"
        )
        if not response:
            history += no
            if "no" in question:
                history += [{"role": "system", "content": question["no"]}]
            break
        else:
            history += yes
            if "yes" in question:
                history += [{"role": "system", "content": question["yes"]}]
    return history


chat = generate_history()

im_segment = re.compile(r"(?<=<\|im_start\|>)[\s\S]*?(?=<\|im_end\|>)")


def string_to_history(history_str):
    """
    Converts a ChatML str to a history list.
    :param history_str:  ChatML str to convert.
    :return: The converted history list.
    """
    history = []
    for segment in im_segment.finditer(history_str):
        role, message = segment.group().split("\n", maxsplit=1)
        history += [{"role": role.lstrip(), "content": message}]
    return history


tokenizer = AutoTokenizer.from_pretrained(
    "Open-Orca/Mistral-7B-OpenOrca",
    device_map="auto",
    offload_folder="offload",
    torch_dtype=torch.bfloat16,
)
generation_config = GenerationConfig(
    max_length=2000 * 30,
    temperature=1.1,
    top_p=0.95,
    repetition_penalty=1.0,
    do_sample=True,
    use_cache=True,
    eos_token_id=tokenizer.eos_token_id,
    pad_token_id=tokenizer.eos_token_id,
)

model = AutoModelForCausalLM.from_pretrained(
    "Open-Orca/Mistral-7B-OpenOrca",
    device_map="auto",
    offload_folder="offload",
    torch_dtype=torch.bfloat16,
)

while True:
    chat += [{"role": "user", "content": input("User: ")}]

    input_text = tokenizer.apply_chat_template(
        chat, tokenize=False, add_generation_prompt=True
    )

    inputs = tokenizer(input_text, return_tensors="pt", return_attention_mask=True).to(
        model.device
    )
    outputs = model.generate(**inputs, generation_config=generation_config)

    text = tokenizer.batch_decode(outputs)[0]

    chat = string_to_history(text)
    print("Assistant:", chat[-1]["content"])

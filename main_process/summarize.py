from transformers import pipeline

summarizer = pipeline('summarization',model = 'facebook/bart-large-cnn')

def summarize_products(text_blocks):
    combines = ' '.join(text_blocks)[:3000]
    return combines